"use client";

import Header from "@/components/header";
import { ThemeToggle } from "@/components/theme-toggle";
import { FavoritesView } from "@/components/favorites/favorites-view";
import MobileNavigationbar from "@/components/mobile-navigation";

const FavoritesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header className="py-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Pokédex</h1>
          <ThemeToggle />
        </div>
      </Header>

      <main className="container mx-auto px-4 py-8 pb-20">
        <FavoritesView />
      </main>

      <MobileNavigationbar />
    </div>
  );
};

export default FavoritesPage;
