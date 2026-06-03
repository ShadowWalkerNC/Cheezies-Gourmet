import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import BottomTabBar from './components/BottomTabBar';
import ChatWidget from './components/ChatWidget';
import InstallBanner from './components/InstallBanner';


// Page imports
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import CateringPage from "./pages/CateringPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import FindUs from "./pages/FindUs";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import ContactPage2 from "./pages/ContactPage2";
import GiftCards from "./pages/GiftCards";
import EventsPage from "./pages/EventsPage";
import FacebookPage from "./pages/FacebookPage";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Routes>
      {/* Admin page — completely isolated, no animations, no overlays */}
      <Route path="/admin" element={<AdminPage />} />

      {/* All other pages — animated with tab bar + chat */}
      <Route
        path="*"
        element={
          <>
            <AnimatePresence mode="wait" initial={false}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Navigate to="/Home" replace />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Menu" element={<MenuPage />} />
                <Route path="/Catering" element={<CateringPage />} />
                <Route path="/Contact" element={<ContactPage />} />
                <Route path="/Profile" element={<ProfilePage />} />
                <Route path="/FindUs" element={<FindUs />} />
                <Route path="/About" element={<AboutPage />} />
                <Route path="/ContactUs" element={<ContactPage2 />} />
                <Route path="/GiftCards" element={<GiftCards />} />
                <Route path="/Events" element={<EventsPage />} />
                <Route path="/Facebook" element={<FacebookPage />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </AnimatePresence>
            <BottomTabBar />
            <ChatWidget />
            <InstallBanner />
          </>
        }
      />
    </Routes>
  );
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
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

  return <AnimatedRoutes />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App