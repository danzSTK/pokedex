"use client";

// Outras bibliotecas
import { Heart, Sparkles, GitCompare } from "lucide-react";

// Components
import CardTitle from "@/components/titles/cardtitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Hooks e contexts
import { useCompare } from "@/hooks/useCompare";

// Utils
import { cn } from "@/lib/utils";

// Types e constantes
import { PokemonType, TYPE_COLORS } from "@/models/constants";
import { PokemonInfoData } from "@/models/types";
import { FavoritePokemon } from "@/hooks/useFavorites";

interface Props {
  pokemon: PokemonInfoData;
  primaryType: PokemonType;
  isFavorite: boolean;
  toggleFavorite: (pokemon: FavoritePokemon) => void;
  isShiny: boolean;
  onToggleShiny: () => void;
}

const ActionbarSection = ({
  pokemon,
  primaryType,
  isFavorite,
  toggleFavorite,
  isShiny,
  onToggleShiny,
}: Props) => {
  const { isCompared, toggleCompare } = useCompare();

  const compareData = {
    id: pokemon.id,
    name: pokemon.name,
    imageUrl:
      pokemon.sprites.officialArtwork ||
      pokemon.sprites.frontDefault ||
      "/pokemon-fallback.svg",
    types: pokemon.types.map((t) => t.name),
    stats: pokemon.stats,
  };

  const favoritedPokemon = () => {
    toggleFavorite({
      id: pokemon.id,
      name: pokemon.name,
      image:
        pokemon.sprites.officialArtwork ||
        pokemon.sprites.frontDefault ||
        "/pokemon-fallback.svg",
      types: pokemon.types.map((t) => t.name),
    });
  };

  const handleCompare = () => {
    toggleCompare(compareData);
  };

  const isInCompareList = isCompared(compareData);
  return (
    <article>
      <nav className="space-y-4 md:flex justify-between items-center">
        <CardTitle
          style={{
            color: TYPE_COLORS[primaryType],
          }}
        >
          Pokemon actions:
        </CardTitle>
        <Card>
          <CardContent>
            <ul className="flex gap-2 justify-center flex-wrap">
              <li className="flex-1 flex justify-center">
                <Button variant="outline" onClick={onToggleShiny}>
                  {isShiny ? (
                    <>
                      <Sparkles strokeWidth={0} fill="currentColor" />
                      <span className="">Shiny</span>
                    </>
                  ) : (
                    <span>{isShiny ? "Shiny" : "Normal"}</span>
                  )}
                </Button>
              </li>
              <li className="flex-1 flex justify-center">
                <Button variant="outline" onClick={favoritedPokemon}>
                  <Heart
                    className={cn(
                      "h-4 w-4 transition-all duration-200",
                      isFavorite
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-gray-500 hover:text-red-500 hover:scale-105"
                    )}
                  />
                  <span className="">Favorite</span>
                </Button>
              </li>
              <li className="flex-1 flex justify-center">
                <Button
                  variant={isInCompareList ? "default" : "outline"}
                  onClick={handleCompare}
                >
                  <GitCompare className="h-4 w-4" />
                  <span>{isInCompareList ? "comparing" : "Compare"}</span>
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </nav>
    </article>
  );
};

export default ActionbarSection;
