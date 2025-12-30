export { default } from "./UnifiedBooks";

interface Book {
  id: string;
  title: string;
  authors: string;
  isbn13?: string;
  isbn10?: string;
  coverUrl?: string;
  publishYear?: number;
  subjects?: string;
  source?: string;
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
  const [author, setAuthor] = useState("");
  const [subjectsFilter, setSubjectsFilter] = useState("");
  const [minYear, setMinYear] = useState<number | "">("");
  const [maxYear, setMaxYear] = useState<number | "">("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  // Fetch all books with pagination
  const { data: booksData, isLoading } = useQuery({
    queryKey: ["books", currentPage, sortBy, searchTerm, author, subjectsFilter, minYear, maxYear, sourceFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(currentPage));
      params.append("size", String(pageSize));
      if (searchTerm) params.append("q", searchTerm);
      if (author) params.append("author", author);
      if (subjectsFilter) params.append("subjects", subjectsFilter);
      if (minYear !== "") params.append("minYear", String(minYear));
      if (maxYear !== "") params.append("maxYear", String(maxYear));
      if (sourceFilter && sourceFilter !== "all") params.append("source", sourceFilter);

      // map client sort to backend fields
      let sortField: string | null = null;
      let sortDir: string | null = null;
      switch (sortBy) {
        case "title-asc":
          sortField = "title";
          sortDir = "asc";
          break;
        case "title-desc":
          sortField = "title";
          sortDir = "desc";
          break;
        case "author":
          sortField = "authors";
          sortDir = "asc";
          break;
        case "year-new":
          sortField = "publishYear";
          sortDir = "desc";
          break;
        case "year-old":
          sortField = "publishYear";
          sortDir = "asc";
          break;
        case "recent":
        default:
          sortField = null;
      }
      if (sortField) {
        params.append("sort", sortField);
        params.append("dir", sortDir ?? "asc");
      }

      const url = `/api/book?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erreur lors du chargement");
      return res.json();
    },
  });

  const books: BookWithReviews[] = booksData?.content || [];
  const totalPages = booksData?.totalPages || 0;
  const totalElements = booksData?.totalElements || 0;

  // Server-side sorting is used; `books` is trusted as returned by backend

  const handleAddReview = (bookId: string) => {
    navigate("/books");
  };

  const handleEditReview = (bookId: string, reviewId: string) => {
    navigate("/books");
  };

  const handleDeleteReview = (bookId: string, reviewId: string) => {
    // Call delete API
    fetch(`/api/reviews/${reviewId}?userUuid=${localStorage.getItem("userId")}`, {
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

          {/* Author filter */}
          <div className="w-48">
            <Input
              placeholder="Auteur"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                setCurrentPage(0);
              }}
            />
          </div>

          {/* Subjects filter */}
          <div className="w-48">
            <Input
              placeholder="Sujets (séparés par ,)"
              value={subjectsFilter}
              onChange={(e) => {
                setSubjectsFilter(e.target.value);
                setCurrentPage(0);
              }}
            />
          </div>

          {/* Year range */}
          <div className="flex gap-2 items-center">
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
          </div>

          {/* Source filter */}
          <div className="w-40">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="openlibrary">OpenLibrary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : sortedBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookFlashcard
                  key={book.id}
                  {...book}
                  source={book.source}
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
