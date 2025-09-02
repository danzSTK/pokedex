import { PokemonType } from "@/models/constants";
import {
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  TypeData,
} from "@/models/types";

interface PokemonListItem {
  id: number;
  name: string;
  types: PokemonType[];
  imageUrl: string;
}

interface TypePokemonEntry {
  pokemon: {
    name: string;
    url: string;
  };
}

export class PokemonApi {
  private static getBaseUrl(): string {
    // Se estiver no cliente (browser)
    if (typeof window !== "undefined") {
      const currentHost = window.location.host;
      const protocol = window.location.protocol;

      // Usar sempre o host atual para manter consistência
      return `${protocol}//${currentHost}/api`;
    }

    // Se variável de ambiente estiver definida (para casos específicos)
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }

    // Fallback para servidor (SSR) - usar localhost
    return "http://localhost:3000/api";
  }

  static async getAllPokemons(
    limit: string = "20",
    offset: string = "0"
  ): Promise<PokemonListResponse> {
    const response = await fetch(
      `${this.getBaseUrl()}/pokemon?limit=${limit}&offset=${offset}`,
      {
        next: { revalidate: 3600 }, // Cache por 1 hora
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch pokemons: ${response.status}`);
    }
    return response.json();
  }

  static async getPokemonByNameOrId(nameOrId: string): Promise<Pokemon | null> {
    const response = await fetch(`${this.getBaseUrl()}/pokemon/${nameOrId}`, {
      next: { revalidate: 3600 }, // Cache por 1 hora
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  }

  static async getPokemonSpecies(
    nameOrId: string
  ): Promise<PokemonSpecies | null> {
    const response = await fetch(
      `${this.getBaseUrl()}/pokemon-species/${nameOrId}`,
      {
        next: { revalidate: 3600 }, // Cache por 1 hora
      }
    );
    if (!response.ok) {
      return null;
    }
    return response.json();
  }

  static async getTypeData(typeName: string): Promise<TypeData | null> {
    const response = await fetch(`${this.getBaseUrl()}/type/${typeName}`, {
      next: { revalidate: 86400 }, // Cache por 24 horas
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  }

  static async getPokemonsByTypes(types: string[]): Promise<PokemonListItem[]> {
    if (types.length === 0) return [];

    try {
      // Buscar dados de cada tipo
      const typeDataPromises = types.map((type) => this.getTypeData(type));
      const typeDataResults = await Promise.all(typeDataPromises);

      // Coletar todos os Pokémons únicos
      const pokemonSet = new Set<number>();
      const pokemonMap = new Map<number, { name: string; url: string }>();

      typeDataResults.forEach((typeData) => {
        if (typeData?.pokemon) {
          typeData.pokemon.forEach((pokemonEntry: TypePokemonEntry) => {
            const pokemonId = parseInt(
              pokemonEntry.pokemon.url.split("/").slice(-2, -1)[0]
            );
            if (!pokemonSet.has(pokemonId)) {
              pokemonSet.add(pokemonId);
              pokemonMap.set(pokemonId, pokemonEntry.pokemon);
            }
          });
        }
      });

      // Buscar detalhes de cada Pokémon único
      const pokemonDetails = await Promise.allSettled(
        Array.from(pokemonMap.values()).map(async (pokemon) => {
          const pokemonData = await this.getPokemonByNameOrId(pokemon.name);
          if (pokemonData) {
            return {
              id: pokemonData.id,
              name: pokemonData.name,
              types: pokemonData.types.map((type) => type.type.name),
              imageUrl:
                pokemonData.sprites.other["official-artwork"].front_default ||
                pokemonData.sprites.front_default ||
                "/pokemon-fallback.svg",
            };
          }
          return null;
        })
      );

      // Filtrar resultados válidos e ordenar por ID
      return pokemonDetails
        .filter(
          (result): result is PromiseFulfilledResult<PokemonListItem> =>
            result.status === "fulfilled" && result.value !== null
        )
        .map((result) => result.value)
        .sort((a, b) => a.id - b.id);
    } catch (error) {
      console.error("Error fetching Pokemon by types:", error);
      return [];
    }
  }

  // Método para busca paginada por tipos
  static async getPokemonsByTypesPaginated(
    types: string[],
    offset: number = 0,
    limit: number = 20
  ): Promise<{
    pokemons: PokemonListItem[];
    totalCount: number;
    hasMore: boolean;
  }> {
    if (types.length === 0) {
      return { pokemons: [], totalCount: 0, hasMore: false };
    }

    try {
      // Buscar dados de cada tipo
      const typeDataPromises = types.map((type) => this.getTypeData(type));
      const typeDataResults = await Promise.all(typeDataPromises);

      // Coletar todos os Pokémons únicos
      const pokemonSet = new Set<number>();
      const pokemonMap = new Map<number, { name: string; url: string }>();

      typeDataResults.forEach((typeData) => {
        if (typeData?.pokemon) {
          typeData.pokemon.forEach((pokemonEntry: TypePokemonEntry) => {
            const pokemonId = parseInt(
              pokemonEntry.pokemon.url.split("/").slice(-2, -1)[0]
            );
            if (!pokemonSet.has(pokemonId)) {
              pokemonSet.add(pokemonId);
              pokemonMap.set(pokemonId, pokemonEntry.pokemon);
            }
          });
        }
      });

      // Ordenar IDs e aplicar paginação
      const allPokemonIds = Array.from(pokemonSet).sort((a, b) => a - b);
      const totalCount = allPokemonIds.length;
      const paginatedIds = allPokemonIds.slice(offset, offset + limit);
      const hasMore = offset + limit < totalCount;

      // Buscar dados completos apenas dos Pokémons da página atual
      const pokemonPromises = paginatedIds.map(async (id) => {
        try {
          const pokemon = pokemonMap.get(id);
          if (!pokemon) return null;

          const pokemonData = await this.getPokemonByNameOrId(pokemon.name);
          if (!pokemonData) return null;

          return {
            id: pokemonData.id,
            name: pokemonData.name,
            types: pokemonData.types.map((t) => t.type.name),
            imageUrl:
              pokemonData.sprites.other["official-artwork"].front_default ||
              pokemonData.sprites.front_default ||
              "/pokemon-fallback.svg",
          };
        } catch (error) {
          console.error(`Error loading pokemon with ID ${id}:`, error);
          return null;
        }
      });

      const pokemonData = await Promise.all(pokemonPromises);
      const validPokemons = pokemonData.filter(
        (pokemon): pokemon is PokemonListItem => pokemon !== null
      );

      return {
        pokemons: validPokemons,
        totalCount,
        hasMore,
      };
    } catch (error) {
      console.error("Error fetching Pokémons by types (paginated):", error);
      throw error;
    }
  }
}
