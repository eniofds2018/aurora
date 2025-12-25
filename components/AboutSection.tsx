
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto w-full p-6 md:p-10">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-12 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
            <i className="fa-solid fa-dna text-9xl absolute -top-10 -left-10 transform -rotate-12"></i>
            <i className="fa-solid fa-atom text-9xl absolute -bottom-10 -right-10 transform rotate-12"></i>
          </div>
          
          <div className="relative z-10">
            <div className="inline-block bg-indigo-500 p-4 rounded-3xl mb-6 shadow-2xl">
              <i className="fa-solid fa-graduation-cap text-4xl"></i>
            </div>
            <h2 className="academic-title text-5xl font-bold mb-4">Aurora</h2>
            <p className="text-slate-400 font-medium tracking-widest uppercase text-sm mb-8">Pesquisadora Metodológica Senior</p>
            <div className="flex justify-center space-x-6 text-sm">
              <span className="flex items-center"><i className="fa-solid fa-check-circle text-emerald-400 mr-2"></i> Anti-Plágio</span>
              <span className="flex items-center"><i className="fa-solid fa-check-circle text-emerald-400 mr-2"></i> DOI Verificado</span>
              <span className="flex items-center"><i className="fa-solid fa-check-circle text-emerald-400 mr-2"></i> ABNT/APA</span>
            </div>
          </div>
        </div>

        <div className="p-12 space-y-12">
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3 text-sm">01</span>
              Nossa Missão
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Aurora foi concebida para elevar o nível da produção científica brasileira. Em um mundo saturado por informações superficiais e IAs que "alucinam" fontes, Aurora se destaca pelo rigor metodológico e pela conexão direta com bases de dados consagradas.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-3">Fontes de Dados</h4>
              <p className="text-sm text-slate-600">Scopus, Web of Science, PubMed, SciELO, JSTOR, IEEE Xplore, Google Scholar e bases de dados governamentais.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-3">Rigor Científico</h4>
              <p className="text-sm text-slate-600">Todas as referências são cruzadas com o Google Search para garantir que o DOI é válido e o trabalho existe de fato.</p>
            </div>
          </div>

          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3 text-sm">02</span>
              Como Funciona?
            </h3>
            <ul className="space-y-4">
              {[
                { icon: 'fa-brain', title: 'Processamento Crítico', text: 'Aurora não apenas repete dados, ela analisa lacunas na literatura atual.' },
                { icon: 'fa-search', title: 'Grounding Real-Time', text: 'Uso de pesquisa em tempo real para evitar citações obsoletas ou inexistentes.' },
                { icon: 'fa-pencil-ruler', title: 'Padronização Normativa', text: 'Citações formatadas automaticamente em ABNT NBR 6023 ou APA 7th Edition.' }
              ].map((item, i) => (
                <li key={i} className="flex items-start space-x-4">
                  <div className="bg-white shadow-sm border border-slate-100 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`fa-solid ${item.icon} text-indigo-600`}></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{item.title}</h5>
                    <p className="text-slate-500 text-sm">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
