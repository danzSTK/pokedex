import { FavoritesContext } from "@/contexts/FavoritesContext";
import { useContext } from "react";

export function useFavorites() {
  const { favorites, isFavorite, toggleFavorite } =
    useContext(FavoritesContext);
  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}
