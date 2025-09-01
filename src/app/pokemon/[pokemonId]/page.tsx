"use client";

// React e Next.js
import { useState } from "react";
import { useParams } from "next/navigation";

// Components
import { ThemeToggle } from "@/components/theme-toggle";
import Header from "@/components/header";
import MetricSection from "@/view/pokemonDetailsSections/metricSection";
import AboutPokemonSection from "@/view/pokemonDetailsSections/aboutPokemon";
import AdditionalInformation from "@/view/pokemonDetailsSections/addtionalInformation";
import HeroSection from "@/view/pokemonDetailsSections/Hero";
import ActionbarSection from "@/view/pokemonDetailsSections/actionbar";

// Hooks e contexts
import { usePokemonInfo } from "@/hooks/usePokemonList";
import { useFavorites } from "@/contexts/FavoritesContext";

// Types e constantes
import { TYPE_COLORS } from "@/models/constants";

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
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isShiny, setIsShiny] = useState(false);

  const handleToggleShiny = () => {
    setIsShiny(!isShiny);
  };

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

  const pokemonForAdditionalInformation = {
    ...pokemon,
    habitat: pokemon.habitat || "unknown",
    description: pokemon.description || "No description available",
    abilities: pokemon.abilities.map((a) => a.name),
  };

  const pokemonForAbout = {
    heightInMeters: pokemon.heightInMeters,
    weightInKg: pokemon.weightInKg,
    habitat: pokemon.habitat,
    description: pokemon.description,
    type: primaryType,
  };

  const pokemonForStats = {
    stats: pokemon.stats.map((stat) => ({
      base_stat: stat.baseStat,
      stat: {
        name: stat.name as
          | "hp"
          | "attack"
          | "defense"
          | "special-attack"
          | "special-defense"
          | "speed",
      },
    })),
  };

  return (
    <div className="min-h-screen bg-card">
      <Header className="border-b">
        <h1 className="text-2xl font-bold capitalize">
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
            isShiny
              ? pokemon.sprites.officialArtworkShiny ||
                pokemon.sprites.frontShiny ||
                pokemon.sprites.frontDefault ||
                "/pokemon-fallback.svg"
              : pokemon.sprites.officialArtwork ||
                pokemon.sprites.frontDefault ||
                "/pokemon-fallback.svg"
          }
          pokemonTypes={pokemon.types.map((type) => type.name)}
          isShiny={isShiny}
          onToggleShiny={handleToggleShiny}
        />
        <section className="bg-card rounded-t-4xl py-24 -mt-28">
          <div className="container mx-auto px-2 space-y-6">
            <ActionbarSection
              toggleFavorite={(pokemon) => toggleFavorite(pokemon)}
              pokemon={pokemon}
              primaryType={primaryType}
              isFavorite={isFavorite(Number(pokemonId))}
              isShiny={isShiny}
              onToggleShiny={handleToggleShiny}
            />
            <AboutPokemonSection pokemon={pokemonForAbout} />
            <MetricSection pokemon={pokemonForStats} type={primaryType} />
            <AdditionalInformation
              pokemon={{
                ...pokemonForAdditionalInformation,
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default PokemonDetailsPage;
