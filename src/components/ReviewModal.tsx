import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  bookIsbn13?: string;
  onSubmit: (rating: number, description: string) => Promise<void>;
  isLoading?: boolean;
  initialRating?: number;
  initialDescription?: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  bookTitle,
  bookIsbn13,
  onSubmit,
  isLoading = false,
  initialRating = 5,
  initialDescription = "",
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [description, setDescription] = useState(initialDescription);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Veuillez ajouter une description");
      return;
    }
    try {
      await onSubmit(rating, description);
      setRating(5);
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un avis</DialogTitle>
          <DialogDescription>
            {bookTitle}
            {bookIsbn13 && <span className="text-xs text-gray-500"> • {bookIsbn13}</span>}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-sm font-medium mb-2 block">Note</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">Votre avis</label>
            <Textarea
              placeholder="Partagez votre avis sur ce livre..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 caractères
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Envoi..." : "Publier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
