import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  base: "/homestead-pantry/",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        pantry: resolve(__dirname, "src/pantry/index.html"),
        recipes: resolve(__dirname, "src/recipes/index.html"),
        favorites: resolve(__dirname, "src/favorites/index.html"),
      },
    },
  },
});
