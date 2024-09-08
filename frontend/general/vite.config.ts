// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "./", // The current directory (general) is the root
  plugins: [react()],
  build: {
    outDir: "./dist", // Build output
    emptyOutDir: true, // Cleans the dist folder before building
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias to src folder
    },
  },
});
