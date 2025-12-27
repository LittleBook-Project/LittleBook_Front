import { useState, useEffect } from "react";
import { Star, Loader2, Book as BookIcon, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Review } from "@/types/review";

const Feed = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [minRating, setMinRating] = useState<string>("all");
  const { toast } = useToast();

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const ratingParam = minRating !== "all" ? `&minRating=${minRating}` : "";
      const res = await fetch(`/reviews/feed?page=${page}&size=20${ratingParam}`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch feed");
      }

      const data = await res.json();
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching feed:", error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de charger le feed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [page, minRating]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📚 Feed Global</h1>
          <p className="text-muted-foreground">
            Découvrez les dernières reviews de la communauté
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium">Filtrer par note :</label>
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Toutes les notes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les notes</SelectItem>
              <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
              <SelectItem value="4">⭐⭐⭐⭐+ (4+)</SelectItem>
              <SelectItem value="3">⭐⭐⭐+ (3+)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Reviews List */}
        {!loading && reviews.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucune review pour le moment
            </CardContent>
          </Card>
        )}

        {!loading && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {review.bookCoverUrl && (
                          <img
                            src={review.bookCoverUrl}
                            alt={review.bookTitle}
                            className="w-16 h-24 object-cover rounded shadow-sm"
                          />
                        )}
                        <div>
                          <CardTitle className="text-xl">
                            {review.bookTitle || "Livre inconnu"}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <BookIcon className="h-4 w-4" />
                            {review.bookAuthors || "Auteur inconnu"}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <Badge variant="outline">{review.rating}/5</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {review.comment && (
                    <p className="text-sm mb-4 italic">"{review.comment}"</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{review.username || review.userEmail || "Anonyme"}</span>
                    </div>
                    <span>
                      {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Précédent
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page + 1} sur {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
