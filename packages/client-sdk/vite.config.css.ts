import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: "dist",
    emptyOutDir: false, // Don't clear the dist directory
    rollupOptions: {
      input: "./src/styles/shadow-styles.css",
      output: {
        assetFileNames: "shadow-styles.css",
      },
    },
  },
});
