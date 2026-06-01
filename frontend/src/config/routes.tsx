import '../App.css';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
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
import ProtectedRoute from '../components/Layout/ProtectedRoute';
import { protectedRouteLoader } from '../loaders/protectedRoute.loader';

function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      {
        // Same pattern as loader on /dashboard — one loader guards all protected children
        element: <ProtectedRoute />,
        loader: protectedRouteLoader, // blocks rendering until /auth/me finishes
        children: [
          { path: 'dashboard', element: <EnterpriseHub /> },
          { path: 'chat/:chatId?', element: <ChatPage /> },
          { path: 'documents', element: <DocumentLibrary /> },
          { path: 'knowledge-base', element: <KnowledgeBase /> },
          { path: 'ingestion', element: <IngestionPipeline /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
]);
