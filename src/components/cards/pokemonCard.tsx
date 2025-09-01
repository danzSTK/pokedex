// Outras bibliotecas
import { X } from "lucide-react";

// Components
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../imageWithFallback";
import CardTitle from "../titles/cardtitle";
import { TypeBadge } from "../badge";
import { FavoriteButton } from "../favorite-button";

// Hooks e contexts
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";

// Types e constantes
import { TYPE_COLORS, type PokemonType } from "@/models/constants";
import { ComparePokemon } from "@/contexts/CompareContext";

type PokemonCardDefaultProps = {
  pokemon: {
    id: string | number;
    name: string;
    types: string[];
    imageUrl?: string;
  };
};

interface PokemonCardCompareProps {
  pokemon: ComparePokemon;
  removeFromCompare: (id: number) => void;
}

const STAT_NAMES: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
};

export const PokemonCardDefault = ({ pokemon }: PokemonCardDefaultProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  // Usar o primeiro tipo para a cor de fundo
  const primaryType = pokemon.types[0] as PokemonType;
  const backgroundColor = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;

  const handleToggleFavorite = () => {
    const wasFavorite = isFavorite(pokemon.id);

    toggleFavorite({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      imageUrl: pokemon.imageUrl,
    });

    // Mostrar feedback ao usuário
    toast({
      title: wasFavorite
        ? "Removido dos favoritos"
        : "Adicionado aos favoritos",
      description: wasFavorite
        ? `${pokemon.name} foi removido da sua lista de favoritos`
        : `${pokemon.name} foi adicionado à sua lista de favoritos`,
      duration: 2000,
    });
  };

  return (
    <Card
      className="relative min-h-[250px] min-w-[150px] max-w-[280px] before:content-[''] before:absolute before:inset-0 before:opacity-20 before:bg-contain before:bg-no-repeat before:bg-black before:bg-center hover:before:opacity-0 before:rounded-xl transition-opacity duration-300"
      style={{ backgroundColor }}
    >
      <FavoriteButton
        isFavorite={isFavorite(pokemon.id)}
        onToggle={handleToggleFavorite}
      />

      <CardContent className="z-10 flex flex-col items-center space-y-2">
        <div className="text-center">
          <ImageWithFallback
            src={
              pokemon.imageUrl ||
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
            }
            alt={`${pokemon.name} image`}
            height={100}
            width={100}
          />

          <CardTitle className="text-lg font-bold capitalize">
            {pokemon.name}
          </CardTitle>
        </div>

        <div className="flex gap-2 justify-center w-full">
          {pokemon.types.slice(0, 2).map((type) => (
            <TypeBadge type={type as PokemonType} key={type} size="small" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const PokemonCardCompare = ({
  pokemon,
  removeFromCompare,
}: PokemonCardCompareProps) => {
  const totalStats = pokemon.stats.reduce(
    (acc, stat) => acc + stat.baseStat,
    0
  );
  return (
    <Card key={pokemon.id} className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0 z-10"
        onClick={() => removeFromCompare(pokemon.id)}
      >
        <X className="h-4 w-4" />
      </Button>

      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <ImageWithFallback
            src={pokemon.imageUrl}
            alt={pokemon.name}
            width={60}
            height={60}
            className="rounded-lg"
          />
          <div>
            <CardTitle className="text-lg capitalize">{pokemon.name}</CardTitle>
            <div className="flex space-x-1 mt-1">
              {pokemon.types.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  style={{
                    backgroundColor:
                      TYPE_COLORS[type as keyof typeof TYPE_COLORS],
                    color: "white",
                  }}
                  className="text-xs"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {pokemon.stats.map((stat) => (
            <div key={stat.name} className="flex justify-between">
              <span className="text-muted-foreground">
                {STAT_NAMES[stat.name] || stat.name}:
              </span>
              <span className="font-medium">{stat.baseStat}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-muted pt-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-medium">{totalStats}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
