"use client";

import { useEffect } from "react";

/** Registers the service worker in production so the app can run offline. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      typeof navigator === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const register = () =>
      navigator.serviceWorker.register(`${basePath}/sw.js`).catch(() => {
        // Offline support is a nice-to-have; ignore registration failures.
      });
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
