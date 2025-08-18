import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Load environment variables before exporting the config
process.env = { ...process.env, ...loadEnv("", process.cwd(), "") };

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: process.env.VITE_APP_API_URL + "/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
