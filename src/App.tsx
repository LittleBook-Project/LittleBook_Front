import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import Collection from "./pages/Collection";
import Admin from "./pages/Admin";
import Books from "./pages/Books";
import BooksGrid from "./pages/BooksGrid";
import UnifiedBooks from "./pages/UnifiedBooks";

const queryClient = new QueryClient();

/**
 * 🔒 Route protégée : accessible seulement si un utilisateur est connecté
 */
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/auth" replace />;
};

/**
 * 🏠 Route publique : affiche Landing si non connecté, Dashboard si connecté
 */
const PublicRoute = () => {
  const user = localStorage.getItem("user");
  return user ? (
    <Layout>
      <UnifiedBooks />
    </Layout>
  ) : (
    <Landing />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Page d'accueil publique */}
          <Route path="/" element={<PublicRoute />} />

          {/* Authentification */}
          <Route path="/auth" element={<Auth />} />

          {/* Page d'accueil privée */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Layout>
                  <UnifiedBooks />
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

          {/* Grille de tous les livres (protégée) */}
          <Route
            path="/books-grid"
            element={
              <PrivateRoute>
                <Layout>
                  <BooksGrid />
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
