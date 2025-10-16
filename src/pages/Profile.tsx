import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BookCard } from "../components/BookCard";
import { Edit, Settings, BookOpen, Users, Heart, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

  interface UserData {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  }

// Mock data pour le profil
const user2 = {
  bio: "Passionnée de littérature française et de développement personnel. Toujours à la recherche du prochain coup de cœur ! 📚✨",
  joinDate: "Mars 2023",
  stats: {
    booksRead: 127,
    followers: 342,
    following: 189,
    reviews: 95
  },
  favoriteGenres: ["Fiction", "Développement personnel", "Histoire", "Science-fiction"],
  recentBooks: [
    {
      id: "1",
      title: "L'Étranger",
      author: "Albert Camus",
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
      rating: 5,
      category: "Classique",
      review: "Une œuvre incontournable qui questionne l'absurdité de la condition humaine.",
      likes: 124,
      comments: 32
    },
    {
      id: "2",
      title: "Atomic Habits",
      author: "James Clear",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
      rating: 5,
      category: "Développement personnel",
      review: "Une méthode efficace pour construire de bonnes habitudes.",
      likes: 78,
      comments: 24
    }
  ]
};

export default function Profile() {

    const [user, setUser] = useState<UserData | null>(null);

     useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser) as UserData);
      } else {
      }
    }, []);
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="shadow-soft border-border/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center md:items-start">
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName}
                    className="w-32 h-32 rounded-full shadow-book mb-4"
                  />
                  <Button variant="outline" className="rounded-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier le profil
                  </Button>
                </div>
                         
                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Users className="mr-2 h-4 w-4" />
                    Amis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full gradient-primary text-white rounded-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Ajouter un livre
                </Button>
                <Button variant="outline" className="w-full rounded-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Mes favoris
                </Button>
                <Button variant="outline" className="w-full rounded-full">
                  <Users className="mr-2 h-4 w-4" />
                  Découvrir des lecteurs
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Challenge */}
            <Card className="shadow-soft border-border/50 gradient-secondary">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold mb-2">Défi du mois</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Lire 5 livres de genres différents
                </p>
                <div className="text-2xl font-bold text-primary mb-2">3/5</div>
                <p className="text-xs text-muted-foreground">
                  Plus que 2 livres à découvrir !
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}