"use client";

import { PokemonType } from "@/models/constants";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

interface FilterContextType {
  selectedTypes: PokemonType[];
  toggleType: (type: PokemonType) => void;
  clearFilters: () => void;
  isFilterActive: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);

  const toggleType = useCallback((type: PokemonType) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTypes([]);
  }, []);

  const isFilterActive = selectedTypes.length > 0;

  const value = useMemo(
    () => ({
      selectedTypes,
      toggleType,
      clearFilters,
      isFilterActive,
    }),
    [selectedTypes, toggleType, clearFilters, isFilterActive]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
