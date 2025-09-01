import { TYPE_COLORS, type PokemonType } from "@/models/constants";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../imageWithFallback";
import CardTitle from "../titles/cardtitle";
import { TypeBadge } from "../badge";
import { FavoriteButton } from "../favorite-button";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";

type PokemonCardDefaultProps = {
  pokemon: {
    id: string | number;
    name: string;
    types: string[];
    imageUrl?: string;
  };
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
      className="relative min-w-[150px] max-w-[280px] before:content-[''] before:absolute before:inset-0 before:opacity-20 before:bg-contain before:bg-no-repeat before:bg-black before:bg-center hover:before:opacity-0 before:rounded-xl transition-opacity duration-300"
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
