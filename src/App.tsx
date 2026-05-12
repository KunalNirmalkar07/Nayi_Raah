import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Roadmap from "./pages/Roadmap";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Colleges from "./pages/Colleges";
import Settings from "./pages/Settings";
import Scholarships from "./pages/Scholarships";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import AdminRoute from "@/components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminScholarships from "./pages/admin/AdminScholarships";
import AdminNews from "./pages/admin/AdminNews";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminColleges from "./pages/admin/AdminColleges";
import SmoothScroll from "@/components/SmoothScroll";
import MobileScrollToTop from "@/components/MobileScrollToTop";
import MobileNav from "@/components/layout/MobileNav";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="/assessment" element={<PageTransition><Assessment /></PageTransition>} />
        <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} />
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition><Profile /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="/colleges" element={<PageTransition><Colleges /></PageTransition>} />
        <Route path="/scholarships" element={<PageTransition><Scholarships /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageTransition><Settings /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute>} />
        <Route path="/admin/scholarships" element={<AdminRoute><PageTransition><AdminScholarships /></PageTransition></AdminRoute>} />
        <Route path="/admin/news" element={<AdminRoute><PageTransition><AdminNews /></PageTransition></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><PageTransition><AdminUsers /></PageTransition></AdminRoute>} />
        <Route path="/admin/colleges" element={<AdminRoute><PageTransition><AdminColleges /></PageTransition></AdminRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SmoothScroll>
            <MobileScrollToTop />
            <AnimatedRoutes />
            <MobileNav />
          </SmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
