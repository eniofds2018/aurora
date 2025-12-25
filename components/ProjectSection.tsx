
import React, { useState } from 'react';
import { buildFullProject } from '../services/geminiService';
import { saveItem } from '../services/storageService';

const ProjectSection: React.FC = () => {
  const [formData, setFormData] = useState({ title: '', problem: '', objectives: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSaved(false);
    try {
      const project = await buildFullProject(formData);
      setResult(project);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      saveItem('project', `Projeto: ${formData.title || 'Sem título'}`, result);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-6 md:p-10">
      <div className="mb-10">
        <h2 className="academic-title text-4xl text-slate-900 font-bold mb-4">Construtor de Projeto</h2>
        <p className="text-slate-600 text-lg">
          Transforme sua ideia inicial em um documento de projeto estruturado seguindo o rigor científico.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Título Provisório</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-indigo-500 outline-none"
                placeholder="Qual o nome da sua pesquisa?"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Problema de Pesquisa</label>
              <textarea
                rows={3}
                value={formData.problem}
                onChange={(e) => setFormData({...formData, problem: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-indigo-500 outline-none resize-none"
                placeholder="Qual pergunta você quer responder?"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Objetivos (Breve)</label>
              <textarea
                rows={3}
                value={formData.objectives}
                onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-indigo-500 outline-none resize-none"
                placeholder="O que você pretende alcançar?"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !formData.problem}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-diagram-project"></i>}
              <span>{loading ? 'Processando Projeto...' : 'Gerar Documento Completo'}</span>
            </button>
          </div>
        </form>

        <div className="lg:col-span-8">
          {result ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h3 className="font-bold text-slate-900 text-xl">Esqueleto do Projeto</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSave}
                    disabled={isSaved}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSaved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <i className={`fa-solid ${isSaved ? 'fa-check' : 'fa-bookmark'} mr-2`}></i>
                    {isSaved ? 'Salvo' : 'Salvar'}
                  </button>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(result); alert('Copiado!'); }}
                    className="p-2 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    <i className="fa-solid fa-copy"></i>
                  </button>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans text-sm md:text-base max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {result}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300 p-8 text-center bg-white/30">
              <i className="fa-solid fa-pen-nib text-5xl mb-4 opacity-20"></i>
              <h3 className="font-bold text-lg mb-2">Aguardando Parâmetros</h3>
              <p className="max-w-xs text-sm">Preencha os dados do formulário lateral para que a Aurora gere a estrutura completa do seu projeto científico.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;
