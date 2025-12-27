import { useState } from "react";
import { Search, Plus, Book as BookIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, Page } from "@/lib/api";
import { Book } from "@/types/book";

type SyncBook = Book;

const normalizeIsbn = (value?: string) => value?.replace(/[^0-9Xx]/g, "");

const Books = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [openLibraryBooks, setOpenLibraryBooks] = useState<SyncBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

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

      setLocalBooks(localData?.content || []);
      setOpenLibraryBooks(syncedData?.content || []);

      const localCount = localData?.content?.length || 0;
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
        description: "Impossible de rechercher les livres. Vérifiez que le backend est actif.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addBookToDb = async (olBook: SyncBook) => {
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
      
      // Recharger la recherche pour afficher le livre dans la collection
      handleSearch();
    } catch (error) {
      console.error("Erreur ajout livre:", error);
      toast({
        title: "❌ Erreur",
        description: "Impossible d'ajouter le livre. Vérifiez que le backend est actif.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
          <BookIcon className="w-8 h-8" />
          Gestion des Livres
        </h1>

        <div className="mb-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher un livre (titre, auteur, ISBN)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchBooks()}
              className="pl-10"
            />
          </div>
          <Button onClick={searchBooks} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Rechercher"}
          </Button>
        </div>

        {localBooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              📚 Livres dans notre bibliothèque ({localBooks.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex gap-4">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-20 h-28 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center">
                          <BookIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{book.title}</CardTitle>
                        {book.subtitle && (
                          <CardDescription>{book.subtitle}</CardDescription>
                        )}
                        <p className="text-sm text-gray-600 mt-1">{book.authors}</p>
                        {book.publishYear && (
                          <Badge variant="outline" className="mt-2">
                            {book.publishYear}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {book.subjects && (
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {book.subjects.split(",").slice(0, 3).map((subject, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                  <CardFooter className="text-xs text-gray-500">
                    {book.isbn13 && `ISBN-13: ${book.isbn13}`}
                    {!book.isbn13 && book.isbn10 && `ISBN-10: ${book.isbn10}`}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {openLibraryBooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              🌐 Ajouts OpenLibrary (via backend) ({openLibraryBooks.length})
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Ces livres ont été importés depuis OpenLibrary par le backend (gateway ➜ book-service).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openLibraryBooks.map((book) => (
                <Card key={book.openlibraryId || book.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex gap-4">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-20 h-28 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center">
                          <BookIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{book.title}</CardTitle>
                        {book.authors && (
                          <p className="text-sm text-gray-600 mt-1">{book.authors}</p>
                        )}
                        {book.publishYear && (
                          <Badge variant="outline" className="mt-2">
                            {book.publishYear}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {book.subjects && (
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {book.subjects.split(",").slice(0, 3).map((subject, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {book.isbn13 || book.isbn10 ? `ISBN: ${book.isbn13 || book.isbn10}` : "ISBN non renseigné"}
                    </span>
                    <Button size="sm" onClick={() => addBookToDb(book)} className="gap-1" variant="outline">
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {searched && !loading && localBooks.length === 0 && openLibraryBooks.length === 0 && (
          <div className="text-center py-12">
            <BookIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun livre trouvé</p>
            <p className="text-gray-400 text-sm">Essayez avec d'autres mots-clés</p>
          </div>
        )}

        {!searched && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Recherchez un livre pour commencer</p>
            <p className="text-gray-400 text-sm">Tapez un titre, auteur ou ISBN puis appuyez sur Entrée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
