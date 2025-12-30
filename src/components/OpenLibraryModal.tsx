import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Loader2, BookOpen } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Book } from "@/types/book";

interface OpenLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded?: () => void;
}

export default function OpenLibraryModal({ open, onOpenChange, onAdded }: OpenLibraryModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (query.trim().length < 2) return;
    setLoading(true);
    try {
      const res = await apiFetch<{ content: Book[] }>(`/book/search-openlibrary?title=${encodeURIComponent(query)}&page=0&size=12`);
      setResults(res?.content || []);
    } catch (e) {
      console.error("Recherche OpenLibrary échouée", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const add = async (b: Book) => {
    if (!b.openlibraryId) return;
    try {
      await apiFetch(`/book/add-from-openlibrary?openlibraryId=${encodeURIComponent(b.openlibraryId)}`, { method: "POST" });
      if (onAdded) onAdded();
    } catch (e) {
      console.error("Ajout OpenLibrary échoué", e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un livre (OpenLibrary)</DialogTitle>
          <DialogDescription>Recherchez un titre et ajoutez-le à votre collection.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 mb-4 flex gap-2">
          <Input
            placeholder="Titre, auteur..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            className="flex-1"
          />
          <Button onClick={search} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {results.map((b) => (
            <Card key={b.openlibraryId || b.id} className="flex">
              {b.coverUrl ? (
                <div className="w-28 flex-shrink-0">
                  <img src={b.coverUrl} alt={b.title} className="w-28 h-40 object-cover rounded-l-md" />
                </div>
              ) : (
                <div className="w-28 h-40 bg-muted flex items-center justify-center rounded-l-md">
                  <BookOpen className="w-6 h-6 text-muted-foreground" />
                </div>
              )}

              <div className="flex-1 flex flex-col">
                <CardHeader className="py-3 pr-3">
                  <CardTitle className="text-sm line-clamp-2">{b.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{b.authors}</p>
                </CardHeader>
                <CardContent className="flex-1 py-0 pr-3">
                  {b.publishYear && <p className="text-xs text-muted-foreground">Année: {b.publishYear}</p>}
                  {b.description && <p className="text-sm text-muted-foreground line-clamp-3 mt-2">{b.description}</p>}
                </CardContent>
                <CardFooter className="pr-3 pt-2">
                  <Button size="sm" variant="outline" onClick={() => add(b)} className="gap-1">
                    <Plus className="w-4 h-4" /> Ajouter
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
