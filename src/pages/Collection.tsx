import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import OpenLibraryModal from "@/components/OpenLibraryModal";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, Page } from "@/lib/api";
import { Book } from "@/types/book";
import { Review } from "@/types/review";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Search, Star } from "lucide-react";

interface ReviewDraft {
  rating: number;
  description: string;
}

export default function Collection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [openLibModal, setOpenLibModal] = useState(false);
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [subjects, setSubjects] = useState("");
  const [minYear, setMinYear] = useState<number | "">("");
  const [maxYear, setMaxYear] = useState<number | "">("");
  const [source, setSource] = useState("all");
  const [drafts, setDrafts] = useState<Record<string, ReviewDraft>>({});
  const { toast } = useToast();

  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const loadBooks = async (query?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", "0");
      params.append("size", "50");
      if (query) params.append("q", query);
      if (author) params.append("author", author);
      if (subjects) params.append("subjects", subjects);
      if (minYear !== "") params.append("minYear", String(minYear));
      if (maxYear !== "") params.append("maxYear", String(maxYear));
      if (source && source !== "all") params.append("source", source);

      const response = await apiFetch<Page<Book>>(`/books?${params.toString()}`);
      setBooks(response?.content || []);
    } catch (error) {
      console.error("Erreur chargement collection:", error);
      toast({
        title: "❌ Impossible de charger la collection",
        description: "Vérifiez que le backend est démarré (gateway).",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const onReviewChange = (bookId: string, field: keyof ReviewDraft, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [bookId]: {
        rating: field === "rating" ? Number(value) : prev[bookId]?.rating || 4,
        description: field === "description" ? value : prev[bookId]?.description || "",
      },
    }));
  };

  const submitReview = async (book: Book) => {
    const bookIsbn = book.isbn13 || book.isbn10;
    if (!bookIsbn) {
      toast({
        title: "⚠️ ISBN manquant",
        description: "Impossible de poster une review sans ISBN.",
        variant: "destructive",
      });
      return;
    }

    const draft = drafts[book.id] || { rating: 4, description: "" };
    const userUuid = user?.uid || "anonymous-demo";

    try {
      const payload: Review = {
        id: 0,
        rating: draft.rating,
        description: draft.description,
        reviewCreationDate: new Date().toISOString().slice(0, 10),
        userUuid,
        bookIsbn,
      };

      await apiFetch<Review>("/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast({
        title: "✅ Review enregistrée",
        description: `Votre avis sur "${book.title}" est publié`,
      });
    } catch (error) {
      console.error("Erreur review:", error);
      toast({
        title: "❌ Erreur review",
        description: "Impossible d'enregistrer votre avis",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Ma Collection</h1>
            <p className="text-muted-foreground">
              Livres stockés sur LittleBook (importés via OpenLibrary ou ajoutés manuellement)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setOpenLibModal(true)} variant="secondary" className="rounded-full px-4">
              Ajouter un livre OpenLibrary
            </Button>
            <Button onClick={() => loadBooks(search)} disabled={loading} className="rounded-full px-6">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rafraîchir"}
            </Button>
          </div>
        </div>

        <OpenLibraryModal open={openLibModal} onOpenChange={(v) => setOpenLibModal(v)} onAdded={() => { setOpenLibModal(false); loadBooks(); }} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg shadow-soft border border-border/50">
            <div className="text-2xl font-bold text-primary">{books.length}</div>
            <div className="text-sm text-muted-foreground">Livres en base</div>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-soft border border-border/50">
            <div className="text-2xl font-bold text-blue-600">{books.filter((b) => b.publishYear).length}</div>
            <div className="text-sm text-muted-foreground">Référencés (année)</div>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-soft border border-border/50">
            <div className="text-2xl font-bold text-green-600">{books.filter((b) => b.coverUrl).length}</div>
            <div className="text-sm text-muted-foreground">Avec couverture</div>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-soft border border-border/50">
            <div className="text-2xl font-bold text-purple-600">{books.filter((b) => b.subjects).length}</div>
            <div className="text-sm text-muted-foreground">Catégorisés</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans la collection (titre, auteur, ISBN)"
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadBooks(search)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Auteur"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-56"
              />

              <Input
                placeholder="Sujets (séparés par ,)"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                className="w-72"
              />

              <Input
                type="number"
                placeholder="Min année"
                value={minYear}
                onChange={(e) => setMinYear(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-28"
              />

              <Input
                type="number"
                placeholder="Max année"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-28"
              />

              <select
                className="border rounded px-2 py-1"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="all">Toutes</option>
                <option value="local">Local</option>
                <option value="openlibrary">OpenLibrary</option>
              </select>

              <Button variant="outline" onClick={() => loadBooks(search)} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rechercher"}
              </Button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Chargement...
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Aucun livre dans la collection. Ajoutez-en depuis l'onglet Livres.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const draft = drafts[book.id] || { rating: 4, description: "" };
            return (
              <Card key={book.id} className="border-border/60 shadow-soft">
                <CardHeader>
                  <div className="flex gap-4">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-28 bg-muted rounded flex items-center justify-center">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                      {book.subtitle && <p className="text-sm text-muted-foreground">{book.subtitle}</p>}
                      <p className="text-sm text-muted-foreground mt-1">{book.authors}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {book.publishYear && <Badge variant="outline">{book.publishYear}</Badge>}
                        {book.subjects && book.subjects.split(",").slice(0, 2).map((s) => (
                          <Badge key={s} variant="secondary">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">ISBN :</span>
                    <span>{book.isbn13 || book.isbn10 || "Non renseigné"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={draft.rating}
                      onChange={(e) => onReviewChange(book.id, "rating", e.target.value)}
                      className="w-20"
                    />
                  </div>
                  <Textarea
                    placeholder="Votre avis sur ce livre..."
                    value={draft.description}
                    onChange={(e) => onReviewChange(book.id, "description", e.target.value)}
                  />
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Votre review sera visible dans Profil</span>
                  <Button size="sm" onClick={() => submitReview(book)}>
                    Publier
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}