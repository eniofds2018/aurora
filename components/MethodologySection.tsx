
import React, { useState } from 'react';
import { generateMethodology } from '../services/geminiService';
import { saveItem } from '../services/storageService';

const MethodologySection: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [workType, setWorkType] = useState('Artigo Científico');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const workTypes = [
    'Artigo Científico',
    'Projeto de Pesquisa',
    'TCC / Monografia',
    'Dissertação de Mestrado',
    'Tese de Doutorado',
    'Relatório Técnico',
    'Ensaio Teórico'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setIsSaved(false);
    try {
      const data = await generateMethodology(topic, workType);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      saveItem('methodology', `Estrutura: ${topic.slice(0, 30)}...`, result, { workType });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-6 md:p-10">
      <div className="mb-10">
        <h2 className="academic-title text-4xl text-slate-900 font-bold mb-4">Estruturação Metodológica</h2>
        <p className="text-slate-600 text-lg">
          Defina o tema e o tipo de trabalho para que Aurora desenhe um percurso metodológico rigoroso e lógico.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-6 sticky top-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tema da Pesquisa</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
                placeholder="Descreva seu tema de forma detalhada..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Trabalho</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none"
              >
                {workTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {loading ? (
                <i className="fa-solid fa-gear fa-spin"></i>
              ) : (
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              )}
              <span>{loading ? 'Estruturando...' : 'Gerar Estrutura'}</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-in fade-in zoom-in-95 duration-500">
               <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-900">Plano de Trabalho Proposto</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSave}
                    disabled={isSaved}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isSaved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <i className={`fa-solid ${isSaved ? 'fa-circle-check' : 'fa-bookmark'}`}></i>
                    <span>{isSaved ? 'Salvo' : 'Salvar'}</span>
                  </button>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-slate-500 hover:text-indigo-600 p-1.5 rounded-lg bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <i className="fa-solid fa-copy"></i>
                  </button>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-slate-700 font-sans leading-relaxed">
                {result}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <i className="fa-solid fa-file-invoice text-5xl mb-4 opacity-20"></i>
              <p className="max-w-xs">Preencha os dados ao lado para que Aurora elabore sua proposta metodológica.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MethodologySection;
