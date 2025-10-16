import { BookCard } from "@/components/BookCard";
import { HeroSection } from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, BookOpen } from "lucide-react";

// Mock data pour les livres populaires
const popularBooks = [
  {
    id: "1",
    title: "L'Étranger",
    author: "Albert Camus",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    rating: 5,  
    category: "Classique",
    review: "Une œuvre incontournable qui questionne l'absurdité de la condition humaine.",
    likes: 124,
    comments: 32,
    isLiked: true,
    userName: "Marie Dubois",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612e7d4?w=50&h=50&fit=crop&crop=face"
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop",
    rating: 4,
    category: "Dystopie",
    review: "Prophétique et troublant. Plus actuel que jamais.",
    likes: 89,
    comments: 18,
    isLiked: false,
    userName: "Paul Martin",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
  },
  {
    id: "3",
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    rating: 5,
    category: "Jeunesse",
    review: "Un conte philosophique touchant qui parle à tous les âges.",
    likes: 156,
    comments: 45,
    isLiked: true,
    userName: "Sophie Laurent",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
  }
];

export default function Home() {
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

      {/* Popular Books Section */}
      <section className="py-16 gradient-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Tendances de la communauté</h2>
              <p className="text-muted-foreground">Les livres les plus appréciés cette semaine</p>
            </div>
            <Button variant="outline" className="rounded-full">
              Voir tout
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularBooks.map((book) => (
              <BookCard 
                key={book.id} 
                {...book} 
                className="animate-fade-in"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}