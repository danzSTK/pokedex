import type { Metadata, Viewport } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { FilterProvider } from "@/contexts/FilterContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pokedex - Explore o Mundo Pokémon",
    template: "%s | Pokedex",
  },
  description:
    "Uma Pokédex moderna e interativa para explorar o mundo Pokémon. Descubra informações detalhadas sobre Pokémon, suas habilidades, estatísticas e muito mais.",
  keywords: [
    "pokémon",
    "pokedex",
    "pokemon",
    "nintendo",
    "game freak",
    "anime",
    "manga",
    "jogos",
  ],
  authors: [{ name: "Daniel Félix" }],
  creator: "Daniel Félix",
  publisher: "Pokedex",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "Pokedex - Explore o Mundo Pokémon",
    description:
      "Uma Pokédex moderna e interativa para explorar o mundo Pokémon.",
    siteName: "Pokedex",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pokedex - Explore o Mundo Pokémon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokedex - Explore o Mundo Pokémon",
    description:
      "Uma Pokédex moderna e interativa para explorar o mundo Pokémon.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  category: "entertainment",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000000"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body
        className={`font-sans ${poppins.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="pokedex-theme"
        >
          <FavoritesProvider>
            <CompareProvider>
              <FilterProvider>
                {children}
                <Toaster />
              </FilterProvider>
            </CompareProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
