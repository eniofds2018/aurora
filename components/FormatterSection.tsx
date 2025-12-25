
import React, { useState } from 'react';
import { formatReference } from '../services/geminiService';
import { saveItem } from '../services/storageService';

const FormatterSection: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [standard, setStandard] = useState('ABNT (NBR 6023)');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const standards = [
    'ABNT (NBR 6023)',
    'APA (7th Edition)',
    'Vancouver',
    'Chicago Style'
  ];

  const handleFormat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setLoading(true);
    setIsSaved(false);
    try {
      const formatted = await formatReference(inputText, standard);
      setResult(formatted);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      saveItem('formatter', `Referência: ${inputText.slice(0, 30)}...`, result, { standard });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert('Referência copiada!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-6 md:p-10">
      <div className="mb-10 text-center">
        <h2 className="academic-title text-4xl text-slate-900 font-bold mb-4">Normalização Bibliográfica</h2>
        <p className="text-slate-600 text-lg">
          Cole dados brutos, links de artigos ou referências incompletas para que Aurora aplique o rigor das normas acadêmicas.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <form onSubmit={handleFormat} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Dados da Obra ou Referência Bruta
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
                className="w-full px-4 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none text-slate-700"
                placeholder="Ex: SILVA, J. IA na educação. Revista Brasileira de Tecnologia. 2023. v.10, n.2... ou apenas o link do artigo."
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {standards.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStandard(s)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      standard === s 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check-double"></i>}
                <span>{loading ? 'Formatando...' : 'Formatar AGORA'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="p-8 bg-slate-50">
          {result ? (
            <div className="animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resultado em {standard}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSave}
                    disabled={isSaved}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center ${
                      isSaved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    <i className={`fa-solid ${isSaved ? 'fa-check' : 'fa-bookmark'} mr-2`}></i>
                    {isSaved ? 'Salvo' : 'Salvar'}
                  </button>
                  <button 
                    onClick={copyResult}
                    className="px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center text-sm font-bold"
                  >
                    <i className="fa-solid fa-copy mr-2"></i> Copiar
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-inner">
                <p className="text-slate-800 font-serif italic text-lg leading-relaxed whitespace-pre-wrap">
                  {result}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-300 opacity-60">
              <i className="fa-solid fa-quote-left text-4xl mb-3"></i>
              <p className="font-medium">Aguardando entrada para normalização...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormatterSection;
