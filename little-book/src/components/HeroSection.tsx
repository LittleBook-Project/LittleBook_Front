import { Button } from "./ui/button";
import { BookOpen, Users, Heart } from "lucide-react";
import heroImage from "@/assets/hero-books.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-soft">
      <div className="container mx-auto px-4 py-20 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-tight">
                Votre bibliothèque 
                <span className="gradient-primary bg-clip-text text-transparent block">
                  sociale et personnelle
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Organisez votre collection, partagez vos découvertes et 
                connectez-vous avec d'autres passionnés de lecture.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gradient-primary text-white rounded-full px-8 shadow-soft hover:shadow-hover">
                <BookOpen className="mr-2 h-5 w-5" />
                Commencer ma collection
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Découvrir des livres
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">12K+</div>
                <div className="text-sm text-muted-foreground">Livres</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3.5K+</div>
                <div className="text-sm text-muted-foreground">Lecteurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">8K+</div>
                <div className="text-sm text-muted-foreground">Critiques</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <img 
              src={heroImage} 
              alt="Collection de livres moderne" 
              className="w-full h-auto rounded-2xl shadow-book"
            />
            
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 bg-card p-4 rounded-full shadow-soft animate-pulse">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-card p-4 rounded-full shadow-soft animate-pulse">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};