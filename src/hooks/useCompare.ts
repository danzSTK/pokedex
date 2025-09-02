import React from "react";

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

const getCompareFromStorage = (): ComparePokemon[] => {
  try {
    const storedFavorites = localStorage.getItem("pokemon_compare");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error("Erro ao ler comparações do localStorage:", error);
    return [];
  }
};

export function useCompare() {
  const [comparePokemons, setComparePokemons] = React.useState<
    ComparePokemon[]
  >([]);

  React.useEffect(() => {
    setComparePokemons(getCompareFromStorage());
  }, []);

  const addToCompare = React.useCallback((pokemon: ComparePokemon) => {
    const currentCompare = getCompareFromStorage();
    const exist = currentCompare.some((p) => p.id === pokemon.id);

    let updatedCompare: ComparePokemon[];

    if (!exist) {
      updatedCompare = [...currentCompare, pokemon];

      try {
        localStorage.setItem("pokemon_compare", JSON.stringify(updatedCompare));
        setComparePokemons(updatedCompare);
      } catch (error) {
        console.error("Erro ao salvar comparações no localStorage:", error);
      }
    }
  }, []);

  const removeCompare = React.useCallback((id: number) => {
    const currentCompare = getCompareFromStorage();
    const updatedCompare = currentCompare.filter((p) => p.id !== id);

    try {
      localStorage.setItem("pokemon_compare", JSON.stringify(updatedCompare));
      setComparePokemons(updatedCompare);
    } catch (error) {
      console.error("Erro ao salvar comparações no localStorage:", error);
    }
  }, []);

  const isCompared = React.useCallback(
    (pokemon: ComparePokemon) => {
      return comparePokemons.some((p) => p.id === pokemon.id);
    },
    [comparePokemons]
  );

  const toggleCompare = React.useCallback(
    (pokemon: ComparePokemon) => {
      if (isCompared(pokemon)) {
        removeCompare(pokemon.id);
      } else {
        addToCompare(pokemon);
      }
    },
    [addToCompare, removeCompare, isCompared]
  );

  const clearCompare = React.useCallback(() => {
    localStorage.removeItem("pokemon_compare");
    setComparePokemons([]);
  }, []);

  return {
    toggleCompare,
    comparePokemons,
    clearCompare,
    addToCompare,
    isCompared,
    removeCompare,
  };
}
