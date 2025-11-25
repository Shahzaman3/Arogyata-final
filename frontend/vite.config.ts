import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Vite config — dev proxy added so frontend `/api/*` calls hit backend on :4000
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      // proxies any request starting with /api to your backend in dev
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        // keep the /api prefix — backend should expose routes under /api/*
        rewrite: (path) => path.replace(/^\/api/, "/api")
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
}));
