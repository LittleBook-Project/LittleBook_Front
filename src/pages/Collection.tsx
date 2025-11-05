import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Grid, List } from "lucide-react";

// Mock data pour la collection personnelle
const myBooks = [
  {
    id: "1",
    title: "Clean Code",
    author: "Robert C. Martin",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    rating: 5,
    category: "Technique",
    review: "Excellent guide pour écrire du code propre et maintenable.",
    likes: 45,
    comments: 12,
    status: "completed"
  },
  {
    id: "2",
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    rating: 4,
    category: "Technique",
    review: "Des conseils pratiques pour devenir un meilleur programmeur.",
    likes: 32,
    comments: 8,
    status: "reading"
  },
  {
    id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    rating: 5,
    category: "Développement personnel",
    review: "Une méthode efficace pour construire de bonnes habitudes.",
    likes: 78,
    comments: 24,
    status: "wishlist"
  },
  {
    id: "4",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    rating: 4,
    category: "Histoire",
    review: "Une vision fascinante de l'évolution de l'humanité.",
    likes: 92,
    comments: 35,
    status: "completed"
  }
];

const categories = ["Tous", "Technique", "Développement personnel", "Histoire", "Fiction", "Science"];

export default function Collection() {
  const completedBooks = myBooks.filter(book => book.status === "completed");
  const currentlyReading = myBooks.filter(book => book.status === "reading");
  const wishlist = myBooks.filter(book => book.status === "wishlist");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Ma Collection</h1>
              <p className="text-muted-foreground">Organisez et suivez vos lectures</p>
            </div>
            <Button className="gradient-primary text-white rounded-full px-6">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un livre
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg shadow-soft border border-border/50">
              <div className="text-2xl font-bold text-primary">{myBooks.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-soft border border-border/50">
              <div className="text-2xl font-bold text-green-600">{completedBooks.length}</div>
              <div className="text-sm text-muted-foreground">Terminés</div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-soft border border-border/50">
              <div className="text-2xl font-bold text-blue-600">{currentlyReading.length}</div>
              <div className="text-sm text-muted-foreground">En cours</div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-soft border border-border/50">
              <div className="text-2xl font-bold text-purple-600">{wishlist.length}</div>
              <div className="text-sm text-muted-foreground">À lire</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher dans ma collection..." 
                className="pl-10 rounded-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-full">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Book Lists */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4 mx-auto">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="completed">Terminés</TabsTrigger>
            <TabsTrigger value="reading">En cours</TabsTrigger>
            <TabsTrigger value="wishlist">À lire</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myBooks.map((book) => (
                <BookCard key={book.id} {...book} className="animate-fade-in" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {completedBooks.map((book) => (
                <BookCard key={book.id} {...book} className="animate-fade-in" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reading" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentlyReading.map((book) => (
                <BookCard key={book.id} {...book} className="animate-fade-in" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((book) => (
                <BookCard key={book.id} {...book} className="animate-fade-in" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}