import { Heart, MessageCircle, Star, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  rating: number;
  category: string;
  review?: string;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  userAvatar?: string;
  userName?: string;
  className?: string;
}

export const BookCard = ({ 
  title, 
  author, 
  coverImage, 
  rating, 
  category, 
  review,
  likes = 0,
  comments = 0,
  isLiked = false,
  userAvatar,
  userName,
  className = "" 
}: BookCardProps) => {
  return (
    <Card className={`book-card bg-card border-border/50 overflow-hidden ${className}`}>
      <div className="relative">
        <img 
          src={coverImage} 
          alt={`Couverture de ${title}`}
          className="w-full h-48 object-cover"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
        >
          {category}
        </Badge>
      </div>
      
      <CardContent className="p-4 space-y-3">
        {/* User info (for feed) */}
        {userName && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full rounded-full" />
              ) : (
                <User className="h-3 w-3" />
              )}
            </div>
            <span>{userName} a ajouté</span>
          </div>
        )}

        {/* Book Info */}
        <div>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{author}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${
                i < rating 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-gray-300"
              }`} 
            />
          ))}
          <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>
        </div>

        {/* Review Preview */}
        {review && (
          <p className="text-sm text-muted-foreground line-clamp-3 italic">
            "{review}"
          </p>
        )}

        {/* Interaction Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-full p-2 h-auto ${
                isLiked ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-xs">{likes}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full p-2 h-auto text-muted-foreground"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{comments}</span>
            </Button>
          </div>
          
          <Button size="sm" variant="outline" className="rounded-full text-xs">
            Voir détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};