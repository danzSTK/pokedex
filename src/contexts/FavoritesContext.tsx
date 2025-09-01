"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

export interface FavoritePokemon {
  id: string | number;
  name: string;
  types: string[];
  imageUrl?: string;
}

interface FavoritesContextType {
  favorites: FavoritePokemon[];
  addToFavorites: (pokemon: FavoritePokemon) => void;
  removeFromFavorites: (pokemonId: string | number) => void;
  toggleFavorite: (pokemon: FavoritePokemon) => void;
  isFavorite: (pokemonId: string | number) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({
  children,
}: Readonly<FavoritesProviderProps>) {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);

  const addToFavorites = useCallback((pokemon: FavoritePokemon) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some(
        (fav) => String(fav.id) === String(pokemon.id)
      );

      if (isAlreadyFavorite) {
        return prev;
      }

      const newFavorites = [...prev, pokemon];

      return newFavorites;
    });
  }, []);

  const removeFromFavorites = useCallback((pokemonId: string | number) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter(
        (fav) => String(fav.id) !== String(pokemonId)
      );

      return newFavorites;
    });
  }, []);

  const toggleFavorite = useCallback((pokemon: FavoritePokemon) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some(
        (fav) => String(fav.id) === String(pokemon.id)
      );

      if (isAlreadyFavorite) {
        // Remover dos favoritos
        const newFavorites = prev.filter(
          (fav) => String(fav.id) !== String(pokemon.id)
        );

        return newFavorites;
      } else {
        // Adicionar aos favoritos
        const newFavorites = [...prev, pokemon];

        return newFavorites;
      }
    });
  }, []);

  const isFavorite = useCallback(
    (pokemonId: string | number): boolean => {
      return favorites.some((fav) => String(fav.id) === String(pokemonId));
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);
  const value: FavoritesContextType = useMemo(
    () => ({
      favorites,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      isFavorite,
      clearFavorites,
    }),
    [
      favorites,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      isFavorite,
      clearFavorites,
    ]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);

  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}
