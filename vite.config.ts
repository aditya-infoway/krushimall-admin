import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Capacitor (mobile) build me relative path, web deploy me /krushimall-admin/
  base: mode === "capacitor" ? "./" : "/krushimall-admin/",
  plugins: [react(), svgr(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
}));