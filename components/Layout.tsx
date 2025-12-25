
import React, { useState } from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'search' as AppView, label: 'Busca Acadêmica', icon: 'fa-magnifying-glass' },
    { id: 'advisor' as AppView, label: 'Orientador IA', icon: 'fa-user-tie' },
    { id: 'project' as AppView, label: 'Criar Projeto', icon: 'fa-diagram-project' },
    { id: 'fichamento' as AppView, label: 'Fichamento', icon: 'fa-file-lines' },
    { id: 'methodology' as AppView, label: 'Estruturação', icon: 'fa-vial-circle-check' },
    { id: 'formatter' as AppView, label: 'Formatador', icon: 'fa-quote-right' },
    { id: 'library' as AppView, label: 'Minha Biblioteca', icon: 'fa-box-archive' },
    { id: 'about' as AppView, label: 'Sobre Aurora', icon: 'fa-circle-info' },
  ];

  const handleNav = (id: AppView) => {
    setView(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">AURORA</h1>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Pesquisadora Metodológica</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-3">
            <div className="flex items-center text-[10px] font-medium text-emerald-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Sistemas Online
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-[60] md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-72 h-full bg-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-graduation-cap text-white"></i>
                </div>
                <h1 className="font-bold text-white tracking-tight">AURORA</h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-sm ${
                    activeView === item.id 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  <i className={`fa-solid ${item.icon} w-5`}></i>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-50">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600"
          >
            <i className="fa-solid fa-bars-staggered"></i>
          </button>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 tracking-tight">AURORA</span>
          </div>
          <button 
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${activeView === 'library' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`} 
            onClick={() => setView('library')}
          >
            <i className="fa-solid fa-box-archive"></i>
          </button>
        </header>

        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
