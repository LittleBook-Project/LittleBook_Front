import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Collection from "./Collection";
import { HeroSection } from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, BookOpen } from "lucide-react";

interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authors: string;
  isbn13?: string;
  isbn10?: string;
  coverUrl?: string;
  publishYear?: number;
  subjects?: string;
  description?: string;
}

interface Review {
  id: string;
  rating: number;
  description: string;
  userName?: string;
}

interface BookWithReviews extends Book {
  reviews: Review[];
  currentUserReview?: {
    id: string;
    rating: number;
    description: string;
  };
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir Little Book ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez une nouvelle façon d'organiser et de partager vos lectures avec une communauté passionnée.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 shadow-soft border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Organisez votre collection</h3>
                <p className="text-muted-foreground text-sm">
                  Cataloguez vos livres, ajoutez vos notes et suivez vos lectures facilement.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-soft border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Communauté active</h3>
                <p className="text-muted-foreground text-sm">
                  Échangez avec d'autres lecteurs, découvrez de nouvelles recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-soft border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Suivez vos progrès</h3>
                <p className="text-muted-foreground text-sm">
                  Statistiques personnalisées et objectifs de lecture pour rester motivé.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Collection Section (fusion de /collection) */}
      <section className="py-16 gradient-soft">
        <div className="container mx-auto px-4">
          <Collection />
        </div>
      </section>
    </div>
  );
}