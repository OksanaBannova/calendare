import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/wall-calendar/", // имя репозитория
  plugins: [react()]
});