import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { BookOpen } from "lucide-react";

// Firebase imports
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

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
  const AUTH_BASE = ((import.meta as any).env?.VITE_AUTH_BASE as string) || "";
  const USE_RELATIVE = ((import.meta as any).env?.VITE_USE_RELATIVE_API as string) === "true";

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    const provider = new GoogleAuthProvider();

    try {
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;

      try {
        const idToken = await user.getIdToken();
        console.debug(
          "Firebase idToken (prefix):",
          `${idToken?.slice?.(0, 20) ?? ""}... len=${idToken?.length ?? 0}`
        );

        const authUrl = USE_RELATIVE ? "/api/auth/me" : (AUTH_BASE ? `${AUTH_BASE}/api/auth/me` : "/api/auth/me");
        const resp = await fetch(authUrl, {
          headers: { Authorization: `Bearer ${idToken}` },
          credentials: "include",
        });

        console.debug("/api/auth/me status:", resp.status);
        const text = await resp.text();
        if (!resp.ok) {
          console.warn("Backend /api/auth/me returned", resp.status, text);
          if (resp.status === 401) {
            alert("Authentification refusée (401). Le backend a rejeté le token.");
          }
          let backendData: any = null;
          try {
            backendData = text ? JSON.parse(text) : null;
          } catch (parseErr) {
            console.warn("Impossible d'analyser la réponse backend en JSON:", parseErr);
          }
          if (backendData) {
            localStorage.setItem(
              "user",
              JSON.stringify({
                displayName: backendData.name,
                email: backendData.email,
                photoURL: backendData.picture,
                uid: backendData.uid,
                roles: backendData.roles,
              })
            );
            navigate("/welcome");
          }
        } else {
          let backendData: any = null;
          try {
            backendData = text ? JSON.parse(text) : null;
          } catch (parseErr) {
            console.warn("Failed to parse JSON from backend (OK response):", parseErr);
          }
          if (backendData) {
            console.log("Réponse backend :", backendData);
            localStorage.setItem(
              "user",
              JSON.stringify({
                displayName: backendData.name,
                email: backendData.email,
                photoURL: backendData.picture,
                uid: backendData.uid,
                roles: backendData.roles,
              })
            );
            navigate("/welcome");
          } else {
            console.warn("Backend returned empty or non-JSON body despite 200 OK");
          }
        }
      } catch (backendError) {
        console.warn("⚠️ Backend non joignable :", backendError);
      }

      // Redirection vers la page de bienvenue
      navigate("/welcome");
    } catch (error: any) {
      console.error("❌ Erreur Google Login :", error);
      // If the popup flow is blocked by Cross-Origin-Opener-Policy or similar
      // issues, fall back to the redirect flow which avoids relying on
      // window.closed/window.opener behavior.
      const msg = String(error?.message || "").toLowerCase();
      const code = String(error?.code || "").toLowerCase();
      if (
        msg.includes("cross-origin-opener-policy") ||
        msg.includes("window.closed") ||
        code.includes("operation-not-supported") ||
        code.includes("popup-blocked")
      ) {
        try {
          console.warn("Popup blocked by COOP — falling back to redirect sign-in.");
          await signInWithRedirect(auth, provider);
          return; // redirect will navigate away
        } catch (redirErr) {
          console.error("❌ Redirect sign-in failed:", redirErr);
          alert("Erreur de connexion Google (redirect) : " + String(redirErr?.message || redirErr));
        }
      } else {
        alert("Erreur de connexion Google : " + error.message);
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  // Handle the redirect result when using signInWithRedirect flow
  useEffect(() => {
    let mounted = true;

    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result || !result.user) return;

        const user = result.user;
        const idToken = await user.getIdToken();

        const authUrl = USE_RELATIVE ? "/api/auth/me" : (AUTH_BASE ? `${AUTH_BASE}/auth/me` : "/api/auth/me");
        const resp = await fetch(authUrl, {
          headers: { Authorization: `Bearer ${idToken}` },
          credentials: "include",
        });

        if (!mounted) return;

        if (resp.ok) {
          const text = await resp.text();
          let backendData: any = null;
          try {
            backendData = text ? JSON.parse(text) : null;
          } catch (err) {
            console.warn("Redirect: failed to parse backend JSON", err);
          }
          if (backendData) {
            localStorage.setItem(
              "user",
              JSON.stringify({
                displayName: backendData.name,
                email: backendData.email,
                photoURL: backendData.picture,
                uid: backendData.uid,
                roles: backendData.roles,
              })
            );
            window.location.href = "/welcome";
          }
        } else {
          console.warn("Redirect backend returned", resp.status, await resp.text());
        }
      } catch (err) {
        console.debug("No redirect result or redirect handling failed:", err);
      }
    };

    handleRedirect();

    return () => {
      mounted = false;
    };
  }, []);

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
