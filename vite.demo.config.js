import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/vue3-drag-drop/",
  plugins: [vue()],
  build: {
    outDir: "dist-demo",
  },
});
