import { useState, useEffect } from "react";

export interface FavoritePokemon {
  id: string | number;
  name: string;
  types: string[];
  imageUrl?: string;
}

const FAVORITES_KEY = "pokemon_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar favoritos do localStorage na inicialização
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(FAVORITES_KEY);
    console.log("Carregando favoritos do localStorage:", stored);

    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // persistir favoritos no localStorage
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Erro ao salvar favoritos:", error);
    }
  }, [favorites, isLoaded]);

  const addFavorites = (pokemon: FavoritePokemon) => {
    setFavorites((prev) =>
      prev.some((fav) => String(fav.id) === String(pokemon.id))
        ? prev
        : [...prev, pokemon]
    );
  };

  const removeFavorites = (pokemon: FavoritePokemon) => {
    setFavorites((prev) =>
      prev.filter((fav) => String(fav.id) !== String(pokemon.id))
    );
  };

  const toggleFavorite = (pokemon: FavoritePokemon) => {
    setFavorites((prev) =>
      prev.some((fav) => String(fav.id) === String(pokemon.id))
        ? prev.filter((prev) => String(prev.id) !== String(pokemon.id))
        : [...prev, pokemon]
    );
  };

  const isFavorite = (pokemonId: string | number): boolean => {
    return favorites.some((fav) => String(fav.id) === String(pokemonId));
  };

  return {
    toggleFavorite,
    isFavorite,
    isLoaded,
    favorites,
    addFavorites,
    removeFavorites,
  };
}
