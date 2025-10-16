import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { BookOpen } from "lucide-react";

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBc6nTZhelJmNd3b7jEToAy9AIKdniEGQA",
  authDomain: "littlebook-b2d2d.firebaseapp.com",
  projectId: "littlebook-b2d2d",
  storageBucket: "littlebook-b2d2d.firebasestorage.app",
  messagingSenderId: "660565526137",
  appId: "1:660565526137:web:23d1fe03a27b7ad0baf6a8",
  measurementId: "G-C1Q00G057V",
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Auth() {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    const provider = new GoogleAuthProvider();

    try {
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;

      try {
        const idToken = await user.getIdToken();
        const resp = await fetch("http://localhost:8080/api/auth/me", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        // On parse la réponse JSON du backend
        const backendData = await resp.json();
        console.log("Réponse backend :", backendData);
        localStorage.setItem(
          "user",
          JSON.stringify({
            // On fait correspondre les champs de votre API
            displayName: backendData.name,     // name -> displayName
            email: backendData.email,
            photoURL: backendData.picture,     // picture -> photoURL
            uid: backendData.uid,              // On peut aussi stocker les infos supplémentaires
            roles: backendData.roles,
          })
        );

        // 4. Redirection vers la page de bienvenue
        navigate("/welcome");
      } catch (backendError) {
        console.warn("⚠️ Backend non joignable :", backendError);
      }

      // Redirection vers la page de bienvenue
      navigate("/welcome");
    } catch (error: any) {
      console.error("❌ Erreur Google Login :", error);
      alert("Erreur de connexion Google : " + error.message);
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <BookOpen className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Little Book
            </span>
          </Link>
        </div>

        {/* Carte principale */}
        <Card className="shadow-book border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bienvenue</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à votre espace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 rounded-lg"
              onClick={handleGoogleLogin}
              disabled={loadingGoogle}
            >
              {loadingGoogle ? (
                "Connexion en cours..."
              ) : (
                <>
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google logo"
                    className="w-5 h-5"
                  />
                  <span>Continuer avec Google</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info démo */}
        <Card className="shadow-soft border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-amber-800">
              <strong>Mode démo :</strong> Cette application utilise Firebase
              pour l'authentification Google.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
