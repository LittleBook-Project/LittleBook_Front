import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { BookOpen } from "lucide-react";

// Firebase imports
import { FirebaseError, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";

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
  const [loadingMicrosoft, setLoadingMicrosoft] = useState(false);
  const navigate = useNavigate();

    const callBackendAndStoreUser = async (idToken: string) => {
    try {
      const resp = await fetch("http://localhost:8080/api/auth/me", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const backendData = await resp.json();
      console.log("Réponse backend :", backendData);

      localStorage.setItem(
        "user",
        JSON.stringify({
          displayName: backendData.name,
          email: backendData.email,
          photoURL: backendData.picture,
          uid: backendData.uid,
          roles: backendData.roles,
        }),
      );
    } catch (backendError) {
      console.warn("⚠️ Backend non joignable ou erreur /api/auth/me :", backendError);
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    const provider = new GoogleAuthProvider();
    // setCustomParameters is optional; place inside the function so module import
    // does not execute provider side-effects (makes component test-friendly)
    if (typeof provider.setCustomParameters === 'function') {
      provider.setCustomParameters({ prompt: 'select_account' });
    }

    try {
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;
      const idToken = await user.getIdToken();

      await callBackendAndStoreUser(idToken);

      try {
        const idToken = await user.getIdToken();
        const resp = await fetch("http://localhost:8080/api/auth/me", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        // On parse la réponse JSON du backend
        const backendData = await resp.json();
        console.log("Réponse backend :", backendData);
        localStorage.setItem("user",
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
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("❌ Erreur Firebase Google Login :", error);
        alert("Erreur Firebase : " + error.message);
        return;
      }
      console.error("❌ Erreur inconnue Google Login :", error);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setLoadingMicrosoft(true);
    const provider = new OAuthProvider('microsoft.com');

    try {
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;
      const idToken = await user.getIdToken();

      try {
        const resp = await fetch("http://localhost:8080/api/auth/me", {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!resp.ok) {
          console.warn("⚠️ Réponse non OK du backend :", resp.status);
          throw new Error(`Backend non joignable : ${resp.status}`);
        }

        const backendData = await resp.json();
        console.log("Réponse backend :", backendData);

        localStorage.setItem("user",
          JSON.stringify({
            displayName: backendData.name,
            email: backendData.email,
            photoURL: backendData.picture,
            uid: backendData.uid,
            roles: backendData.roles,
          })
        );
    } catch (error : unknown) {
        console.warn("⚠️ Backend non joignable ou erreur /api/auth/me :", error);
      }
      navigate("/welcome");
    }catch(error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("❌ Erreur Firebase Microsoft Login :", error);
        alert("Erreur Firebase : " + error.message);
        
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            console.warn("L'utilisateur a fermé la fenêtre popup avant de terminer la connexion.");
            break;
          case 'auth/cancelled-popup-request':
            console.warn("Une autre demande de popup est déjà en cours.");
            break;
          default:
            console.error("Erreur Firebase inconnue :", error);
        }
      } else if(error instanceof Error){
        console.error("❌ Erreur inconnue Microsoft Login :", error);
      } else {
        if (error instanceof FirebaseError) {
          console.error("❌ Erreur Firebase Microsoft Login :", error);
          alert("Erreur Firebase : " + error.message);
          return;
      }
        console.warn("⚠️ Backend non joignable ou erreur /api/auth/me :", error);
      } 
    } finally {
      setLoadingMicrosoft(false);
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
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 rounded-lg"
              onClick={handleMicrosoftLogin}
              disabled={loadingMicrosoft}
            >
              {loadingMicrosoft ? (
                "Connexion en cours..."
              ) : (
                <>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                    alt="Microsoft logo"
                    className="w-5 h-5"
                  />
                  <span>Continuer avec Microsoft</span>
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