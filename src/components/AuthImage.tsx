import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface AuthImageProps {
  url: string | null;
  alt: string;
  className?: string;
}

export function AuthImage({ url, alt, className }: AuthImageProps) {
  const [src, setSrc] = useState<"loading" | "error" | string>("loading");

  useEffect(() => {
    if (!url) {
      setSrc("error");
      return;
    }

    setSrc("loading");

    const fullUrl = `${BASE_URL}${url}`;
    const token = getAccessToken();
    let objectUrl: string | undefined;

    fetch(fullUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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
  }, [url]);

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
