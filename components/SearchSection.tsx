
import React, { useState } from 'react';
import { performAcademicSearch } from '../services/geminiService';
import { ResearchResponse } from '../types';
import { saveItem } from '../services/storageService';

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setIsSaved(false);
    try {
      const data = await performAcademicSearch(query);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      saveItem('search', query, result.content, { sources: result.sources });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-6 md:p-10">
      <div className="mb-10 text-center">
        <h2 className="academic-title text-4xl text-slate-900 font-bold mb-4">Busca Científica Qualificada</h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Aurora consulta bases de dados globais para encontrar artigos reais com DOI, 
          eliminando referências falsas e auxiliando na sua revisão de literatura.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-12">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Impactos da inteligência artificial na educação médica..."
            className="w-full pl-6 pr-32 py-5 bg-white border-2 border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 transition-all outline-none text-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-paper-plane"></i>
            )}
            <span>{loading ? 'Buscando...' : 'Consultar'}</span>
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-400">
          <span className="bg-slate-200 px-2 py-1 rounded">Scopus</span>
          <span className="bg-slate-200 px-2 py-1 rounded">Web of Science</span>
          <span className="bg-slate-200 px-2 py-1 rounded">SciELO</span>
          <span className="bg-slate-200 px-2 py-1 rounded">PubMed</span>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl mb-8 flex items-center space-x-3">
          <i className="fa-solid fa-triangle-exclamation"></i>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="space-y-6">
          <div className="animate-pulse bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
          </div>
          <div className="flex items-center justify-center text-slate-400 italic">
            <p>Conectando às APIs científicas e verificando DOIs...</p>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-slate-900 font-bold text-xl">Resultados da Pesquisa</h3>
              <button 
                onClick={handleSave}
                disabled={isSaved}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isSaved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <i className={`fa-solid ${isSaved ? 'fa-circle-check' : 'fa-bookmark'}`}></i>
                <span>{isSaved ? 'Salvo na Biblioteca' : 'Salvar Resultado'}</span>
              </button>
            </div>
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-normal">
              {result.content.split('\n').map((line, i) => (
                <p key={i} className="mb-4">{line}</p>
              ))}
            </div>
          </div>

          {result.sources.length > 0 && (
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <h4 className="text-indigo-900 font-bold mb-4 flex items-center">
                <i className="fa-solid fa-link mr-2"></i> Fontes Externas Verificadas
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.sources.map((source, idx) => (
                  <li key={idx} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-semibold text-sm hover:underline block truncate mb-1"
                    >
                      {source.title || 'Artigo Científico'}
                    </a>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Link Direto / DOI</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSection;
