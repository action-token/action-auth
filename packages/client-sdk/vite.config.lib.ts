import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.lib.json",
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "AuthClientSDK",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
    minify: false, // Easier to debug externalization
    rollupOptions: {
      external: (id) => {
        // Externalize all React-related imports
        if (id.includes("react")) return true;

        // Externalize all peer dependencies
        const peerDeps = [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react-dom/client",
          "@radix-ui/react-slot",
          "lucide-react",
          "class-variance-authority",
          "clsx",
          "tailwind-merge",
          "better-auth/react",
        ];

        return peerDeps.some((dep) => id === dep || id.startsWith(dep + "/"));
      },
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "React",
          "better-auth/react": "BetterAuthReact",
          "@radix-ui/react-slot": "RadixSlot",
          "lucide-react": "LucideReact",
          "class-variance-authority": "CVA",
          clsx: "clsx",
          "tailwind-merge": "tailwindMerge",
        },
      },
    },
    sourcemap: true,
  },
});
