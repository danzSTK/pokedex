"use client";

// React e Next.js
import { useEffect, useRef } from "react";
import Link from "next/link";

// Components
import { PokemonCardDefault } from "@/components/cards/pokemonCard";
import { PokemonCardSkeleton } from "@/components/cards/pokemonCardSkeleton";
import { ErrorState } from "@/components/states/errorState";
import Header from "@/components/header";
import MobileNavigationbar from "@/components/mobile-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { PokemonSearch } from "@/components/pokemon-search";
import { CompareDrawer } from "@/components/compare-drawer";

// Hooks e contexts
import { usePokemonList } from "@/hooks/usePokemonList";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useFilter } from "@/contexts/FilterContext";

const Home = () => {
  const { selectedTypes } = useFilter();

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
    applyTypeFilters,
    isFiltering,
    filterTotalCount,
  } = usePokemonList(20);

  // Create a stable reference to applyTypeFilters to prevent infinite loops
  const applyTypeFiltersRef = useRef(applyTypeFilters);
  applyTypeFiltersRef.current = applyTypeFilters;

  // Apply filters when selectedTypes change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        await applyTypeFiltersRef.current(selectedTypes);
      } catch (error) {
        console.error("Error applying type filters:", error);
      }
    };

    applyFilters();
  }, [selectedTypes]);

  useInfiniteScroll({
    loading,
    hasMore: !isSearching && hasMore,
    onLoadMore: loadMore,
    threshold: 100, // Reduzido para disparar mais cedo
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

      <Header className="border-b">
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
        )}
        {/* Indicador de filtros ativos */}
        {isFiltering && !isSearching && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filterTotalCount > 0
                ? `Mostrando ${pokemons.length} de ${filterTotalCount} Pokémon(s) encontrado(s) com os filtros selecionados`
                : "Nenhum Pokémon encontrado com os filtros selecionados"}
            </p>
          </div>
        )}{" "}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {pokemons.map((pokemon) => (
            <PokemonCardDefault key={pokemon.id} pokemon={pokemon} />
          ))}

          {/* Mostrar skeletons enquanto carrega */}
          {loading && !isSearching && renderSkeletons()}
        </section>
        {/* Indicador de carregamento no final */}
        {/*         {loading && pokemons.length > 0 && !isSearching && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">
                {isFiltering
                  ? "Carregando mais Pokémons filtrados..."
                  : "Carregando mais Pokémons..."}
              </span>
            </div>
          </div>
        )} */}
        {/* Mensagem quando não há mais pokémons */}
        {!hasMore && pokemons.length > 0 && !isSearching && (
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              {isFiltering
                ? `Todos os ${filterTotalCount} Pokémons filtrados foram carregados!`
                : "Você chegou ao final da lista!"}
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
        {/* Mensagem quando filtros não retornam resultados */}
        {isFiltering && !isSearching && pokemons.length === 0 && !loading && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Nenhum Pokémon encontrado com os filtros selecionados
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Tente selecionar outros tipos ou limpar os filtros
            </p>
          </div>
        )}
      </main>

      {/* Drawer de comparação */}
      <CompareDrawer />
    </div>
  );
};

export default Home;
