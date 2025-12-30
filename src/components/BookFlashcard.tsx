import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, MessageSquare, ChevronDown, ChevronUp, Trash2, Edit2 } from "lucide-react";

interface BookFlashcardProps {
  id: string;
  title: string;
  authors: string;
  source?: string;
  coverUrl?: string;
  publishYear?: number;
  description?: string;
  isbn13?: string;
  subjects?: string;
  onAddReview?: (bookId: string) => void;
  onEditReview?: (bookId: string, reviewId: string) => void;
  onDeleteReview?: (bookId: string, reviewId: string) => void;
  currentUserReview?: {
    id: string;
    rating: number;
    description: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    description: string;
    userName?: string;
  }>;
}

export function BookFlashcard({
  id,
  title,
  authors,
  source,
  coverUrl,
  publishYear,
  description,
  isbn13,
  subjects,
  onAddReview,
  onEditReview,
  onDeleteReview,
  currentUserReview,
  reviews = [],
}: BookFlashcardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const averageRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
        ) / 10
      : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
              Pas de couverture
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">{authors}</p>
            {source && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {source === "openlibrary" ? "OpenLibrary" : source}
              </span>
            )}
          </div>
          {publishYear && (
            <p className="text-xs text-gray-500 mt-1">{publishYear}</p>
          )}
        </div>

        {/* Summary */}
        {description && (
          <p className="text-sm text-gray-700 line-clamp-2">
            {description}
          </p>
        )}

        {/* Current User Review */}
        {currentUserReview && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {Array.from({ length: currentUserReview.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => onEditReview?.(id, currentUserReview.id)}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-red-600"
                  onClick={() => onDeleteReview?.(id, currentUserReview.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-700">Votre avis</p>
            <p className="text-xs text-gray-600 italic">
              {currentUserReview.description}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>12</span>
          </div>
          <div className="flex items-center gap-1">
            {averageRating > 0 && (
              <>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{averageRating}</span>
              </>
            )}
            {reviews.length > 0 && <span className="text-gray-500">({reviews.length})</span>}
          </div>
        </div>

        {/* Expand Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Fermer
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Plus de détails
            </>
          )}
        </Button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {/* Full Description */}
            {description && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Résumé</h4>
                <p className="text-sm text-gray-700">{description}</p>
              </div>
            )}

            {/* Book Details */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Détails</h4>
              <div className="text-xs space-y-1 text-gray-600">
                {publishYear && <p>📅 Année: {publishYear}</p>}
                {isbn13 && <p>📖 ISBN: {isbn13}</p>}
                {subjects && <p>🏷️ Catégories: {subjects}</p>}
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  Avis ({reviews.length}) • Note moyenne: {averageRating}/5
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 p-3 rounded border border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        {review.userName && (
                          <span className="text-xs font-medium text-gray-700 ml-auto">
                            {review.userName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {review.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Review Button */}
            {!currentUserReview && (
              <Button
                onClick={() => onAddReview?.(id)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Ajouter un avis
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
