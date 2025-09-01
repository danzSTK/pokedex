// Cache global para Pokémons
interface PokemonCacheEntry {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  fullData?: Record<string, unknown>; // Dados completos do Pokémon
  timestamp: number;
}

interface TypeFilterCacheEntry {
  pokemonIds: number[];
  totalCount: number;
  lastOffset: number;
  timestamp: number;
}

class PokemonCacheManager {
  private readonly pokemonCache = new Map<number, PokemonCacheEntry>();
  private readonly typeFilterCache = new Map<string, TypeFilterCacheEntry>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos
  private readonly MAX_CACHE_SIZE = 1000; // Máximo de 1000 Pokémons em cache

  // Cache individual de Pokémon
  setPokemon(pokemon: PokemonCacheEntry): void {
    // Limpa cache antigo se necessário
    if (this.pokemonCache.size >= this.MAX_CACHE_SIZE) {
      this.clearOldEntries();
    }

    this.pokemonCache.set(pokemon.id, {
      ...pokemon,
      timestamp: Date.now(),
    });
  }

  getPokemon(id: number): PokemonCacheEntry | null {
    const entry = this.pokemonCache.get(id);
    if (!entry) return null;

    // Verifica se o cache ainda é válido
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.pokemonCache.delete(id);
      return null;
    }

    return entry;
  }

  // Cache de filtros por tipo
  setTypeFilter(types: string[], data: TypeFilterCacheEntry): void {
    const key = this.getTypeKey(types);
    this.typeFilterCache.set(key, {
      ...data,
      timestamp: Date.now(),
    });
  }

  getTypeFilter(types: string[]): TypeFilterCacheEntry | null {
    const key = this.getTypeKey(types);
    const entry = this.typeFilterCache.get(key);

    if (!entry) return null;

    // Verifica se o cache ainda é válido
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.typeFilterCache.delete(key);
      return null;
    }

    return entry;
  }

  // Busca Pokémons em cache por IDs
  getPokemonsByIds(ids: number[]): PokemonCacheEntry[] {
    const result: PokemonCacheEntry[] = [];

    for (const id of ids) {
      const pokemon = this.getPokemon(id);
      if (pokemon) {
        result.push(pokemon);
      }
    }

    return result;
  }

  private getTypeKey(types: string[]): string {
    return [...types].sort((a, b) => a.localeCompare(b)).join(",");
  }

  private clearOldEntries(): void {
    const now = Date.now();
    const entriesToDelete: number[] = [];

    for (const [id, entry] of this.pokemonCache.entries()) {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        entriesToDelete.push(id);
      }
    }

    // Remove as entradas mais antigas se ainda estiver muito cheio
    if (entriesToDelete.length < 100) {
      const sortedEntries = Array.from(this.pokemonCache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, 100);

      for (const [id] of sortedEntries) {
        entriesToDelete.push(id);
      }
    }

    entriesToDelete.forEach((id) => this.pokemonCache.delete(id));
  }

  // Limpa t o d o o cache quando necessário
  clearAll(): void {
    this.pokemonCache.clear();
    this.typeFilterCache.clear();
  }

  // Status do cache
  getStats() {
    return {
      pokemonCount: this.pokemonCache.size,
      typeFilterCount: this.typeFilterCache.size,
      maxSize: this.MAX_CACHE_SIZE,
    };
  }
}

// Instância global do cache
export const pokemonCache = new PokemonCacheManager();
