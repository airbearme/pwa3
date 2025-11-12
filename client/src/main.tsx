import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("main.tsx loaded!");

// Register service worker for PWA functionality in production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = '/sw.js';
    
    // Check if we're on localhost or a known domain
    const isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

    if (isLocalhost) {
      // Check if a service worker still exists
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister();
        console.log('Unregistered service worker for development');
      });
    } else {
      // Register service worker in production
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed: ', error);
        });
    }
  });
}

const container = document.getElementById("root");
console.log("Root container:", container);
if (!container) {
  console.error("Root element not found!");
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(<App />);