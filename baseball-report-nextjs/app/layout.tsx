import type { Metadata } from "next";
import "./globals.css";
import { RootProviders } from "@/context";

export const metadata: Metadata = {
  title: "Baseball Report - Scouting Dashboard",
  description: "Professional baseball scouting and record tracking system",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script id="tailwind-config">
          {`
            tailwind.config = {
              darkMode: "class",
              theme: {
                extend: {
                  colors: {
                    "inverse-on-surface": "#e6f3fb",
                    "surface-container-high": "#ddeaf2",
                    "primary": "#005e93",
                    "outline": "#707881",
                    "on-surface-variant": "#404750",
                    "tertiary": "#7f34af",
                    "surface-dim": "#cfdce4",
                    "on-surface": "#111d23",
                    "on-tertiary-fixed": "#2f004b",
                    "on-tertiary": "#ffffff",
                    "on-primary": "#ffffff",
                    "on-tertiary-fixed-variant": "#6a1b9a",
                    "error": "#ba1a1a",
                    "background": "#f4faff",
                    "surface-container-low": "#e9f6fd",
                    "inverse-surface": "#263238",
                    "on-secondary": "#ffffff",
                    "on-primary-fixed": "#001d33",
                    "surface": "#f4faff",
                    "tertiary-fixed": "#f4d9ff",
                    "on-error": "#ffffff",
                    "surface-container-highest": "#d7e4ec",
                    "primary-fixed": "#cee5ff",
                    "on-error-container": "#93000a",
                    "primary-fixed-dim": "#97cbff",
                    "on-secondary-fixed": "#311300",
                    "secondary-fixed": "#ffdbc8",
                    "on-background": "#111d23",
                    "inverse-primary": "#97cbff",
                    "surface-bright": "#f4faff",
                    "secondary": "#984800",
                    "surface-container": "#e3f0f8",
                    "error-container": "#ffdad6",
                    "outline-variant": "#c0c7d1",
                    "tertiary-container": "#9a4fca",
                    "surface-container-lowest": "#ffffff",
                    "primary-container": "#1f77b4",
                    "surface-tint": "#00639b",
                    "surface-variant": "#d7e4ec",
                    "on-secondary-fixed-variant": "#743500",
                    "tertiary-fixed-dim": "#e4b5ff",
                    "on-tertiary-container": "#fff5fe",
                    "on-secondary-container": "#5c2900",
                    "on-primary-container": "#f5f8ff",
                    "on-primary-fixed-variant": "#004a76",
                    "secondary-container": "#fc7d09",
                    "secondary-fixed-dim": "#ffb689"
                  },
                  fontFamily: {
                    headline: ["Inter"],
                    body: ["Inter"],
                    label: ["Inter"]
                  },
                  borderRadius: {
                    DEFAULT: "0.125rem",
                    lg: "0.25rem",
                    xl: "0.5rem",
                    full: "0.75rem"
                  },
                },
              },
            }
          `}
        </script>
        <style>
          {`
            .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
            body { 
              font-family: 'Inter', sans-serif; 
              background-color: #f4faff; 
              color: #111d23; 
            }
            .no-line-card { 
              border: none; 
            }
            .ghost-shadow { 
              box-shadow: 0 12px 32px -4px rgba(17, 29, 35, 0.06); 
            }
          `}
        </style>
      </head>
      <body className="bg-background min-h-screen">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
