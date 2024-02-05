import { fileURLToPath, URL } from "node:url";
import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    // root: path.resolve(__dirname, "./src"),
    build: {
        outDir: path.resolve(__dirname, "./bundle"),
        rollupOptions: {
            input: { 1: path.resolve(__dirname, "./index.html") },
            output: {
                entryFileNames: `[name].[hash].js`,
                chunkFileNames: `[name].[hash].js`,
                assetFileNames: `[name].[hash].[ext]`,
                manualChunks: id =>
                    id.includes("node_modules") && id.toString().split("node_modules/")[1].split("/")[0].toString(),
            },
        },
    },
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
    server: {
        host: "0.0.0.0",
        proxy: {
            "/api": {
                target: "http://127.0.0.1:3000",
                changeOrigin: true,
            },
        },
    },
});
