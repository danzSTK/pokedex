"use client";

// Components
import Header from "@/components/header";
import { ThemeToggle } from "@/components/theme-toggle";
import MobileNavigationbar from "@/components/mobile-navigation";
import { FavoritesView } from "@/view/favoritesSections/favorites-view";

const FavoritesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header className=" border-b">
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
