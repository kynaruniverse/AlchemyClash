import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),          // React Fast Refresh
    tailwindcss(),    // Tailwind CSS v4
  ],

  resolve: {
    alias: {
      // Map @ to client/src for clean imports
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },

  // Serve from client directory during development
  root: path.resolve(__dirname, "client"),

  build: {
    // Output compiled files to dist
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },

  server: {
    port: 3000,
    host: true,           // Expose to network
    // Optional: proxy API requests during development
    // proxy: {
    //   "/api": "http://localhost:8080",
    // },
  },
});