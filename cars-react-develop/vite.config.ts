import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "https://cars.asicompany.com/",
                changeOrigin: true,
                secure: false,
            },
        },
        allowedHosts: ["https://cars.asicompany.com/"],
    },
});
