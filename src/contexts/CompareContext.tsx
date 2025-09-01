"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

export interface ComparePokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  stats: Array<{
    name: string;
    baseStat: number;
  }>;
}

interface CompareContextType {
  comparePokemons: ComparePokemon[];
  addToCompare: (pokemon: ComparePokemon) => void;
  removeFromCompare: (pokemonId: number) => void;
  clearCompare: () => void;
  isInCompare: (pokemonId: number) => boolean;
  canAddMore: boolean;
  hasMinimumToCompare: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_POKEMONS = 3;
const MIN_COMPARE_POKEMONS = 2;

export function CompareProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [comparePokemons, setComparePokemons] = useState<ComparePokemon[]>([]);

  const addToCompare = useCallback((pokemon: ComparePokemon) => {
    setComparePokemons((prev) => {
      // Verifica se já está na lista ou se atingiu o limite
      if (
        prev.find((p) => p.id === pokemon.id) ||
        prev.length >= MAX_COMPARE_POKEMONS
      ) {
        return prev;
      }
      return [...prev, pokemon];
    });
  }, []);

  const removeFromCompare = useCallback((pokemonId: number) => {
    setComparePokemons((prev) => prev.filter((p) => p.id !== pokemonId));
  }, []);

  const clearCompare = useCallback(() => {
    setComparePokemons([]);
  }, []);

  const isInCompare = useCallback(
    (pokemonId: number) => {
      return comparePokemons.some((p) => p.id === pokemonId);
    },
    [comparePokemons]
  );

  const canAddMore = useMemo(() => {
    return comparePokemons.length < MAX_COMPARE_POKEMONS;
  }, [comparePokemons.length]);

  const hasMinimumToCompare = useMemo(() => {
    return comparePokemons.length >= MIN_COMPARE_POKEMONS;
  }, [comparePokemons.length]);

  const value = useMemo(
    () => ({
      comparePokemons,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      canAddMore,
      hasMinimumToCompare,
    }),
    [
      comparePokemons,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      canAddMore,
      hasMinimumToCompare,
    ]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
