
import React, { useState, useEffect } from 'react';
import { SavedItem, ItemType } from '../types';
import { getAllItems, deleteItem } from '../services/storageService';

const LibrarySection: React.FC = () => {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [filter, setFilter] = useState<ItemType | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<SavedItem | null>(null);

  const loadItems = () => {
    const data = getAllItems();
    setItems([...data]);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Aurora: Confirmar exclusão definitiva deste registro?')) {
      deleteItem(id);
      loadItems(); 
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const filteredItems = filter === 'all' ? items : items.filter(i => i.type === filter);

  const getTypeLabel = (type: ItemType) => {
    switch (type) {
      case 'search': return 'Pesquisa';
      case 'fichamento': return 'Fichamento';
      case 'methodology': return 'Estrutura';
      case 'formatter': return 'Citação';
      case 'advisor': return 'Orientação';
      case 'project': return 'Projeto';
      default: return 'Documento';
    }
  };

  const getTypeIcon = (type: ItemType) => {
    switch (type) {
      case 'search': return 'fa-magnifying-glass text-blue-500';
      case 'fichamento': return 'fa-file-lines text-emerald-500';
      case 'methodology': return 'fa-vial-circle-check text-purple-500';
      case 'formatter': return 'fa-quote-right text-amber-500';
      case 'advisor': return 'fa-user-tie text-indigo-500';
      case 'project': return 'fa-diagram-project text-rose-500';
      default: return 'fa-file text-slate-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-6 md:p-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="academic-title text-4xl text-slate-900 font-bold mb-4">Minha Biblioteca</h2>
          <p className="text-slate-600 text-lg">Arquivo pessoal de produções e referências salvas.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {(['all', 'search', 'advisor', 'project', 'fichamento', 'methodology', 'formatter'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {f === 'all' ? 'Tudo' : getTypeLabel(f as ItemType)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List Side */}
        <div className="lg:col-span-5 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group relative ${
                  selectedItem?.id === item.id 
                    ? 'border-indigo-500 bg-white shadow-lg' 
                    : 'border-white bg-white/50 hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 mb-2">
                    <i className={`fa-solid ${getTypeIcon(item.type)} text-lg`}></i>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{getTypeLabel(item.type)}</span>
                  </div>
                  
                  <button 
                    onClick={(e) => handleDelete(item.id, e)}
                    className="relative z-20 p-2 text-slate-300 hover:text-red-500 transition-all md:opacity-0 md:group-hover:opacity-100 bg-transparent"
                    title="Excluir item da Aurora"
                  >
                    <i className="fa-solid fa-trash-can text-sm"></i>
                  </button>
                </div>
                <h4 className="font-bold text-slate-800 mb-1 truncate pr-8">{item.title}</h4>
                <p className="text-[11px] text-slate-400">
                  <i className="fa-regular fa-calendar-check mr-1"></i>
                  {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
              <i className="fa-solid fa-folder-open text-4xl text-slate-300 mb-4"></i>
              <p className="text-slate-400 font-medium">Nenhum registro encontrado.</p>
            </div>
          )}
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col h-full max-h-[70vh]">
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div className="truncate pr-4">
                  <h3 className="font-bold text-xl truncate">{selectedItem.title}</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                    {getTypeLabel(selectedItem.type)} • {new Date(selectedItem.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(selectedItem.content);
                    alert('Copiado para sua área de transferência.');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-xl transition-colors flex-shrink-0"
                  title="Copiar Conteúdo"
                >
                  <i className="fa-solid fa-copy"></i>
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1 bg-slate-50">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans text-sm md:text-base">
                  {selectedItem.content}
                </div>
                
                {selectedItem.metadata?.sources && (
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h5 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Fontes de Grounding</h5>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedItem.metadata.sources.map((s: any, i: number) => (
                        <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-xs hover:underline truncate flex items-center">
                          <i className="fa-solid fa-link mr-2 text-[10px]"></i>{s.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white/50">
              <i className="fa-solid fa-magnifying-glass-chart text-5xl mb-4 opacity-20"></i>
              <h3 className="font-bold text-lg mb-2">Selecione um documento</h3>
              <p className="max-w-xs text-sm">Visualize detalhes, referências e produções salvas anteriormente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarySection;
