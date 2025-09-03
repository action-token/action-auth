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
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        server: resolve(__dirname, "src/server.ts"),
      },
      name: "AuthClientSDK",
      fileName: (format, entryName) => {
        if (format === "cjs") {
          return `${entryName}.${format}`;
        }
        return `${entryName}.${format}.js`;
      },
      formats: ["es", "cjs"],
    },
    minify: false, // Easier to debug externalization
    rollupOptions: {
      external: (id) => {
        // Externalize all React-related imports
        if (id.includes("react")) return true;

        // Externalize all Lit-related imports (since you don't need them)
        if (
          id.includes("lit") ||
          id.includes("@lit/") ||
          id.includes("lit-element") ||
          id.includes("lit-html")
        )
          return true;

        // Externalize server dependencies
        if (id.startsWith("better-auth")) return true;
        if (id.startsWith("stellar-sdk")) return true;
        if (id === "zod" || id.startsWith("zod/")) return true;
        if (id.startsWith("node:")) return true;

        // Externalize all peer dependencies
        const peerDeps = [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react-dom/client",
          "lucide-react",
          "better-auth/react",
          "@creit.tech/stellar-wallets-kit",
        ];

        return peerDeps.some((dep) => id === dep || id.startsWith(dep + "/"));
      },
      onwarn(warning, warn) {
        // Suppress Lit-related warnings since we're externalizing them
        if (
          warning.code === "AMBIGUOUS_EXTERNAL_NAMESPACE" ||
          warning.code === "UNUSED_EXTERNAL_IMPORT" ||
          (warning.message && warning.message.includes("lit")) ||
          (warning.message && warning.message.includes("@lit/reactive-element"))
        ) {
          return;
        }
        warn(warning);
      },
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "React",
          "better-auth/react": "BetterAuthReact",
          "lucide-react": "LucideReact",
        },
        assetFileNames: (assetInfo) => {
          // Rename CSS file to auth-styles.css
          if (assetInfo.name?.endsWith(".css")) {
            return "auth-styles.css";
          }
          return assetInfo.name || "[name].[ext]";
        },
      },
    },
    sourcemap: true,
  },
});
