import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "^/movAlmacen/api/.*": {
        target: "http://localhost/movAlmacen/api",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/movAlmacen\/api/, ""),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1024,
  },
  base: "/movAlmacen/",
});
