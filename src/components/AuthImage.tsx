import { useState, useEffect } from "react";
import { useAuth } from "@/auth/AuthProvider";

interface AuthImageProps {
  url: string | null;
  alt: string;
  className?: string;
}

export function AuthImage({ url, alt, className }: AuthImageProps) {
  const { token } = useAuth();
  const [src, setSrc] = useState<"loading" | "error" | string>("loading");

  useEffect(() => {
    if (!url) {
      setSrc("error");
      return;
    }

    // token nie jest jeszcze gotowy — poczekaj na kolejny render gdy AuthProvider go ustawi
    if (!token) return;

    setSrc("loading");

    let objectUrl: string | undefined;

    // url jest ścieżką względną od originu (np. "/api/public/assets/.../thumbnail?size=THUMB_320")
    // fetch() bez prefiksu BASE_URL — przeglądarka sam doda origin
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => setSrc("error"));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url, token]);

  if (src === "loading") {
    return (
      <div className={`animate-pulse bg-muted rounded-xl ${className ?? ""}`} />
    );
  }

  if (src === "error") {
    return (
      <div
        className={`bg-muted rounded-xl grid place-items-center text-xs text-muted-foreground ${className ?? ""}`}
      >
        ⏳
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setSrc("error")}
    />
  );
}
