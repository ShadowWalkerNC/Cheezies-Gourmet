import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import PageNotFound from './lib/PageNotFound';
import { ThemeProvider } from '@/lib/ThemeContext';
import BottomTabBar from './components/BottomTabBar';
import StickyOrderButton from './components/StickyOrderButton';
import { usePageTracking } from '@/hooks/usePageTracking';

import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import CateringPage from "./pages/CateringPage";
import ContactPage from "./pages/ContactPage";
import FindUs from "./pages/FindUs";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import ContactPage2 from "./pages/ContactPage2";
import GiftCards from "./pages/GiftCards";
import EventsPage from "./pages/EventsPage";
import FacebookPage from "./pages/FacebookPage";

function AnimatedRoutes() {
  const location = useLocation();
  usePageTracking();
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Menu" element={<MenuPage />} />
          <Route path="/Catering" element={<CateringPage />} />
          <Route path="/Contact" element={<ContactPage />} />
          <Route path="/FindUs" element={<FindUs />} />
          <Route path="/About" element={<AboutPage />} />
          <Route path="/ContactUs" element={<ContactPage2 />} />
          <Route path="/GiftCards" element={<GiftCards />} />
          <Route path="/Events" element={<EventsPage />} />
          <Route path="/Facebook" element={<FacebookPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AnimatePresence>
      <BottomTabBar />
      <StickyOrderButton />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AnimatedRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
