import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Edit, Calendar, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch, Page, apiUrl } from "@/lib/api";
import { Review } from "@/types/review";
import { Book } from "@/types/book";
import { useToast } from "@/hooks/use-toast";
import ReviewDialog from "@/components/ReviewDialog";
import { Trash2, Edit as EditIcon } from "lucide-react";

interface EnrichedReview {
  review: Review;
  book?: Book;
}

export default function Profile() {
  const [user, setUser] = useState<any | null>(null);
  const [reviews, setReviews] = useState<EnrichedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Edit dialog state
  const [editing, setEditing] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editingBookTitle, setEditingBookTitle] = useState<string>("");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      const parsed = JSON.parse(raw);
      setUser(parsed);
      setUserId(parsed?.uid ?? null);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch<Review[]>(`/reviews/user/${userId}`);
        const enriched = await Promise.all(
          data.map(async (r) => {
            // Try multiple strategies to resolve the book for better resilience
            try {
              // 1) If review references bookId (UUID), fetch by id
              if (r.bookId) {
                try {
                  const b = await apiFetch<Book>(`/book/${encodeURIComponent(r.bookId)}`);
                  return { review: r, book: b } as EnrichedReview;
                } catch (e) {
                  // ignore and continue
                }
              }

              // 2) If review has ISBN, try list endpoint first
              if (r.bookIsbn) {
                try {
                  const page = await apiFetch<Page<Book>>(`/book?isbn=${encodeURIComponent(r.bookIsbn)}&page=0&size=1`);
                  if (page?.content && page.content.length > 0) {
                    return { review: r, book: page.content[0] } as EnrichedReview;
                  }
                } catch (e) {
                  // ignore and try specific endpoints below
                }

                // 3) try /by-isbn13 (some books stored as isbn13)
                try {
                  const res = await apiFetch<Book>(`/book/by-isbn13?isbn13=${encodeURIComponent(r.bookIsbn)}`);
                  if (res) return { review: r, book: res } as EnrichedReview;
                } catch (e) {
                  // ignore
                }

                // 4) try by openlibrary id (in case stored differently)
                try {
                  const res2 = await apiFetch<Book>(`/book/by-olid?olId=${encodeURIComponent(r.bookIsbn)}`);
                  if (res2) return { review: r, book: res2 } as EnrichedReview;
                } catch (e) {
                  // ignore
                }
              }

              // Not found
              return { review: r } as EnrichedReview;
            } catch (err) {
              console.warn("Livre introuvable pour review", r.bookIsbn || r.bookId, err);
              return { review: r } as EnrichedReview;
            }
          })
        );
        setReviews(enriched);
      } catch (error) {
        console.error("Erreur chargement reviews:", error);
        toast({
          title: "⚠️ Impossible de récupérer vos reviews",
          description: "Assurez-vous que le gateway est démarré et que vous avez ajouté des avis.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId, toast]);

  const refresh = async () => {
    setLoading(true);
    setReviews([]);
    try {
      const data = await apiFetch<Review[]>(`/reviews/user/${userId}`);
      const enriched = await Promise.all(
        data.map(async (r) => {
          try {
            if (r.bookId) {
              try {
                const b = await apiFetch<Book>(`/book/${encodeURIComponent(r.bookId)}`);
                return { review: r, book: b } as EnrichedReview;
              } catch (e) {}
            }

            if (r.bookIsbn) {
              try {
                const page = await apiFetch<Page<Book>>(`/book?isbn=${encodeURIComponent(r.bookIsbn)}&page=0&size=1`);
                if (page?.content && page.content.length > 0) return { review: r, book: page.content[0] } as EnrichedReview;
              } catch (e) {}

              try {
                const res = await apiFetch<Book>(`/book/by-isbn13?isbn13=${encodeURIComponent(r.bookIsbn)}`);
                if (res) return { review: r, book: res } as EnrichedReview;
              } catch (e) {}

              try {
                const res2 = await apiFetch<Book>(`/book/by-olid?olId=${encodeURIComponent(r.bookIsbn)}`);
                if (res2) return { review: r, book: res2 } as EnrichedReview;
              } catch (e) {}
            }

            return { review: r } as EnrichedReview;
          } catch (err) {
            return { review: r } as EnrichedReview;
          }
        })
      );
      setReviews(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (r: Review, bookTitle?: string) => {
    setEditingReview(r);
    setEditingBookTitle(bookTitle || "");
    setEditing(true);
  };

  const onDelete = async (r: Review) => {
    if (!userId) return;
    const ok = window.confirm("Supprimer cet avis ? Cette action est irréversible.");
    if (!ok) return;
    try {
      await fetch(apiUrl(`/reviews/${r.id}?userUuid=${encodeURIComponent(userId)}`), { method: "DELETE", credentials: 'include' });
      toast({ title: "✅ Avis supprimé" });
      await refresh();
    } catch (err: any) {
      console.error("Erreur suppression review:", err);
      toast({ title: "❌ Impossible de supprimer", description: err?.message, variant: "destructive" });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Connectez-vous pour voir votre profil.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex flex-col items-center md:items-start">
                <img
                  src={user.photoURL || "https://placehold.co/128x128"}
                  alt={user.displayName || user.email}
                  className="w-32 h-32 rounded-full shadow-book mb-4 object-cover"
                />
                <Button variant="outline" className="rounded-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier le profil
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{user.displayName || "Utilisateur"}</h1>
                  <p className="text-muted-foreground mb-2">{user.email}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="mr-1 h-4 w-4" />
                    Compte connecté via Firebase
                  </div>
                  <p className="text-foreground leading-relaxed">
                    Vos livres ajoutés via la page Livres et vos reviews apparaissent ici.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Mes reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p className="text-muted-foreground">Chargement des reviews...</p>}
            {!loading && reviews.length === 0 && (
              <p className="text-muted-foreground">Vous n'avez pas encore publié d'avis.</p>
            )}
            {!loading && reviews.map(({ review, book }) => (
              <div key={review.id} className="border border-border/50 rounded-lg p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{book?.title || review.bookIsbn}</p>
                    <p className="text-sm text-muted-foreground">{book?.authors}</p>
                  </div>
                  {review.rating && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {review.rating}/5
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-foreground">{review.description || "Pas de commentaire."}</p>
                <p className="text-xs text-muted-foreground">
                  ISBN: {review.bookIsbn} • Le {review.reviewCreationDate || "date inconnue"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(review, book?.title)}>
                    <EditIcon className="mr-2 h-3 w-3" /> Modifier
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(review)}>
                    <Trash2 className="mr-2 h-3 w-3" /> Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      {editing && editingReview && (
        <ReviewDialog
          open={editing}
          onOpenChange={(v) => { if (!v) setEditing(false); else setEditing(v); }}
          bookId={editingReview.bookIsbn}
          bookTitle={editingBookTitle || editingReview.bookIsbn}
          existingReview={{ id: String(editingReview.id), rating: editingReview.rating || 0, comment: editingReview.description }}
          onReviewSubmitted={async () => { setEditing(false); await refresh(); }}
        />
      )}
    </div>
  );
}
