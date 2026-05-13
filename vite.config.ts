import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/auth": "http://localhost:8000",
      "/food": "http://localhost:8000",
      "/requests": "http://localhost:8000",
      "/notifications": "http://localhost:8000",
      "/uploads": "http://localhost:8000",
      "/health": "http://localhost:8000",
    },
  },
});
