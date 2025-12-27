import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookFlashcard } from "@/components/BookFlashcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";

interface Book {
  id: string;
  title: string;
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

export default function BooksGrid() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  // Fetch all books with pagination
  const { data: booksData, isLoading } = useQuery({
    queryKey: ["books", currentPage, sortBy, searchTerm],
    queryFn: async () => {
      const res = await fetch(
        `/api/book?page=${currentPage}&size=${pageSize}&search=${searchTerm}`
      );
      if (!res.ok) throw new Error("Erreur lors du chargement");
      return res.json();
    },
  });

  const books: BookWithReviews[] = booksData?.content || [];
  const totalPages = booksData?.totalPages || 0;
  const totalElements = booksData?.totalElements || 0;

  // Sort books
  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "author":
        return a.authors.localeCompare(b.authors);
      case "year-new":
        return (b.publishYear || 0) - (a.publishYear || 0);
      case "year-old":
        return (a.publishYear || 0) - (b.publishYear || 0);
      case "recent":
      default:
        return 0;
    }
  });

  const handleAddReview = (bookId: string) => {
    navigate("/books");
  };

  const handleEditReview = (bookId: string, reviewId: string) => {
    navigate("/books");
  };

  const handleDeleteReview = (bookId: string, reviewId: string) => {
    // Call delete API
    fetch(`/api/review/${reviewId}?userUuid=${localStorage.getItem("userId")}`, {
      method: "DELETE",
    })
      .then(() => {
        // Refresh the page
        window.location.reload();
      })
      .catch((err) => console.error("Erreur suppression review", err));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Tous les livres</h1>
          <p className="text-gray-600">
            {totalElements} livre{totalElements > 1 ? "s" : ""} disponible
            {totalElements > 1 ? "s" : ""}
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un livre..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trier par..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Récents</SelectItem>
              <SelectItem value="title-asc">Titre (A-Z)</SelectItem>
              <SelectItem value="title-desc">Titre (Z-A)</SelectItem>
              <SelectItem value="author">Auteur</SelectItem>
              <SelectItem value="year-new">Année (récent)</SelectItem>
              <SelectItem value="year-old">Année (ancien)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : sortedBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedBooks.map((book) => (
                <BookFlashcard
                  key={book.id}
                  {...book}
                  onAddReview={handleAddReview}
                  onEditReview={handleEditReview}
                  onDeleteReview={handleDeleteReview}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              >
                Précédent
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = currentPage + i - 2 >= 0 ? currentPage + i - 2 : 0;
                  if (pageNum >= totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10 h-10 p-0"
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              >
                Suivant
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Aucun livre trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
