import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookFlashcard } from "@/components/BookFlashcard";
import { ReviewModal } from "@/components/ReviewModal";
import { HeroSection } from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TrendingUp, Users, BookOpen, Loader2, Search } from "lucide-react";

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
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<BookWithReviews[]>([]);
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    bookId?: string;
    book?: BookWithReviews;
  }>({ isOpen: false });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Récupérer les livres depuis la DB
  const { data: booksData, isLoading } = useQuery({
    queryKey: ["books-home"],
    queryFn: async () => {
      const res = await fetch("/api/book?page=0&size=20");
      if (!res.ok) throw new Error("Erreur lors du chargement des livres");
      return res.json();
    },
  });

  const books: BookWithReviews[] = booksData?.content || [];

  // Charger les reviews pour chaque livre
  useEffect(() => {
    if (books.length === 0) return;

    const loadReviews = async () => {
      const booksWithReviews = await Promise.all(
        books.map(async (book) => {
          try {
            const res = await fetch(`/api/reviews/book/${book.isbn13}`);
            const reviews = res.ok ? await res.json() : [];
            return {
              ...book,
              reviews: reviews || [],
              currentUserReview: undefined, // TODO: charger la review de l'utilisateur courant
            };
          } catch (error) {
            console.error(`Erreur loading reviews for ${book.title}:`, error);
            return { ...book, reviews: [] };
          }
        })
      );
      setFilteredBooks(booksWithReviews);
    };

    loadReviews();
  }, [books]);

  // Filtrer les livres par recherche
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBooks(books);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerSearch) ||
        book.authors.toLowerCase().includes(lowerSearch) ||
        book.subjects?.toLowerCase().includes(lowerSearch)
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleAddReview = (book: BookWithReviews) => {
    setReviewModal({
      isOpen: true,
      bookId: book.id,
      book,
    });
  };

  const handleSubmitReview = async (rating: number, description: string) => {
    if (!reviewModal.book?.isbn13) return;

    setIsSubmittingReview(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userUuid: user.id || user.uuid,
          bookIsbn: reviewModal.book.isbn13,
          description,
          rating,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création de la review");
      
      // Invalider le cache pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: ["books-home"] });
      setReviewModal({ isOpen: false });
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'ajout de la review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

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
              <h2 className="text-3xl font-bold mb-2">Livres de notre bibliothèque</h2>
              <p className="text-muted-foreground">Découvrez les livres disponibles</p>
            </div>
            <Button 
              variant="outline" 
              className="rounded-full"
              onClick={() => navigate("/books-grid")}
            >
              Voir tout
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Chercher un livre par titre, auteur ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          {/* Books Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookFlashcard 
                  key={book.id} 
                  {...book}
                  reviews={book.reviews}
                  onAddReview={() => handleAddReview(book)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                {searchTerm ? "Aucun livre ne correspond à votre recherche" : "Aucun livre dans la bibliothèque"}
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate("/books")}>
                  Ajouter des livres
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false })}
        bookTitle={reviewModal.book?.title || ""}
        bookIsbn13={reviewModal.book?.isbn13}
        onSubmit={handleSubmitReview}
        isLoading={isSubmittingReview}
      />
    </div>
  );
}