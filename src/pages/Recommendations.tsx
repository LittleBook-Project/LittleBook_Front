import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { apiFetch } from "@/lib/api";
import ReviewDialog from "@/components/ReviewDialog";

type RecItem = {
  isbn: string;
  title?: string | null;
  authors?: string | null;
  averageRating?: number;
};

type EnrichedRec = RecItem & {
  coverUrl?: string | null;
  publishYear?: number | null;
  bookId?: string | null;
};

export default function Recommendations() {
  const [items, setItems] = useState<RecItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [enriched, setEnriched] = useState<EnrichedRec[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedIsbn, setSelectedIsbn] = useState<string>("");
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    const user = JSON.parse(raw);
    const uid = user?.uid;
    if (!uid) return;

    (async () => {
      setLoading(true);
      try {
        const data = await fetch(`/api/recommendations/user/${uid}`, { credentials: "include" }).then(r => r.json());
        const list = Array.isArray(data) ? data : [];
        if (list.length === 0) {
          // Fallback: show top books if recommendation service returned nothing
          try {
            const page = await apiFetch(`/books?page=0&size=10`);
            const fallback = (page?.content || []).map((b: any) => ({ isbn: b.isbn13 || b.isbn10 || b.openlibraryId || b.id, title: b.title, authors: b.authors, averageRating: undefined }));
            setItems(fallback);
            // enrich fallback
            setEnriched(
              (fallback || []).map((b: any) => ({
                isbn: b.isbn,
                title: b.title,
                authors: b.authors,
                averageRating: b.averageRating,
                coverUrl: undefined,
                publishYear: undefined,
                bookId: undefined,
              }))
            );
          } catch (e) {
            setItems([]);
          }
        } else {
          setItems(list);
          // try to enrich each recommended item with local book details
          const enrichedList = await Promise.all(
            list.map(async (it: any) => {
              const isbn = it.isbn;
              try {
                // try list endpoint
                const page = await apiFetch(`/books?isbn=${encodeURIComponent(isbn)}&page=0&size=1`);
                const book = page?.content?.[0];
                if (book) {
                  return {
                    isbn,
                    title: it.title ?? book.title,
                    authors: it.authors ?? book.authors,
                    averageRating: it.averageRating,
                    coverUrl: book.coverUrl,
                    publishYear: book.publishYear,
                    bookId: book.id,
                  } as EnrichedRec;
                }
              } catch (e) {
                // ignore
              }

              // fallback minimal
              return {
                isbn,
                title: it.title,
                authors: it.authors,
                averageRating: it.averageRating,
              } as EnrichedRec;
            })
          );
          setEnriched(enrichedList);
        }
      } catch (err) {
        console.warn("Failed to load recommendations:", err);
        try {
          const page = await apiFetch(`/books?page=0&size=10`);
          const fallback = (page?.content || []).map((b: any) => ({ isbn: b.isbn13 || b.isbn10 || b.openlibraryId || b.id, title: b.title, authors: b.authors, averageRating: undefined }));
          setItems(fallback);
          setEnriched((page?.content || []).map((b: any) => ({ isbn: b.isbn13 || b.isbn10 || b.openlibraryId || b.id, title: b.title, authors: b.authors, averageRating: undefined, coverUrl: b.coverUrl, publishYear: b.publishYear, bookId: b.id })));
        } catch (e) {
          setItems([]);
          setEnriched([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div>Chargement...</div>}
          {!loading && enriched.length === 0 && items.length === 0 && <div>Aucune recommandation pour le moment.</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enriched.map((it) => (
              <Card key={it.isbn} className="flex flex-col">
                <CardHeader>
                  {it.coverUrl ? (
                    <img src={it.coverUrl} alt={it.title} className="w-full h-48 object-cover rounded-md mb-3" />
                  ) : null}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">{it.title ?? it.isbn}</div>
                      <div className="text-sm text-muted-foreground">{it.authors ?? "—"}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Note moyenne: {it.averageRating?.toFixed?.(2) ?? "—"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  {it.publishYear && <Badge variant="outline">{it.publishYear}</Badge>}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button size="sm" variant="ghost" onClick={() => { setSelectedIsbn(it.isbn); setSelectedTitle(it.title || it.isbn); setReviewOpen(true); }}>
                    Ajouter une review
                  </Button>
                  <div className="text-xs text-muted-foreground">ISBN: {it.isbn}</div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <ReviewDialog
        open={reviewOpen}
        onOpenChange={(v) => setReviewOpen(v)}
        bookId={selectedIsbn}
        bookTitle={selectedTitle}
        onReviewSubmitted={async () => {
          // refresh recommendations after adding
          setReviewOpen(false);
          setLoading(true);
          try { /* re-run effect by simple reload */
            const page = await apiFetch(`/books?page=0&size=10`);
            setEnriched((page?.content || []).map((b: any) => ({ isbn: b.isbn13 || b.isbn10 || b.openlibraryId || b.id, title: b.title, authors: b.authors, averageRating: undefined, coverUrl: b.coverUrl, publishYear: b.publishYear, bookId: b.id })));
          } catch (e) {}
          setLoading(false);
        }}
      />
    </div>
  );
}
