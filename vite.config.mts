import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    root: "./",
    publicDir: false,
    build: {
        outDir: "./dist/client",
        emptyOutDir: true,
        minify: process.env.NODE_ENV !== "development",
        sourcemap: process.env.NODE_ENV === "development",
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
