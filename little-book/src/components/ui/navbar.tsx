import { Search, Bell, BookOpen, User, Plus, Heart, Home } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-soft">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
            BookFlow
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un livre, un auteur..." 
              className="pl-10 bg-muted/50 border-border/50 rounded-full"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <Button 
              variant={isActive("/") ? "default" : "ghost"} 
              size="sm" 
              className="rounded-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Accueil
            </Button>
          </Link>
          
          <Link to="/collection">
            <Button 
              variant={isActive("/collection") ? "default" : "ghost"} 
              size="sm" 
              className="rounded-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Collection
            </Button>
          </Link>

          <Link to="/admin">
            <Button 
              variant={isActive("/admin") ? "default" : "ghost"} 
              size="sm" 
              className="rounded-full"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </Link>

          <Button variant="ghost" size="sm" className="rounded-full">
            <Heart className="h-4 w-4 mr-2" />
            Favoris
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          {/* User Profile */}
          <Link to="/profile">
            <Button 
              variant={isActive("/profile") ? "default" : "ghost"} 
              size="icon" 
              className="rounded-full ml-2"
            >
              <User className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};