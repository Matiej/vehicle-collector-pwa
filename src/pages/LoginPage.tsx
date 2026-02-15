import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { initialized, authenticated, login } = useAuth();

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-400">Ładowanie...</div>
      </div>
    );
  }

  if (initialized && authenticated) {
    return <Navigate to="/sessions" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <img
            src="/favicon.svg"
            alt="Vehicle Collector"
            className="h-16 w-16"
          />
        </div>

        <h1 className="mb-3 text-center text-2xl font-semibold text-white">
          Vehicle Collector
        </h1>

        <p className="mb-6 text-center text-sm text-zinc-400">
          Aplikacja do kolekcjonowania i katalogowania zdjęć samochodów oraz motocykli.
          Twórz sesje, dodawaj zdjęcia i buduj swoją kolekcję pojazdów.
        </p>

        <Button
          onClick={login}
          className="w-full"
          size="lg"
        >
          Zaloguj się
        </Button>
      </div>
    </div>
  );
}
