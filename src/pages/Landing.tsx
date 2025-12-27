import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, TrendingUp, LogIn } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const isConnected = !!localStorage.getItem("user");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/littlebook.png" alt="Little Book" className="h-12 w-auto" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Little Book
          </span>
        </div>
        {isConnected && (
          <Button onClick={() => navigate("/home")} variant="default">
            Accéder au dashboard
          </Button>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center mb-8">
              <img 
                src="/littlebook.png" 
                alt="Little Book Logo" 
                className="h-32 w-auto drop-shadow-lg animate-bounce" 
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Organise, Partage et Découvre
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Little Book est votre plateforme personnelle pour cataloguer vos livres préférés, 
              suivre vos lectures et partager vos passions avec une communauté de lecteurs.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
            >
              <LogIn className="w-5 h-5" />
              Se connecter
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
            >
              Créer un compte
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Pourquoi choisir Little Book ?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 space-y-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Cataloguez vos lectures</h3>
                <p className="text-gray-600">
                  Organisez facilement votre collection de livres, ajoutez vos notes et suivez l'avancement de vos lectures.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 space-y-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold">Communauté active</h3>
                <p className="text-gray-600">
                  Échangez avec d'autres lecteurs passionnés, découvrez des recommandations et partagez vos avis.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 space-y-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Suivez vos progrès</h3>
                <p className="text-gray-600">
                  Statistiques personnalisées, objectifs de lecture et défis pour rester motivé toute l'année.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                10k+
              </p>
              <p className="text-gray-600">Livres disponibles</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                5k+
              </p>
              <p className="text-gray-600">Lecteurs actifs</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                1k+
              </p>
              <p className="text-gray-600">Avis & critiques</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white space-y-8">
          <h2 className="text-4xl font-bold">Prêt à commencer votre aventure ?</h2>
          <p className="text-xl text-blue-100">
            Rejoignez Little Book dès aujourd'hui et découvrez une nouvelle façon de lire et de partager.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold"
          >
            Se connecter maintenant
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>© 2024 Little Book. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
