export const POKEMON_TYPES = {
  normal: "normal",
  fire: "fire",
  water: "water",
  electric: "electric",
  grass: "grass",
  ice: "ice",
  fighting: "fighting",
  poison: "poison",
  ground: "ground",
  flying: "flying",
  psychic: "psychic",
  bug: "bug",
  rock: "rock",
  ghost: "ghost",
  dragon: "dragon",
  dark: "dark",
  steel: "steel",
  fairy: "fairy",
} as const;

export const TYPE_COLORS: Record<keyof typeof POKEMON_TYPES, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export const MAX_STATS = {
  hp: 255,
  attack: 190,
  defense: 230,
  "special-attack": 194,
  "special-defense": 230,
  speed: 180,
} as const;


export type StatsType = keyof typeof MAX_STATS;

export type PokemonType = keyof typeof POKEMON_TYPES;


export const POKEMON_API_BASE_URL = "https://pokeapi.co/api/v2";
