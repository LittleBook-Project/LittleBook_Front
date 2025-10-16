import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BookCard } from "../components/BookCard";
import { Edit, Settings, BookOpen, Users, Heart, Calendar } from "lucide-react";

// Mock data pour le profil
const userProfile = {
  name: "Marie Dubois",
  username: "@marie_lit",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612e7d4?w=120&h=120&fit=crop&crop=face",
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
                    src={userProfile.avatar} 
                    alt={userProfile.name}
                    className="w-32 h-32 rounded-full shadow-book mb-4"
                  />
                  <Button variant="outline" className="rounded-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier le profil
                  </Button>
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{userProfile.name}</h1>
                    <p className="text-muted-foreground mb-2">{userProfile.username}</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Calendar className="mr-1 h-4 w-4" />
                      Membre depuis {userProfile.joinDate}
                    </div>
                    <p className="text-foreground leading-relaxed">{userProfile.bio}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{userProfile.stats.booksRead}</div>
                      <div className="text-sm text-muted-foreground">Livres lus</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{userProfile.stats.followers}</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{userProfile.stats.following}</div>
                      <div className="text-sm text-muted-foreground">Suivis</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{userProfile.stats.reviews}</div>
                      <div className="text-sm text-muted-foreground">Critiques</div>
                    </div>
                  </div>

                  {/* Favorite Genres */}
                  <div>
                    <h3 className="font-semibold mb-2">Genres préférés</h3>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.favoriteGenres.map((genre) => (
                        <Badge key={genre} variant="secondary" className="bg-secondary/50">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Lectures récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {userProfile.recentBooks.map((book) => (
                    <BookCard key={book.id} {...book} className="animate-fade-in" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reading Goals */}
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle>Objectifs de lecture 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Livres lus cette année</span>
                      <span className="font-medium">24 / 50</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="gradient-primary h-2 rounded-full transition-all duration-500" 
                        style={{ width: "48%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Vous êtes en bonne voie pour atteindre votre objectif ! 🎯
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
    </div>
  );
}