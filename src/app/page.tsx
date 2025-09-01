"use client";

import { PokemonCardDefault } from "@/components/cards/pokemonCard";
import { PokemonCardSkeleton } from "@/components/cards/pokemonCardSkeleton";
import { ErrorState } from "@/components/states/errorState";
import Header from "@/components/header";
import MobileNavigationbar from "@/components/mobile-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PokemonSearch } from "@/components/pokemon-search";
import { usePokemonList } from "@/hooks/usePokemonList";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { GitCompareArrows } from "lucide-react";
import Link from "next/link";

const Home = () => {
  const {
    pokemons,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    searchPokemons,
    clearSearch,
    isSearching,
    searchQuery,
  } = usePokemonList(20);

  // Hook para scroll infinito (só funciona quando não está buscando)
  useInfiniteScroll({
    loading,
    hasMore: !isSearching && hasMore,
    onLoadMore: loadMore,
    threshold: 200,
  });

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <PokemonCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={refresh}
        title="Erro ao carregar Pokémons"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <MobileNavigationbar />

      <Button
        className="fixed bottom-[68px] right-10 z-20"
        variant="default"
        id="add_pokemon_compare_button"
      >
        <GitCompareArrows />
        <span>Compare (0)</span>
      </Button>

      <Header>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Pokédex</h1>
          <ThemeToggle />
        </div>
      </Header>

      <main className="container mx-auto px-4 py-8">
        {/* Componente de busca */}
        <div className="mb-6">
          <PokemonSearch onSearch={searchPokemons} onClear={clearSearch} />
        </div>
        {/* Indicador de busca ativa */}
        {isSearching && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {pokemons.length > 0
                ? `${pokemons.length} resultado(s) para "${searchQuery}"`
                : `Nenhum resultado para "${searchQuery}"`}
            </p>
          </div>
        )}{" "}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {pokemons.map((pokemon) => (
            <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`}>
              <PokemonCardDefault pokemon={pokemon} />
            </Link>
          ))}

          {/* Mostrar skeletons enquanto carrega (só quando não está buscando) */}
          {loading && !isSearching && renderSkeletons()}
        </section>
        {/* Indicador de carregamento no final (só quando não está buscando) */}
        {loading && pokemons.length > 0 && !isSearching && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">
                Carregando mais Pokémons...
              </span>
            </div>
          </div>
        )}
        {/* Mensagem quando não há mais pokémons (só quando não está buscando) */}
        {!hasMore && pokemons.length > 0 && !isSearching && (
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Você chegou ao final da lista!
            </p>
          </div>
        )}
        {/* Mensagem quando busca não retorna resultados */}
        {isSearching && pokemons.length === 0 && !loading && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Nenhum Pokémon encontrado para &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Tente buscar por nome ou número (ex: &ldquo;pikachu&rdquo; ou
              &ldquo;25&rdquo;)
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
