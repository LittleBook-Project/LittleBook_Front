import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  bookTitle: string;
  existingReview?: {
    id: string;
    rating: number;
    comment?: string;
  };
  onReviewSubmitted?: () => void;
}

const ReviewDialog = ({
  open,
  onOpenChange,
  bookId,
  bookTitle,
  existingReview,
  onReviewSubmitted,
}: ReviewDialogProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "⚠️ Note requise",
        description: "Veuillez donner une note au livre",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const url = existingReview
        ? `/reviews/${existingReview.id}`
        : "/reviews";
      
      const method = existingReview ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur lors de l'enregistrement");
      }

      toast({
        title: existingReview ? "✅ Review mise à jour" : "✅ Review ajoutée",
        description: `Votre avis sur "${bookTitle}" a été enregistré`,
      });

      onOpenChange(false);
      onReviewSubmitted?.();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        title: "❌ Erreur",
        description: error.message || "Impossible d'enregistrer votre review",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`h-8 w-8 ${
              isFilled
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? "Modifier votre review" : "Ajouter une review"}
          </DialogTitle>
          <DialogDescription>
            Partagez votre avis sur "{bookTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Note</label>
            <div className="flex gap-1">{renderStars()}</div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating}/5 étoiles
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Commentaire (optionnel)</label>
            <Textarea
              placeholder="Qu'avez-vous pensé de ce livre ?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading || rating === 0}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {existingReview ? "Mettre à jour" : "Publier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
