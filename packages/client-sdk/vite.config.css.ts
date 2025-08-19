import { defineConfig } from "vite";
import { globSync } from "glob";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false, // Don't clear the dist directory
    rollupOptions: {
      input: [
        "./src/index.css", // Global CSS variables and reset
        ...globSync("./src/**/*.module.css"), // Include all CSS modules
      ],
      output: {
        assetFileNames: "auth-styles.css", // Single combined CSS file
      },
    },
  },
});
