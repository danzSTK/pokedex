"use client";

import { TYPE_COLORS } from "@/models/constants";

import { ThemeToggle } from "@/components/theme-toggle";
import { useParams } from "next/navigation";

import MetricSection from "@/view/pokemonDetailsSections/metricSection";
import AboutPokemonSection from "@/view/pokemonDetailsSections/aboutPokemon";
import AdditionalInformation from "@/view/pokemonDetailsSections/addtionalInformation";
import Header from "@/components/header";
import HeroSection from "@/view/pokemonDetailsSections/Hero";
import ActionbarSection from "@/view/pokemonDetailsSections/actionbar";
import { usePokemonInfo } from "@/hooks/usePokemonList";

const PokemonDetailsSkeleton = () => (
  <div className="min-h-screen bg-card">
    <Header>
      <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      <ThemeToggle />
    </Header>
    <main className="bg-muted/20">
      <div className="h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-64 w-64 bg-muted rounded-full animate-pulse mx-auto" />
          <div className="h-6 w-32 bg-muted rounded animate-pulse mx-auto" />
        </div>
      </div>
      <section className="bg-card rounded-t-4xl py-24 -mt-28">
        <div className="container mx-auto px-4 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </section>
    </main>
  </div>
);

const PokemonErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="min-h-screen bg-card flex items-center justify-center">
    <div className="text-center space-y-4 p-8">
      <h2 className="text-2xl font-bold text-destructive">
        Erro ao carregar Pokémon
      </h2>
      <p className="text-muted-foreground">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  </div>
);

const PokemonDetailsPage = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>();
  const { pokemon, loading, error, refetch } = usePokemonInfo(pokemonId);

  if (loading) {
    return <PokemonDetailsSkeleton />;
  }

  if (error) {
    return <PokemonErrorState error={error} onRetry={refetch} />;
  }

  if (!pokemon) {
    return (
      <PokemonErrorState error="Pokémon não encontrado" onRetry={refetch} />
    );
  }

  const primaryType = pokemon.types[0]?.name || "normal";
  const backgroundColor = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;

  const pokemonForStats = {
    stats: pokemon.stats.map((stat) => ({
      base_stat: stat.baseStat,
      stat: { name: stat.name },
    })),
  };

  return (
    <div className="min-h-screen bg-card">
      <Header>
        <h1 className="text-2xl font-bold">
          {pokemon.name}{" "}
          <span className="text-muted-foreground text-base font-mono">
            #{pokemon.id.toString().padStart(3, "0")}
          </span>
        </h1>
        <ThemeToggle />
      </Header>
      <main className="" style={{ backgroundColor }}>
        <HeroSection
          pokemonName={pokemon.name}
          pokemonImage={
            pokemon.sprites.officialArtwork ||
            pokemon.sprites.frontDefault ||
            "/pokemon-fallback.svg"
          }
          pokemonTypes={pokemon.types.map((type) => type.name)}
        />
        <section className="bg-card rounded-t-4xl py-24 -mt-28">
          <div className="container mx-auto px-4 space-y-6">
            <ActionbarSection />
            <AboutPokemonSection
              pokemon={{
                height: pokemon.height,
                weight: pokemon.weight,
                heightInMeters: pokemon.heightInMeters,
                weightInKg: pokemon.weightInKg,
                baseExperience: pokemon.baseExperience,
                habitat: pokemon.habitat,
                description: pokemon.description,
                abilities: pokemon.abilities,
              }}
            />
            <MetricSection pokemon={pokemonForStats} />
            <AdditionalInformation pokemon={pokemon} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default PokemonDetailsPage;
