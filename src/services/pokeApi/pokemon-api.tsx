import { Pokemon, PokemonListResponse, PokemonSpecies } from "@/models/types";

export class PokemonApi {
  private static getBaseUrl(): string {
    // Para desenvolvimento, sempre usar IP fixo se estiver disponível
    if (typeof window !== "undefined") {
      const currentHost = window.location.host;
      // Se acessando via IP da rede, usar o mesmo IP para API
      if (currentHost.includes("192.168.0.4")) {
        return "http://192.168.0.4:3000/api";
      }
    }

    // Usar variável de ambiente se definida
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }

    if (typeof window !== "undefined") {
      // Cliente: usa a URL atual
      return `${window.location.protocol}//${window.location.host}/api`;
    }

    // Servidor: fallback para IP da rede
    return "http://192.168.0.4:3000/api";
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
}
