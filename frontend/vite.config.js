import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev proxy — frontend ka /api request seedha backend (port 3000) ko jaata hai
// Isse CORS ka jhanjhat bhi khatam ho jaata hai
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
});
