import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, "/api")
      }
    }
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },

  // FIX for framer-motion / react named export resolution during build
  optimizeDeps: {
    include: ["framer-motion", "react", "react-dom"]
  },

  // Prevent Vite SSR build from externalizing framer-motion
  ssr: {
    noExternal: ["framer-motion"]
  },

  build: {
    // optionally increase rollup warning limit or tweak commonjs options if needed
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
}));
