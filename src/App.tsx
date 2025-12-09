import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import Collection from "./pages/Collection";
import Admin from "./pages/Admin";
import Books from "./pages/Books";

const queryClient = new QueryClient();

/**
 * 🔒 Route protégée : accessible seulement si un utilisateur est connecté
 */
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/auth" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Authentification */}
          <Route path="/auth" element={<Auth />} />

          {/* Page d'accueil protégée */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Profil (protégé aussi) */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            }
          />
           <Route path="/collection" element={
            <Layout>
              <Collection />
            </Layout>
          } />

          {/* Page d'administration (protégée) */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Layout>
                  <Admin />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Page de gestion des livres (protégée) */}
          <Route
            path="/books"
            element={
              <PrivateRoute>
                <Layout>
                  <Books />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Page de bienvenue après connexion */}
          <Route path="/welcome" element={<Welcome />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
