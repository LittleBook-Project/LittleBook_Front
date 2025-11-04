import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Edit, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface UserData {
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
  joinDate: string;
  stats: {
    booksRead: number;
    followers: number;
    following: number;
    reviews: number;
  };
  favoriteGenres: string[];
  recentBooks: {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    review: string;
    rating: number;
    category: string;
  }[];
}

const mockUser: UserData = {
  displayName: "Jeanne L.",
  email: "jeanne.l@email.com",
  photoURL:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&q=80",
  bio: "Passionnée de littérature française et de développement personnel. Toujours à la recherche du prochain coup de cœur ! 📚✨",
  joinDate: "Mars 2023",
  stats: {
    booksRead: 127,
    followers: 342,
    following: 189,
    reviews: 95,
  },
  favoriteGenres: ["Fiction", "Développement personnel", "Histoire", "Science-fiction"],
  recentBooks: [
    {
      id: "1",
      title: "L'Étranger",
      author: "Albert Camus",
      coverImage:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
      review: "Une œuvre incontournable qui questionne l'absurdité de la condition humaine.",
      rating: 5,
      category: "Fiction",
    },
    {
      id: "2",
      title: "Atomic Habits",
      author: "James Clear",
      coverImage:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
      review: "Une méthode efficace pour construire de bonnes habitudes.",
      rating: 4,
      category: "Développement personnel",
    },
  ],
};

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement du profil...</p>
      </div>
    );
  }

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
                    className="w-32 h-32 rounded-full shadow-book mb-4 object-cover"
                  />
                  <Button variant="outline" className="rounded-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier le profil
                  </Button>
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{user.displayName}</h1>
                    <p className="text-muted-foreground mb-2">{user.email}</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Calendar className="mr-1 h-4 w-4" />
                      Membre depuis {user.joinDate}
                    </div>
                    <p className="text-foreground leading-relaxed">{user.bio}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
