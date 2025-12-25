
import React, { useState } from 'react';
import { getAcademicAdvice } from '../services/geminiService';
import { saveItem } from '../services/storageService';

const AdvisorSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setIsSaved(false);
    try {
      const advice = await getAcademicAdvice(query);
      setResult(advice);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      saveItem('advisor', `Orientação: ${query.slice(0, 30)}...`, result);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-6 md:p-10">
      <div className="mb-10 text-center">
        <h2 className="academic-title text-4xl text-slate-900 font-bold mb-4">Orientador Virtual</h2>
        <p className="text-slate-600 text-lg">
          Dúvidas sobre carreira acadêmica, escrita científica ou dilemas de pesquisa? 
          Aurora oferece uma mentoria metodológica baseada nas melhores práticas mundiais.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 mb-8">
        <form onSubmit={handleAdvice} className="space-y-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none min-h-[120px]"
            placeholder="Ex: Como posso delimitar melhor meu tema de pesquisa sobre sustentabilidade urbana?"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-comments"></i>}
            <span>{loading ? 'Consultando Aurora...' : 'Solicitar Orientação'}</span>
          </button>
        </form>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg relative">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Parecer da Orientadora</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Resposta Gerada por IA</p>
                </div>
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaved}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isSaved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <i className={`fa-solid ${isSaved ? 'fa-check' : 'fa-bookmark'}`}></i>
                <span>{isSaved ? 'Salvo' : 'Salvar Parecer'}</span>
              </button>
            </div>
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans text-base">
              {result}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisorSection;
