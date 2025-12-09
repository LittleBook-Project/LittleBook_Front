import { useState } from "react";
import { Search, Plus, Book as BookIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  publisher?: string[];
  subject?: string[];
}

interface OpenLibraryResponse {
  numFound: number;
  docs: OpenLibraryBook[];
}

const Books = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [openLibraryBooks, setOpenLibraryBooks] = useState<OpenLibraryBook[]>([]);
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
      // 1. Chercher dans notre DB locale
      const localRes = await fetch(`/books?q=${encodeURIComponent(searchQuery)}&page=0&size=20`);
      
      if (!localRes.ok) {
        throw new Error("Erreur lors de la recherche locale");
      }

      const localData = await localRes.json();
      setLocalBooks(localData.content || []);

      // 2. Toujours chercher sur OpenLibrary en parallèle
      const olRes = await fetch(`/books/search/openlibrary?q=${encodeURIComponent(searchQuery)}&limit=10`);
      
      if (!olRes.ok) {
        throw new Error("Erreur lors de la recherche OpenLibrary");
      }

      const olData: OpenLibraryResponse = await olRes.json();
      setOpenLibraryBooks(olData.docs || []);

      // Toast en fonction des résultats
      if ((localData.content && localData.content.length > 0) || (olData.docs && olData.docs.length > 0)) {
        toast({
          title: "✅ Recherche terminée",
          description: `${localData.content?.length || 0} livre(s) en DB, ${olData.docs?.length || 0} suggestion(s) OpenLibrary`,
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

  const addBookToDb = async (olBook: OpenLibraryBook) => {
    try {
      const payload = {
        openlibraryKey: olBook.key,
        title: olBook.title,
        authors: olBook.author_name?.join(", ") || "",
        isbn13: olBook.isbn?.find((i) => i.length === 13) || "",
        isbn10: olBook.isbn?.find((i) => i.length === 10) || "",
        coverUrl: olBook.cover_i
          ? `https://covers.openlibrary.org/b/id/${olBook.cover_i}-M.jpg`
          : "",
        publishYear: olBook.first_publish_year,
        subjects: olBook.subject?.slice(0, 5).join(",") || "",
        description: "",
      };

      const res = await fetch("/books/from-openlibrary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const addedBook = await res.json();
        toast({
          title: "✅ Livre ajouté !",
          description: `"${olBook.title}" a été ajouté à votre bibliothèque`,
        });
        // Rafraîchir la recherche
        await searchBooks();
      } else {
        throw new Error("Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error("Erreur ajout:", error);
      toast({
        title: "❌ Erreur",
        description: "Impossible d'ajouter le livre",
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

        {/* Barre de recherche */}
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

        {/* Résultats de notre DB locale */}
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
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions OpenLibrary */}
        {openLibraryBooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              🌐 Suggestions depuis OpenLibrary ({openLibraryBooks.length})
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {localBooks.length > 0 
                ? "Vous pouvez ajouter d'autres livres depuis OpenLibrary :" 
                : "Ces livres ne sont pas encore dans votre bibliothèque. Cliquez sur \"Ajouter\" pour les enregistrer."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openLibraryBooks.map((book) => (
                <Card key={book.key} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex gap-4">
                      {book.cover_i ? (
                        <img
                          src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
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
                        {book.author_name && (
                          <p className="text-sm text-gray-600 mt-1">
                            {book.author_name.join(", ")}
                          </p>
                        )}
                        {book.first_publish_year && (
                          <Badge variant="outline" className="mt-2">
                            {book.first_publish_year}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {book.subject && book.subject.length > 0 && (
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {book.subject.slice(0, 3).map((subject, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {book.isbn?.[0] && `ISBN: ${book.isbn[0]}`}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => addBookToDb(book)}
                      className="gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Aucun résultat */}
        {searched && !loading && localBooks.length === 0 && openLibraryBooks.length === 0 && (
          <div className="text-center py-12">
            <BookIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun livre trouvé</p>
            <p className="text-gray-400 text-sm">Essayez avec d'autres mots-clés</p>
          </div>
        )}

        {/* Message initial */}
        {!searched && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Recherchez un livre pour commencer</p>
            <p className="text-gray-400 text-sm">
              Tapez un titre, auteur ou ISBN puis appuyez sur Entrée
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
