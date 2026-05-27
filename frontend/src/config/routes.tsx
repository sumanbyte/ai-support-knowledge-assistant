import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import {
  AnalyticsPage,
  ChatPage,
  DocumentLibrary,
  EnterpriseHub,
  IngestionPipeline,
  KnowledgeBase,
  LoginPage,
  ProfilePage,
  SettingsPage,
  SignupPage,
} from '../pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'dashboard', element: <EnterpriseHub /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'documents', element: <DocumentLibrary /> },
      { path: 'knowledge-base', element: <KnowledgeBase /> },
      { path: 'ingestion', element: <IngestionPipeline /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
]);
