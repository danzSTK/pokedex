import { InformationBadge } from "@/components/badge";
import CardTitle from "@/components/titles/cardtitle";
import { PokemonType, TYPE_COLORS } from "@/models/constants";
import { House, Weight } from "lucide-react";

interface Props {
  pokemon: {
    heightInMeters: number;
    weightInKg: number;
    habitat: string | null;
    description: string | null;
    type: PokemonType
  };
}

const AboutPokemonSection = ({ pokemon }: Props) => {
  return (
    <article className="space-y-4">
      <CardTitle style={{ color: TYPE_COLORS[pokemon.type] }}>
        About Pokémon
      </CardTitle>

      <div className="flex flex-wrap items-center justify-center gap-4 py-4">
        <InformationBadge
          icon={Weight}
          title="Weight"
          label={`${pokemon.weightInKg} kg`}
        />
        <div className="w-px h-12 bg-muted-foreground/30 hidden sm:block"></div>
        <InformationBadge
          icon={Weight}
          title="Height"
          label={`${pokemon.heightInMeters} m`}
        />
        <div className="w-px h-12 bg-muted-foreground/30 hidden sm:block"></div>
        <InformationBadge
          icon={House}
          title="Habitat"
          label={pokemon.habitat || "Desconhecido"}
        />
      </div>

      <p className="text-muted-foreground px-2">
        {pokemon.description ||
          "Informações sobre este Pokémon não estão disponíveis no momento."}
      </p>
    </article>
  );
};

export default AboutPokemonSection;
