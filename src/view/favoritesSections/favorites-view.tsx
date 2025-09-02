"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { PokemonCardDefault } from "@/components/cards/pokemonCard";
import CardTitle from "@/components/titles/cardtitle";
import Link from "next/link";
import { Heart } from "lucide-react";

export const FavoritesView = () => {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <Heart className="h-16 w-16 text-gray-300 mb-4" />
        <CardTitle className="text-2xl mb-2 text-muted-foreground">
          Nenhum favorito ainda
        </CardTitle>
        <p className="text-muted-foreground mb-6 max-w-md">
          Explore a Pokédex e clique no coração dos seus Pokémon favoritos para
          salvá-los aqui!
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Explorar Pokédex
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="text-center mb-8">
        <CardTitle className="text-3xl mb-2 font-bold flex items-center justify-center gap-2">
          <Heart /> <span>Meus Favoritos</span>
        </CardTitle>
        <p className="text-muted-foreground">
          {favorites.length} Pokémon{favorites.length !== 1 ? "s" : ""} favorito
          {favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {favorites.map((pokemon) => (
          <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`}>
            <PokemonCardDefault pokemon={pokemon} />
          </Link>
        ))}
      </section>
    </section>
  );
};
