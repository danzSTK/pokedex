import { TypeBadge } from "@/components/badge";
import CardTitle from "@/components/titles/cardtitle";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TYPE_COLORS, PokemonType } from "@/models/constants";
import {
  calculateTypeEffectiveness,
  TypeEffectivenessResult,
} from "@/lib/type-effectiveness";
import { useEffect, useState } from "react";

interface Props {
  pokemon: {
    height: number;
    weight: number;
    heightInMeters: number;
    weightInKg: number;
    baseExperience: number;
    habitat: string;
    description: string;
    abilities: string[];
    types: Array<{
      name: PokemonType;
      slot: number;
    }>;
  };
}

const AdditionalInformation = ({ pokemon }: Props) => {
  const [effectiveness, setEffectiveness] =
    useState<TypeEffectivenessResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTypeEffectiveness = async () => {
      try {
        setLoading(true);
        const pokemonTypes = pokemon.types.map((type) => type.name);
        const result = await calculateTypeEffectiveness(pokemonTypes);
        setEffectiveness(result);
      } catch (error) {
        console.error("Erro ao calcular efetividade de tipos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTypeEffectiveness();
  }, [pokemon.types]);

  const primaryType = pokemon.types[0]?.name || "normal";

  const renderEffectivenessContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">
            Carregando efetividade...
          </span>
        </div>
      );
    }

    if (!effectiveness) {
      return (
        <p className="text-center text-muted-foreground py-4">
          Erro ao carregar dados de efetividade
        </p>
      );
    }

    const hasAnyEffectiveness =
      effectiveness.weakTo.length > 0 ||
      effectiveness.resistantTo.length > 0 ||
      effectiveness.immuneTo.length > 0;

    if (!hasAnyEffectiveness) {
      return (
        <p className="text-center text-muted-foreground py-4">
          Nenhuma efetividade especial encontrada
        </p>
      );
    }

    return (
      <section className="space-y-4">
        {effectiveness.weakTo.length > 0 && (
          <article className="space-y-2">
            <CardTitle className="text-base text-destructive">
              Weak to (takes 2x damage):
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {effectiveness.weakTo.map((type) => (
                <TypeBadge key={type} type={type as PokemonType} />
              ))}
            </div>
          </article>
        )}

        {effectiveness.resistantTo.length > 0 && (
          <article className="space-y-2">
            <CardTitle className="text-base text-chart-2">
              Resistant to (takes 0.5x damage):
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {effectiveness.resistantTo.map((type) => (
                <TypeBadge key={type} type={type as PokemonType} />
              ))}
            </div>
          </article>
        )}

        {effectiveness.immuneTo.length > 0 && (
          <article className="space-y-2">
            <CardTitle className="text-base text-muted-foreground">
              No effect (takes 0x damage):
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {effectiveness.immuneTo.map((type) => (
                <TypeBadge key={type} type={type as PokemonType} />
              ))}
            </div>
          </article>
        )}
      </section>
    );
  };

  return (
    <article className="space-y-6">
      <CardTitle style={{ color: TYPE_COLORS[primaryType] }}>
        Additional Information
      </CardTitle>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold" as={"h5"}>
              Type Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent>{renderEffectivenessContent()}</CardContent>
        </Card>
      </div>
    </article>
  );
};
export default AdditionalInformation;
