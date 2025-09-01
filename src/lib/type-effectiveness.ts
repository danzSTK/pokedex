import { TypeData } from "@/models/types";
import { PokemonApi } from "@/services/pokeApi/pokemon-api";
import { PokemonType } from "@/models/constants";

export interface TypeEffectivenessResult {
  weakTo: string[]; // tipos que causam 2x ou mais de dano
  resistantTo: string[]; // tipos que causam 0.5x ou menos de dano
  immuneTo: string[]; // tipos que causam 0x de dano
}

/**
 * Calcula a efetividade de tipos combinada para um Pokémon com um ou dois tipos
 * usando dados reais da PokeAPI
 */
export async function calculateTypeEffectiveness(
  types: PokemonType[]
): Promise<TypeEffectivenessResult> {
  if (types.length === 0) {
    return { weakTo: [], resistantTo: [], immuneTo: [] };
  }

  // Busca dados de todos os tipos do Pokémon
  const typeDataPromises = types.map((type) => PokemonApi.getTypeData(type));
  const typeDataArray = await Promise.all(typeDataPromises);

  // Filtra dados válidos
  const validTypeData = typeDataArray.filter(
    (data): data is TypeData => data !== null
  );

  if (validTypeData.length === 0) {
    return { weakTo: [], resistantTo: [], immuneTo: [] };
  }

  // Inicializa multiplicadores para todos os tipos possíveis
  const typeMultipliers: Record<string, number> = {};

  // Lista de todos os tipos Pokémon possíveis
  const allTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  // Inicializa com multiplicador 1 (dano normal)
  allTypes.forEach((type) => {
    typeMultipliers[type] = 1;
  });

  // Calcula multiplicadores baseado nos dados da API
  validTypeData.forEach((typeData) => {
    const relations = typeData.damage_relations;

    // Tipos que causam 2x de dano (fraquezas)
    relations.double_damage_from.forEach((type) => {
      typeMultipliers[type.name] *= 2;
    });

    // Tipos que causam 0.5x de dano (resistências)
    relations.half_damage_from.forEach((type) => {
      typeMultipliers[type.name] *= 0.5;
    });

    // Tipos que causam 0x de dano (imunidades)
    relations.no_damage_from.forEach((type) => {
      typeMultipliers[type.name] = 0;
    });
  });

  // Agrupa os tipos por efetividade final
  const result: TypeEffectivenessResult = {
    weakTo: [],
    resistantTo: [],
    immuneTo: [],
  };

  Object.entries(typeMultipliers).forEach(([type, multiplier]) => {
    if (multiplier === 0) {
      result.immuneTo.push(type);
    } else if (multiplier >= 2) {
      result.weakTo.push(type);
    } else if (multiplier <= 0.5) {
      result.resistantTo.push(type);
    }
    // multiplier === 1 significa dano normal, não incluímos na lista
  });

  return result;
}

/**
 * Formata o multiplicador de dano para exibição
 */
export function formatDamageMultiplier(multiplier: number): string {
  if (multiplier === 0) return "0x";
  if (multiplier === 0.25) return "¼x";
  if (multiplier === 0.5) return "½x";
  if (multiplier === 1) return "1x";
  if (multiplier === 2) return "2x";
  if (multiplier === 4) return "4x";
  return `${multiplier}x`;
}
