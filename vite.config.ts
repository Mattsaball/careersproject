import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Config for custom domain at root: https://paretojourneys.com
export default defineConfig({
  plugins: [react()],
  base: "/",   // IMPORTANT: root of a custom domain
});

