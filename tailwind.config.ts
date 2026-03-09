import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Dark Slate / Dark Gray for structure & neutrality
                slate: {
                    850: "#151e2e",
                    900: "#0f172a",
                    950: "#020617",
                },
                // Coral Orange / Tangerine for CTAs and interactive elements
                coral: {
                    400: "#ff7f50",
                    500: "#ff6347", // main focus
                    600: "#ff4d29",
                }
            },
        },
    },
    plugins: [],
} satisfies Config;
