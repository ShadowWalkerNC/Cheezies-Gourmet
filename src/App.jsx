import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import BottomTabBar from './components/BottomTabBar';
import ChatWidget from './components/ChatWidget';

// Add page imports here
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import CateringPage from "./pages/CateringPage";
import ContactPage from "./pages/ContactPage";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="w-8 h-8 border-4 border-amber-900 border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Menu" element={<MenuPage />} />
        <Route path="/Catering" element={<CateringPage />} />
        <Route path="/Contact" element={<ContactPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {/* Persistent mobile bottom tab bar */}
      <BottomTabBar />
      {/* AI Chat Widget */}
      <ChatWidget />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App