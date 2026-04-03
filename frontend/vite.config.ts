import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(() => {
  const isTestRun = Boolean(process.env.VITEST);

  return {
    plugins: [react(), ...(isTestRun ? [] : [tailwindcss()])],
    server: {
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: process.env.VITE_BACKEND_URL ?? "http://localhost:5211",
          changeOrigin: true,
        },
        "/images": {
          target: process.env.VITE_BACKEND_URL ?? "http://localhost:5211",
          changeOrigin: true,
        },
        "/gameHub": {
          target: process.env.VITE_BACKEND_URL ?? "http://localhost:5211",
          ws: true,
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
      clearMocks: true,
      restoreMocks: true,
    },
  };
});
