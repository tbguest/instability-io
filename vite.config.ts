/// <reference types="vitest" />

import { resolve } from "path";
import { defineConfig } from "vite";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

export default defineConfig({
  root,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        ripples: resolve(root, "ripples", "index.html"),
        lorenz: resolve(root, "lorenz", "index.html"),
        dunes: resolve(root, "dunes", "index.html"),
      },
    },
  },
  publicDir,
  test: {
    root: __dirname,
  },
});
