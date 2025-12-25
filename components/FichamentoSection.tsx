
import React, { useState, useRef, useEffect } from 'react';
import { generateFichamento, consolidateFichamentos } from '../services/geminiService';
import { saveItem } from '../services/storageService';

interface FileState {
  id: string;
  file: File;
  status: 'pending' | 'reading' | 'analyzing' | 'done' | 'error';
  result?: string;
  error?: string;
}

const FichamentoSection: React.FC = () => {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [standard, setStandard] = useState('ABNT (NBR 6023)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [synthesisResult, setSynthesisResult] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showSynthesis, setShowSynthesis] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const standards = ['ABNT (NBR 6023)', 'APA (7th Edition)', 'Vancouver'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: 'pending' as const
      }));
      setFileStates(prev => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const processFiles = async () => {
    setIsProcessing(true);
    const pending = fileStates.filter(f => f.status === 'pending');
    
    for (const f of pending) {
      updateFileStatus(f.id, 'reading');
      try {
        const base64 = await fileToBase64(f.file);
        updateFileStatus(f.id, 'analyzing');
        const output = await generateFichamento(base64, f.file.type, standard);
        updateFileStatus(f.id, 'done', output);
        // Expandir automaticamente o novo resultado
        setExpandedIds(prev => new Set(prev).add(f.id));
      } catch (err) {
        updateFileStatus(f.id, 'error', undefined, 'Falha ao processar arquivo.');
      }
    }
    setIsProcessing(false);
  };

  const updateFileStatus = (id: string, status: FileState['status'], result?: string, error?: string) => {
    setFileStates(prev => prev.map(f => 
      f.id === id ? { ...f, status, result: result || f.result, error } : f
    ));
  };

  const removeFile = (id: string) => {
    setFileStates(prev => prev.filter(f => f.id !== id));
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scrollToItem = (id: string) => {
    const element = itemRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Se não estiver expandido, expandir
      if (!expandedIds.has(id)) {
        toggleExpand(id);
      }
    }
  };

  const handleConsolidate = async () => {
    const completedResults = fileStates
      .filter(f => f.status === 'done' && f.result)
      .map(f => f.result!);
    
    if (completedResults.length < 2) {
      alert('Aurora: Selecione ao menos 2 arquivos já analisados para criar uma síntese comparativa.');
      return;
    }

    setIsSynthesizing(true);
    try {
      const synthesis = await consolidateFichamentos(completedResults);
      setSynthesisResult(synthesis);
      setShowSynthesis(true);
      setTimeout(() => {
        itemRefs.current['synthesis']?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      alert('Erro ao gerar síntese comparativa.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSaveItem = (id: string, type: 'fichamento' | 'synthesis') => {
    if (type === 'synthesis' && synthesisResult) {
      saveItem('fichamento', 'Síntese de Grupo: ' + new Date().toLocaleDateString(), synthesisResult);
    } else {
      const item = fileStates.find(f => f.id === id);
      if (item?.result) {
        saveItem('fichamento', `Fichamento: ${item.file.name}`, item.result);
      }
    }
    alert('Salvo na biblioteca!');
  };

  const expandAll = () => {
    const allIds = fileStates.filter(f => f.status === 'done').map(f => f.id);
    setExpandedIds(new Set(allIds));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
    setShowSynthesis(false);
  };

  const doneFiles = fileStates.filter(f => f.status === 'done');

  return (
    <div className="max-w-7xl mx-auto w-full p-6 md:p-10">
      <div className="mb-10 text-center">
        <h2 className="academic-title text-4xl text-slate-900 font-bold mb-4">Análise Multidocumental</h2>
        <p className="text-slate-600 text-lg max-w-3xl mx-auto">
          Gerencie múltiplos artigos em uma única interface. Navegue pelos resultados individuais 
          ou gere um panorama transversal da literatura.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Painel de Controle Lateral */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 bg-white rounded-3xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              multiple
              accept="application/pdf,image/*"
            />
            <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-cloud-arrow-up text-indigo-600 text-xl"></i>
            </div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Carregar Novos Artigos</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-400px)]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fila de Trabalho ({fileStates.length})</span>
              <div className="flex space-x-1">
                {standards.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setStandard(s)}
                    className={`px-2 py-1 rounded text-[9px] font-bold transition-colors ${standard === s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                  >
                    {s.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
              {fileStates.map((f) => (
                <div 
                  key={f.id} 
                  onClick={() => f.status === 'done' && scrollToItem(f.id)}
                  className={`p-3 rounded-xl border-2 transition-all group ${
                    f.status === 'done' 
                      ? 'border-slate-100 bg-white hover:border-indigo-200 cursor-pointer shadow-sm hover:shadow-md'
                      : 'border-slate-50 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2 truncate mr-2">
                      {f.status === 'done' ? (
                        <i className="fa-solid fa-check-circle text-emerald-500"></i>
                      ) : f.status === 'analyzing' || f.status === 'reading' ? (
                        <i className="fa-solid fa-spinner fa-spin text-indigo-500"></i>
                      ) : f.status === 'error' ? (
                        <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
                      ) : (
                        <i className="fa-solid fa-clock text-slate-300"></i>
                      )}
                      <span className={`text-xs font-bold truncate ${f.status === 'done' ? 'text-slate-800' : 'text-slate-500'}`}>{f.file.name}</span>
                    </div>
                    {!isProcessing && (
                      <button onClick={(e) => { e.stopPropagation(); removeFile(f.id); }} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">
                      {f.status === 'pending' ? 'Aguardando' : f.status === 'reading' ? 'Processando Arquivo' : f.status === 'analyzing' ? 'Aurora Interpretando' : f.status === 'done' ? 'Fichamento Pronto' : 'Erro de Leitura'}
                    </span>
                  </div>
                </div>
              ))}
              
              {fileStates.length === 0 && (
                <div className="text-center py-10">
                  <i className="fa-solid fa-box-open text-3xl text-slate-200 mb-2"></i>
                  <p className="text-[10px] text-slate-400 uppercase font-bold italic">Nenhum artigo pendente</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
              <button
                onClick={processFiles}
                disabled={isProcessing || fileStates.filter(f => f.status === 'pending').length === 0}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all disabled:opacity-30 flex items-center justify-center"
              >
                <i className="fa-solid fa-microscope mr-2"></i> Analisar Seleção
              </button>
              <button
                onClick={handleConsolidate}
                disabled={isProcessing || isSynthesizing || doneFiles.length < 2}
                className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-30 flex items-center justify-center"
              >
                {isSynthesizing ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-layer-group mr-2"></i>}
                Síntese Comparativa
              </button>
            </div>
          </div>
        </div>

        {/* Feed de Resultados Dinâmico */}
        <div className="lg:col-span-8 space-y-6 min-h-[600px]">
          {doneFiles.length > 0 || synthesisResult ? (
            <>
              {/* Toolbar de Visualização */}
              <div className="flex items-center justify-between bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm sticky top-24 z-10">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Feed de Análise Ativo</span>
                </div>
                <div className="flex space-x-3">
                  <button onClick={expandAll} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider transition-colors">Expandir Tudo</button>
                  <button onClick={collapseAll} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider transition-colors">Recolher Tudo</button>
                </div>
              </div>

              {/* Cards de Resultados */}
              <div className="space-y-4">
                {/* Síntese Comparativa (Sempre no Topo se existir) */}
                {synthesisResult && (
                  <div 
                    ref={el => itemRefs.current['synthesis'] = el}
                    className="bg-indigo-900 text-white rounded-3xl shadow-xl overflow-hidden border border-indigo-700 animate-in fade-in slide-in-from-top-4 duration-500"
                  >
                    <div 
                      onClick={() => setShowSynthesis(!showSynthesis)}
                      className="p-6 cursor-pointer flex justify-between items-center group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-200">
                          <i className="fa-solid fa-layer-group text-lg"></i>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Síntese Comparativa Transversal</h3>
                          <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">Consolidação de {doneFiles.length} Artigos</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleSaveItem('synthesis', 'synthesis'); }}
                          className="bg-indigo-600 p-2 rounded-lg hover:bg-indigo-500 transition-colors"
                        >
                          <i className="fa-solid fa-bookmark text-xs"></i>
                        </button>
                        <i className={`fa-solid fa-chevron-${showSynthesis ? 'up' : 'down'} text-indigo-400 transition-transform`}></i>
                      </div>
                    </div>
                    {showSynthesis && (
                      <div className="p-8 pt-2 bg-indigo-950/50 border-t border-indigo-800/50">
                        <div className="whitespace-pre-wrap text-indigo-50 leading-relaxed font-sans text-base">
                          {synthesisResult}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Fichamentos Individuais */}
                {doneFiles.map((f) => (
                  <div 
                    key={f.id}
                    ref={el => itemRefs.current[f.id] = el}
                    className={`bg-white rounded-3xl border transition-all duration-300 ${
                      expandedIds.has(f.id) 
                        ? 'border-indigo-400 shadow-xl scale-[1.01]' 
                        : 'border-slate-200 shadow-sm hover:border-slate-300'
                    }`}
                  >
                    <div 
                      onClick={() => toggleExpand(f.id)}
                      className="p-5 cursor-pointer flex justify-between items-center group"
                    >
                      <div className="flex items-center space-x-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          expandedIds.has(f.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                        }`}>
                          <i className="fa-solid fa-file-contract text-lg"></i>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 truncate pr-4">{f.file.name}</h4>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Fichamento Estruturado • {standard.split(' ')[0]}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        {expandedIds.has(f.id) && (
                          <div className="flex space-x-2 animate-in fade-in slide-in-from-right-2">
                             <button 
                              onClick={(e) => { e.stopPropagation(); handleSaveItem(f.id, 'fichamento'); }}
                              className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                              title="Salvar na Biblioteca"
                            >
                              <i className="fa-solid fa-bookmark text-xs"></i>
                            </button>
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                navigator.clipboard.writeText(f.result || '');
                                alert('Conteúdo copiado!');
                              }}
                              className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                              title="Copiar Texto"
                            >
                              <i className="fa-solid fa-copy text-xs"></i>
                            </button>
                          </div>
                        )}
                        <i className={`fa-solid fa-chevron-${expandedIds.has(f.id) ? 'up' : 'down'} text-slate-300 group-hover:text-slate-500 transition-transform`}></i>
                      </div>
                    </div>
                    {expandedIds.has(f.id) && (
                      <div className="p-8 pt-2 bg-slate-50/50 border-t border-slate-100 rounded-b-3xl">
                        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans text-sm md:text-base animate-in fade-in duration-500">
                          {f.result}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-12 text-center bg-white/50 backdrop-blur-sm">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <i className="fa-solid fa-wand-magic-sparkles text-4xl text-indigo-200"></i>
              </div>
              <h3 className="font-bold text-xl text-slate-600 mb-2">Workspace de Análise</h3>
              <p className="max-w-md text-sm leading-relaxed text-slate-400">
                Carregue os artigos científicos no painel lateral. Aurora processará cada documento individualmente e disponibilizará o conteúdo estruturado aqui.
              </p>
              <div className="mt-8 flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                <span className="flex items-center"><i className="fa-solid fa-check mr-1 text-emerald-300"></i> Leitura de PDF</span>
                <span className="flex items-center"><i className="fa-solid fa-check mr-1 text-emerald-300"></i> Extração de Dados</span>
                <span className="flex items-center"><i className="fa-solid fa-check mr-1 text-emerald-300"></i> Síntese Crítica</span>
              </div>
            </div>
          )}
          <div ref={resultsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default FichamentoSection;
