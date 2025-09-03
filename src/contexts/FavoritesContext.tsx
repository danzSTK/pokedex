"use client";

import { PokemonType } from "@/models/constants";
import React, {
  createContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

export interface FavoritePokemon {
  id: number;
  name: string;
  image: string;
  types: PokemonType[];
}

interface FavoritesContextType {
  favorites: FavoritePokemon[];
  toggleFavorite: (pokemon: FavoritePokemon) => void;
  isFavorite: (pokemonId: number) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

interface FavoritesProviderProps {
  children: ReactNode;
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

export function FavoritesProvider({
  children,
}: Readonly<FavoritesProviderProps>) {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>(
    getFavoritesFromStorage()
  );

  const toggleFavorite = useCallback(
    (pokemon: FavoritePokemon) => {
      const exists = favorites.find((fav) => fav.id === pokemon.id);

      const updatedFavorites: FavoritePokemon[] = [];

      if (exists) {
        updatedFavorites.push(
          ...favorites.filter((fav) => fav.id !== pokemon.id)
        );
      } else {
        updatedFavorites.push(...favorites, pokemon);
      }

      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error("Erro ao salvar favoritos no localStorage:", error);
      }

      setFavorites(updatedFavorites);
    },
    [favorites]
  );

  const isFavorite = (id: number): boolean => {
    return favorites.some((fav) => fav.id === id);
  };

  const value: FavoritesContextType = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
    }),
    [favorites, toggleFavorite, isFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
