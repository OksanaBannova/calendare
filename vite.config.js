import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/calendare/", // имя репозитория
  plugins: [react()]
});