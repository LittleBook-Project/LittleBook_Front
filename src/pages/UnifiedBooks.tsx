import { useState, useEffect, useMemo } from "react";
import { Search, Plus, Star, Loader2, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, Page } from "@/lib/api";
import { Book } from "@/types/book";
import { Review } from "@/types/review";

interface BookWithReviews extends Book {
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
}

interface ReviewDraft {
  rating: number;
  description: string;
}

export default function UnifiedBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [localBooks, setLocalBooks] = useState<BookWithReviews[]>([]);
  const [openLibraryBooks, setOpenLibraryBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, ReviewDraft>>({});
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const { toast } = useToast();

  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  // Charger tous les livres au démarrage
  useEffect(() => {
    loadAllBooks();
  }, []);

  const loadAllBooks = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<Page<Book>>("/book?page=0&size=50");
      const books = response?.content || [];
      
      // Charger les reviews pour chaque livre
      const booksWithReviews = await Promise.all(
        books.map(async (book) => {
          const reviews = await loadReviewsForBook(book);
          return {
            ...book,
            reviews,
            averageRating: reviews.length > 0 
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
              : undefined,
            reviewCount: reviews.length
          };
        })
      );
      
      setLocalBooks(booksWithReviews);
    } catch (error) {
      console.error("Erreur chargement livres:", error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de charger les livres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadReviewsForBook = async (book: Book): Promise<Review[]> => {
    try {
      // Essayer par ISBN d'abord
      if (book.isbn13) {
        const res = await apiFetch<Review[]>(`/review/book/${book.isbn13}`);
        if (res && res.length > 0) return res;
      }
      
      // Si pas d'ISBN ou pas de résultats, essayer par bookId
      if (book.id) {
        const res = await apiFetch<Review[]>(`/review/book-id/${book.id}`);
        return res || [];
      }
      
      return [];
    } catch (error) {
      console.error(`Erreur chargement reviews pour ${book.title}:`, error);
      return [];
    }
  };

  const searchBooks = async () => {
    if (searchQuery.length < 3) {
      toast({
        title: "⚠️ Recherche trop courte",
        description: "Saisissez au moins 3 caractères",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const [localData, syncedData] = await Promise.all([
        apiFetch<Page<Book>>(`/book?q=${encodeURIComponent(searchQuery)}&page=0&size=20`),
        apiFetch<Page<Book>>(`/book/search-openlibrary?title=${encodeURIComponent(searchQuery)}&page=0&size=10`),
      ]);

      const books = localData?.content || [];
      const booksWithReviews = await Promise.all(
        books.map(async (book) => {
          const reviews = await loadReviewsForBook(book);
          return {
            ...book,
            reviews,
            averageRating: reviews.length > 0 
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
              : undefined,
            reviewCount: reviews.length
          };
        })
      );

      setLocalBooks(booksWithReviews);
      setOpenLibraryBooks(syncedData?.content || []);

      const localCount = booksWithReviews.length;
      const olCount = syncedData?.content?.length || 0;

      if (localCount + olCount > 0) {
        toast({
          title: "✅ Recherche terminée",
          description: `${localCount} livre(s) dans la collection, ${olCount} suggestion(s) OpenLibrary`,
        });
      } else {
        toast({
          title: "❌ Aucun résultat",
          description: "Essayez avec d'autres mots-clés",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur de recherche:", error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de rechercher les livres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addBookToDb = async (olBook: Book) => {
    if (!olBook.openlibraryId) {
      toast({
        title: "❌ Erreur",
        description: "Impossible d'ajouter ce livre (ID manquant)",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiFetch(`/book/add-from-openlibrary?openlibraryId=${encodeURIComponent(olBook.openlibraryId)}`, {
        method: "POST",
      });
      
      toast({
        title: "✅ Livre ajouté",
        description: `"${olBook.title}" a été ajouté à votre collection.`,
      });
      
      // Recharger la collection
      await loadAllBooks();
      setSearchQuery("");
      setSearched(false);
    } catch (error) {
      console.error("Erreur ajout livre:", error);
      toast({
        title: "❌ Erreur",
        description: "Impossible d'ajouter le livre",
        variant: "destructive",
      });
    }
  };

  const submitReview = async (book: BookWithReviews) => {
    const draft = reviewDrafts[book.id] || { rating: 4, description: "" };
    const userUuid = user?.uid || "anonymous-demo";

    try {
      const payload: Partial<Review> = {
        rating: draft.rating,
        description: draft.description,
        reviewCreationDate: new Date().toISOString().slice(0, 10),
        userUuid,
        bookIsbn: book.isbn13 || book.isbn10 || undefined,
        bookId: book.id,
      };

      await apiFetch<Review>("/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast({
        title: "✅ Review enregistrée",
        description: `Votre avis sur "${book.title}" est publié`,
      });

      // Recharger les reviews pour ce livre
      const reviews = await loadReviewsForBook(book);
      setLocalBooks(prev => prev.map(b => 
        b.id === book.id 
          ? { 
              ...b, 
              reviews, 
              averageRating: reviews.length > 0 
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
                : undefined,
              reviewCount: reviews.length
            } 
          : b
      ));

      // Réinitialiser le draft
      setReviewDrafts(prev => {
        const newDrafts = { ...prev };
        delete newDrafts[book.id];
        return newDrafts;
      });
    } catch (error) {
      console.error("Erreur review:", error);
      toast({
        title: "❌ Erreur review",
        description: "Impossible de poster votre avis",
        variant: "destructive",
      });
    }
  };

  const onReviewChange = (bookId: string, field: keyof ReviewDraft, value: string | number) => {
    setReviewDrafts(prev => ({
      ...prev,
      [bookId]: {
        rating: field === "rating" ? Number(value) : prev[bookId]?.rating || 4,
        description: field === "description" ? String(value) : prev[bookId]?.description || "",
      },
    }));
  };

  const toggleExpanded = (bookId: string) => {
    setExpandedBook(expandedBook === bookId ? null : bookId);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-8 h-8" />
          Bibliothèque LittleBook
        </h1>
        <p className="text-muted-foreground">
          Recherchez, ajoutez et donnez votre avis sur les livres
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Rechercher un livre (titre, auteur...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
          className="flex-1"
        />
        <Button onClick={searchBooks} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Rechercher
        </Button>
      </div>

      {/* Ma Collection */}
      <section className="space-y-4">
          {loading && !searched ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement de votre collection...</p>
            </div>
          ) : localBooks.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Votre collection est vide. Utilisez la recherche pour ajouter des livres depuis OpenLibrary !
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {localBooks.map((book) => (
                <Card key={book.id} className="flex flex-col">
                  <CardHeader>
                    {book.coverUrl && (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <CardDescription>
                      {book.authors || "Auteur inconnu"}
                      {book.publishYear && ` (${book.publishYear})`}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      {book.isbn13 && <Badge variant="secondary">ISBN-13: {book.isbn13}</Badge>}
                      {book.isbn10 && <Badge variant="secondary">ISBN-10: {book.isbn10}</Badge>}
                      {!book.isbn13 && !book.isbn10 && book.openlibraryId && (
                        <Badge variant="outline">OpenLibrary: {book.openlibraryId}</Badge>
                      )}
                    </div>

                    {book.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {book.description}
                      </p>
                    )}

                    {book.averageRating && (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(book.averageRating!)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({book.reviewCount} avis)
                        </span>
                      </div>
                    )}

                    {/* Reviews existantes */}
                    {expandedBook === book.id && book.reviews && book.reviews.length > 0 && (
                      <div className="space-y-2 mt-4 pt-4 border-t">
                        <h4 className="font-semibold text-sm">Avis des lecteurs :</h4>
                        {book.reviews.map((review) => (
                          <div key={review.id} className="bg-muted p-3 rounded text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {review.reviewCreationDate}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{review.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex-col gap-3">
                    {book.reviews && book.reviews.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(book.id)}
                        className="w-full"
                      >
                        {expandedBook === book.id ? "Masquer les avis" : `Voir les ${book.reviewCount} avis`}
                      </Button>
                    )}

                    {/* Formulaire d'ajout de review */}
                    <div className="w-full space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`w-5 h-5 cursor-pointer ${
                              (reviewDrafts[book.id]?.rating || 4) >= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                            onClick={() => onReviewChange(book.id, "rating", rating)}
                          />
                        ))}
                      </div>
                      <Textarea
                        placeholder="Votre avis sur ce livre..."
                        value={reviewDrafts[book.id]?.description || ""}
                        onChange={(e) => onReviewChange(book.id, "description", e.target.value)}
                        rows={2}
                      />
                      <Button
                        size="sm"
                        onClick={() => submitReview(book)}
                        className="w-full"
                      >
                        Publier mon avis
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
      </section>

      {/* Suggestions OpenLibrary */}
      <section className="space-y-4 mt-8">
          {openLibraryBooks.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Effectuez une recherche pour voir les suggestions d'OpenLibrary
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {openLibraryBooks.map((book) => (
                <Card key={book.openlibraryId || book.id}>
                  <CardHeader>
                    {book.coverUrl && (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <CardDescription>
                      {book.authors || "Auteur inconnu"}
                      {book.publishYear && ` (${book.publishYear})`}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      {book.isbn13 && <Badge variant="secondary">ISBN-13: {book.isbn13}</Badge>}
                      {book.isbn10 && <Badge variant="secondary">ISBN-10: {book.isbn10}</Badge>}
                      {book.openlibraryId && (
                        <Badge variant="outline">OL: {book.openlibraryId}</Badge>
                      )}
                    </div>

                    {book.description && (
                      <p className="text-sm text-muted-foreground line-clamp-4">
                        {book.description}
                      </p>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => addBookToDb(book)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter à ma collection
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
      </section>
    </div>
  );
}
