import { Search, Bell, BookOpen, User, Plus, Heart, Home, Library, LogOut } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u.displayName || u.email || null);
      } else {
        setUserName(null);
      }
    } catch (e) {
      setUserName(null);
    }
  }, [location.pathname]);

  // Listen to storage events so navbar updates when other tabs change auth state
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'user') {
        try {
          const raw = localStorage.getItem('user');
          if (raw) {
            const u = JSON.parse(raw);
            setUserName(u.displayName || u.email || null);
          } else {
            setUserName(null);
          }
        } catch (_) {
          setUserName(null);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (e) {
      // ignore firebase errors
    }
    localStorage.removeItem("user");
    navigate("/");
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-soft">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
            Little Book
          </span>
        </Link>

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

          <Link to="/recommendations">
            <Button 
              variant={isActive("/recommendations") ? "default" : "ghost"} 
              size="sm" 
              className="rounded-full"
            >
              <Library className="h-4 w-4 mr-2" />
              Reco
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

          {/* User Profile / Logout */}
          {userName ? (
            <div className="flex items-center space-x-2 ml-2">
              <Link to="/profile" className="text-sm font-medium hover:underline">
                {userName}
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/profile">
              <Button 
                variant={isActive("/profile") ? "default" : "ghost"} 
                size="icon" 
                className="rounded-full ml-2"
              >
                <User className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};