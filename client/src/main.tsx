import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SupabaseProvider } from "./hooks/use-supabase";
import { AirbearSessionProvider } from "./hooks/use-airbear-session";

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('AirBear PWA Service Worker registered successfully:', registration);
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('AirBear PWA: New service worker available');
              // Optionally show update notification
            }
          });
        }
      });
      
    } catch (error) {
      console.error('AirBear PWA Service Worker registration failed:', error);
    }
  });
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <SupabaseProvider>
        <AirbearSessionProvider>
          <App />
        </AirbearSessionProvider>
      </SupabaseProvider>
    </React.StrictMode>
  );
}
