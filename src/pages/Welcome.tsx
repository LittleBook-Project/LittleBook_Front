import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

// Interface pour l'utilisateur
interface UserData {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export default function Welcome() {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser) as UserData);
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="max-w-md w-full shadow-md border-border/50 text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            👋 Bienvenue, {user.displayName} !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Photo de profil"
              className="w-20 h-20 rounded-full mx-auto shadow"
            />
          )}
          <p className="text-muted-foreground">Email : {user.email}</p>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full rounded-lg"
          >
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
