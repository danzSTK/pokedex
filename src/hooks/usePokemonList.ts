// React e Next.js
import { useState, useEffect, useCallback, useRef } from "react";

// Services
import { PokemonApi } from "@/services/pokeApi/pokemon-api";

// Types
import { Pokemon, PokemonInfoData, PokemonSpecies } from "@/models/types";
import { PokemonType } from "@/models/constants";

interface PokemonListItem {
  id: number;
  name: string;
  types: PokemonType[];
  imageUrl: string;
}

interface UsePokemonListReturn {
  pokemons: PokemonListItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  searchPokemons: (query: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
  searchQuery: string;
  applyTypeFilters: (selectedTypes: string[]) => Promise<void>;
  isFiltering: boolean;
  filterTotalCount: number;
}

interface UsePokemonInfoReturn {
  pokemon: PokemonInfoData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePokemonList(limit: number = 20): UsePokemonListReturn {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [originalPokemons, setOriginalPokemons] = useState<PokemonListItem[]>(
    []
  );

  // Estados para paginação de filtros
  const [filterOffset, setFilterOffset] = useState(0);
  const [filterHasMore, setFilterHasMore] = useState(false);
  const [filterTotalCount, setFilterTotalCount] = useState(0);

  const currentFilterTypesRef = useRef<string[]>([]);

  const offsetRef = useRef(0);
  const initializedRef = useRef(false);

  const transformPokemonData = useCallback(
    (pokemon: Pokemon): PokemonListItem => {
      return {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map((type) => type.type.name) as PokemonType[],
        imageUrl:
          pokemon.sprites.other["official-artwork"].front_default ||
          pokemon.sprites.front_default ||
          "/pokemon-fallback.svg",
      };
    },
    []
  );

  const loadPokemons = useCallback(
    async (currentOffset: number, isRefresh = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const listResponse = await PokemonApi.getAllPokemons(
          limit.toString(),
          currentOffset.toString()
        );

        if (!listResponse.results || listResponse.results.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        }

        const pokemonPromises = listResponse.results.map(
          async (pokemonRef: { name: string; url: string }) => {
            const urlParts = pokemonRef.url.split("/");
            const pokemonId = urlParts[urlParts.length - 2];

            try {
              const pokemon = await PokemonApi.getPokemonByNameOrId(pokemonId);
              return pokemon ? transformPokemonData(pokemon) : null;
            } catch (error) {
              console.error(
                `Error fetching pokemon ${pokemonRef.name}:`,
                error
              );
              return null;
            }
          }
        );

        const pokemonDetails = await Promise.all(pokemonPromises);
        const validPokemons = pokemonDetails.filter(
          (pokemon: PokemonListItem | null): pokemon is PokemonListItem =>
            pokemon !== null
        );

        setPokemons((prev) =>
          isRefresh ? validPokemons : [...prev, ...validPokemons]
        );
        setHasMore(validPokemons.length === limit);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load Pokémons"
        );
        console.error("Error loading pokemons:", err);
      } finally {
        setLoading(false);
      }
    },
    [limit, loading, transformPokemonData]
  );

  // Função para carregar mais pokémons filtrados
  const loadMoreFilteredPokemons = useCallback(async () => {
    if (
      loading ||
      !filterHasMore ||
      currentFilterTypesRef.current.length === 0
    ) {
      return;
    }

    setLoading(true);

    try {
      const nextOffset = filterOffset + limit;

      const result = await PokemonApi.getPokemonsByTypesPaginated(
        currentFilterTypesRef.current,
        nextOffset,
        limit
      );

      setPokemons((prev) => [...prev, ...result.pokemons]);
      setFilterOffset(nextOffset);
      setFilterHasMore(result.hasMore);
    } catch (error) {
      console.error("Error loading more filtered pokemons:", error);
      setError("Erro ao carregar mais Pokémons filtrados");
    } finally {
      setLoading(false);
    }
  }, [loading, filterHasMore, filterOffset, limit]);

  const loadMore = useCallback(() => {
    if (loading) return;

    // Se estiver filtrando e tem mais resultados de filtro
    if (
      isFiltering &&
      filterHasMore &&
      currentFilterTypesRef.current.length > 0
    ) {
      loadMoreFilteredPokemons();
      return;
    }

    // Scroll infinito normal
    if (hasMore && !isSearching) {
      offsetRef.current += limit;
      loadPokemons(offsetRef.current);
    }
  }, [
    loading,
    isFiltering,
    filterHasMore,
    hasMore,
    isSearching,
    limit,
    loadPokemons,
    loadMoreFilteredPokemons,
  ]);
  const refresh = useCallback(() => {
    setPokemons([]);
    offsetRef.current = 0;
    setHasMore(true);
    setError(null);

    // Reset dos estados de filtro
    setIsFiltering(false);
    setFilterOffset(0);
    setFilterHasMore(false);
    setFilterTotalCount(0);
    currentFilterTypesRef.current = [];

    loadPokemons(0, true);
  }, [loadPokemons]);

  // Carregar pokémons iniciais apenas uma vez
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      loadPokemons(0, true);
    }
  }, [loadPokemons]);

  // Armazenar pokémons originais quando não estamos buscando
  useEffect(() => {
    if (!isSearching && pokemons.length > 0) {
      setOriginalPokemons(pokemons);
    }
  }, [pokemons, isSearching]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
    setPokemons(originalPokemons);
    setHasMore(true);
  }, [originalPokemons]);

  const searchPokemons = useCallback(
    (query: string) => {
      if (!query.trim()) {
        clearSearch();
        return;
      }

      setSearchQuery(query);
      setIsSearching(true);
      setLoading(true);
      setError(null);

      // Executar busca assíncrona
      const performSearch = async () => {
        try {
          const trimmedQuery = query.trim().toLowerCase();

          // Se for um número, buscar por ID
          const isNumeric = /^\d+$/.test(trimmedQuery);

          if (isNumeric) {
            const pokemon = await PokemonApi.getPokemonByNameOrId(trimmedQuery);
            if (pokemon) {
              setPokemons([transformPokemonData(pokemon)]);
            } else {
              setPokemons([]);
            }
          } else {
            // Buscar por nome
            try {
              const pokemon = await PokemonApi.getPokemonByNameOrId(
                trimmedQuery
              );
              if (pokemon) {
                setPokemons([transformPokemonData(pokemon)]);
              } else {
                setPokemons([]);
              }
            } catch {
              // Se não encontrar exato, filtrar dos pokémons carregados
              const filtered = originalPokemons.filter((p) =>
                p.name.toLowerCase().includes(trimmedQuery)
              );
              setPokemons(filtered);
            }
          }
        } catch (error) {
          console.error("Erro ao buscar Pokémon:", error);
          setError("Erro ao buscar Pokémon");
          setPokemons([]);
        } finally {
          setLoading(false);
        }
      };

      performSearch();
    },
    [originalPokemons, clearSearch, transformPokemonData]
  );

  // Função para aplicar filtros por tipos com paginação
  const applyTypeFilters = useCallback(
    async (types: string[]) => {
      if (types.length === 0) {
        setIsFiltering(false);
        setFilterOffset(0);
        setFilterHasMore(false);
        setFilterTotalCount(0);
        currentFilterTypesRef.current = [];

        if (isSearching) {
          // Mantém os resultados da busca se estiver buscando
          return;
        }

        // Reseta para o estado original - recarrega a lista inicial
        setPokemons([]);
        offsetRef.current = 0;
        setHasMore(true);

        // Recarrega os pokémons originais
        try {
          setLoading(true);
          const listResponse = await PokemonApi.getAllPokemons(
            limit.toString(),
            "0"
          );

          if (listResponse.results && listResponse.results.length > 0) {
            const pokemonPromises = listResponse.results.map(async (item) => {
              try {
                const pokemon = await PokemonApi.getPokemonByNameOrId(
                  item.name
                );
                if (pokemon) {
                  return transformPokemonData(pokemon);
                }
                return null;
              } catch (error) {
                console.error(`Error loading pokemon ${item.name}:`, error);
                return null;
              }
            });

            const pokemonData = await Promise.all(pokemonPromises);
            const validPokemons = pokemonData.filter(
              (pokemon): pokemon is PokemonListItem => pokemon !== null
            );

            setPokemons(validPokemons);
            setOriginalPokemons(validPokemons);
            offsetRef.current = limit;
          }
        } catch (error) {
          console.error("Error reloading pokemons:", error);
          setError("Erro ao recarregar Pokémons");
        } finally {
          setLoading(false);
        }
        return;
      }

      // Aplicar filtros com paginação
      setIsFiltering(true);
      currentFilterTypesRef.current = types;
      setLoading(true);
      setError(null);

      try {
        // Usar API paginada para buscar apenas os primeiros 20 resultados
        const result = await PokemonApi.getPokemonsByTypesPaginated(
          types,
          0,
          limit
        );

        setPokemons(result.pokemons);
        setFilterOffset(0);
        setFilterHasMore(result.hasMore);
        setFilterTotalCount(result.totalCount);
      } catch (err) {
        console.error("Error filtering Pokemon by types:", err);
        setError("Erro ao filtrar Pokémons por tipo");

        // Fallback para filtro local apenas se temos pokémons carregados
        if (originalPokemons.length > 0) {
          const filteredLocal = originalPokemons.filter((pokemon) =>
            pokemon.types.some((type) => types.includes(type))
          );
          setPokemons(filteredLocal);
          setFilterHasMore(false);
          setFilterTotalCount(filteredLocal.length);
        }
      } finally {
        setLoading(false);
      }
    },
    [originalPokemons, isSearching, limit, transformPokemonData]
  );

  // Determinar se há mais itens para carregar
  const getHasMore = () => {
    if (isSearching) return false;
    if (isFiltering) return filterHasMore;
    return hasMore;
  };

  return {
    pokemons,
    loading,
    error,
    hasMore: getHasMore(),
    loadMore,
    refresh,
    searchPokemons,
    clearSearch,
    isSearching,
    searchQuery,
    applyTypeFilters,
    isFiltering,
    filterTotalCount,
  };
}

export function usePokemonInfo(
  pokemonId: string | number
): UsePokemonInfoReturn {
  const [pokemon, setPokemon] = useState<PokemonInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformPokemonInfor = (
    rawPokemon: Pokemon,
    species?: PokemonSpecies | null
  ): PokemonInfoData => {
    // Conversões de unidades
    const heightInMeters = rawPokemon.height / 10; // decímetros para metros
    const weightInKg = rawPokemon.weight / 10; // hectogramas para kg

    // Buscar descrição em português/inglês
    const getDescription = (): string | null => {
      if (!species?.flavor_text_entries) return null;

      // Priorizar português, depois inglês
      const portugueseEntry = species.flavor_text_entries.find(
        (entry) =>
          entry.language.name === "pt" || entry.language.name === "pt-BR"
      );

      if (portugueseEntry) {
        return portugueseEntry.flavor_text.replace(/[\n\f]/g, " ").trim();
      }

      const englishEntry = species.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );

      if (englishEntry) {
        return englishEntry.flavor_text.replace(/[\n\f]/g, " ").trim();
      }

      return null;
    };

    // Traduzir habitat para português
    const getHabitat = (): string | null => {
      if (!species?.habitat?.name) return null;

      const habitatTranslations: Record<string, string> = {
        cave: "Cave",
        forest: "Forest",
        grassland: "Grassland",
        mountain: "Mountain",
        rare: "Rare",
        "rough-terrain": "Rough Terrain",
        sea: "Sea",
        urban: "Urban",
        "waters-edge": "Waters Edge",
      };

      return habitatTranslations[species.habitat.name] || species.habitat.name;
    };

    return {
      id: rawPokemon.id,
      name: rawPokemon.name,
      height: rawPokemon.height,
      weight: rawPokemon.weight,
      heightInMeters,
      weightInKg,
      baseExperience: rawPokemon.base_experience || 0,
      types: rawPokemon.types.map((type) => ({
        name: type.type.name as PokemonInfoData["types"][0]["name"],
        slot: type.slot,
      })),
      stats: rawPokemon.stats.map((stat) => ({
        name: stat.stat.name,
        baseStat: stat.base_stat,
        effort: stat.effort,
      })),
      abilities: rawPokemon.abilities.map((ability) => ({
        name: ability.ability.name,
        isHidden: ability.is_hidden,
        slot: ability.slot,
      })),
      sprites: {
        frontDefault: rawPokemon.sprites.front_default,
        frontShiny: rawPokemon.sprites.front_shiny,
        officialArtwork:
          rawPokemon.sprites.other["official-artwork"]?.front_default || null,
        officialArtworkShiny:
          rawPokemon.sprites.other["official-artwork"]?.front_shiny || null,
        dreamWorld:
          rawPokemon.sprites.other?.dream_world?.front_default || null,
      },
      species: {
        name: rawPokemon.species.name,
        url: rawPokemon.species.url,
      },
      habitat: getHabitat(),
      description: getDescription(),
    };
  };

  const fetchPokemonInfo = useCallback(async () => {
    if (!pokemonId) {
      setError("Pokemon ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setPokemon(null);

    try {
      const rawPokemon = await PokemonApi.getPokemonByNameOrId(
        pokemonId.toString()
      );

      if (!rawPokemon) {
        setError(`Pokemon with Id ${pokemonId} not found`);
        return;
      }

      // Buscar dados da species em paralelo
      let species: PokemonSpecies | null = null;
      try {
        species = await PokemonApi.getPokemonSpecies(rawPokemon.species.name);
      } catch (speciesError) {
        console.warn("Failed to fetch species data:", speciesError);
        // Continuar sem dados da species
      }

      const transformedPokemon = transformPokemonInfor(rawPokemon, species);
      setPokemon(transformedPokemon);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load Pokémon";
      setError(errorMessage);
      console.error("Error loading pokemon info:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pokemonId]);

  const refetch = useCallback(() => {
    fetchPokemonInfo();
  }, [fetchPokemonInfo]);

  useEffect(() => {
    fetchPokemonInfo();
  }, [fetchPokemonInfo]);

  return {
    pokemon,
    loading,
    error,
    refetch,
  };
}
