import './App.css'
import { useState } from 'react';
import {
  AnalyticsPage,
  ChatPage,
  DocumentLibrary,
  EnterpriseHub,
  IngestionPipeline,
  KnowledgeBase,
  ProfilePage,
  SettingsPage,
} from './pages';
import type { PageType } from './types/navigation';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const renderPage = () => {
    const navigate = setCurrentPage;
    switch (currentPage) {
      case 'dashboard':
        return <EnterpriseHub onNavigate={navigate} />;
      case 'chat':
        return <ChatPage onNavigate={navigate} />;
      case 'documents':
        return <DocumentLibrary onNavigate={navigate} />;
      case 'knowledge-base':
        return <KnowledgeBase onNavigate={navigate} />;
      case 'ingestion':
        return <IngestionPipeline onNavigate={navigate} />;
      case 'analytics':
        return <AnalyticsPage onNavigate={navigate} />;
      case 'settings':
        return <SettingsPage onNavigate={navigate} />;
      case 'profile':
        return <ProfilePage onNavigate={navigate} />;
      default:
        return <EnterpriseHub onNavigate={navigate} />;
    }
  };

  return renderPage();
}

export default App;
