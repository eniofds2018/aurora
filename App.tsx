
import React, { useState } from 'react';
import Layout from './components/Layout';
import SearchSection from './components/SearchSection';
import MethodologySection from './components/MethodologySection';
import FormatterSection from './components/FormatterSection';
import FichamentoSection from './components/FichamentoSection';
import LibrarySection from './components/LibrarySection';
import AboutSection from './components/AboutSection';
import AdvisorSection from './components/AdvisorSection';
import ProjectSection from './components/ProjectSection';
import { AppView } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('search');

  const renderContent = () => {
    switch (activeView) {
      case 'search':
        return <SearchSection />;
      case 'fichamento':
        return <FichamentoSection />;
      case 'methodology':
        return <MethodologySection />;
      case 'formatter':
        return <FormatterSection />;
      case 'advisor':
        return <AdvisorSection />;
      case 'project':
        return <ProjectSection />;
      case 'library':
        return <LibrarySection />;
      case 'about':
        return <AboutSection />;
      default:
        return <SearchSection />;
    }
  };

  return (
    <Layout activeView={activeView} setView={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
