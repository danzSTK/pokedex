
import { useState, useEffect, useCallback } from "react";

export interface FavoritePokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

const FAVORITES_KEY = "pokemon_favorites";

const getFavoritesFromStorage = (): FavoritePokemon[] => {
  try {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error("Erro ao ler favoritos do localStorage:", error);
    return [];
  }
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);

  useEffect(() => {
    setFavorites(getFavoritesFromStorage());
  }, []);

  const toggleFavorite = useCallback((pokemon: FavoritePokemon) => {
    const currentFavorites = getFavoritesFromStorage();
    const exists = currentFavorites.some((fav) => fav.id === pokemon.id);

    let updatedFavorites: FavoritePokemon[];

    if (exists) {
      updatedFavorites = currentFavorites.filter(
        (fav) => fav.id !== pokemon.id
      );
    } else {
      updatedFavorites = [...currentFavorites, pokemon];
    }

 
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Erro ao salvar favoritos no localStorage:", error);
    }

    setFavorites(updatedFavorites);
  }, []);

  const isFavorite = (id: number): boolean => {
    return favorites.some((fav) => fav.id === id);
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}
