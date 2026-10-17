"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Bio-Triad Service Worker registrado com sucesso:", reg.scope);
        })
        .catch((err) => {
          console.warn("Falha no registro do Service Worker:", err);
        });
    }
  }, []);

  return null;
}
