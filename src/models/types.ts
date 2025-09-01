/* eslint-disable @typescript-eslint/no-explicit-any */
import { PokemonType } from "./constants";

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  order: number;
  is_default: boolean;
  sprites: PokemonSprites;
  types: PokemonTypeInterface[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  species: {
    name: string;
    url: string;
  };
  cries?: {
    latest?: string;
    legacy?: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  other: {
    dream_world: any;
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
    home: {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
  };
  versions: {
    "generation-v": {
      "black-white": {
        animated: {
          front_default: string | null;
          front_female: string | null;
          front_shiny: string | null;
          front_shiny_female: string | null;
        };
      };
    };
  };
}

export interface PokemonTypeInterface {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: {
    name: string;
    url: string;
  };
  pokedex_numbers: Array<{
    entry_number: number;
    pokedex: {
      name: string;
      url: string;
    };
  }>;
  egg_groups: Array<{
    name: string;
    url: string;
  }>;
  color: {
    name: string;
    url: string;
  };
  shape: {
    name: string;
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  evolution_chain: {
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
  generation: {
    name: string;
    url: string;
  };
  names: Array<{
    name: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }>;
  form_descriptions: Array<{
    description: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  genera: Array<{
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  varieties: Array<{
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }>;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface EvolutionChain {
  id: number;
  baby_trigger_item: {
    name: string;
    url: string;
  } | null;
  chain: EvolutionChainLink;
}

export interface EvolutionChainLink {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
  evolution_details: Array<{
    item: {
      name: string;
      url: string;
    } | null;
    trigger: {
      name: string;
      url: string;
    };
    gender: number | null;
    held_item: {
      name: string;
      url: string;
    } | null;
    known_move: {
      name: string;
      url: string;
    } | null;
    known_move_type: {
      name: string;
      url: string;
    } | null;
    location: {
      name: string;
      url: string;
    } | null;
    min_level: number | null;
    min_happiness: number | null;
    min_beauty: number | null;
    min_affection: number | null;
    needs_overworld_rain: boolean;
    party_species: {
      name: string;
      url: string;
    } | null;
    party_type: {
      name: string;
      url: string;
    } | null;
    relative_physical_stats: number | null;
    time_of_day: string;
    trade_species: {
      name: string;
      url: string;
    } | null;
    turn_upside_down: boolean;
  }>;
  evolves_to: EvolutionChainLink[];
}

export interface TypeEffectiveness {
  double_damage_from: Array<{ name: string; url: string }>;
  double_damage_to: Array<{ name: string; url: string }>;
  half_damage_from: Array<{ name: string; url: string }>;
  half_damage_to: Array<{ name: string; url: string }>;
  no_damage_from: Array<{ name: string; url: string }>;
  no_damage_to: Array<{ name: string; url: string }>;
}

export interface PokemonTypeData {
  id: number;
  name: string;
  damage_relations: TypeEffectiveness;
  game_indices: Array<{
    game_index: number;
    generation: {
      name: string;
      url: string;
    };
  }>;
  generation: {
    name: string;
    url: string;
  };
  move_damage_class: {
    name: string;
    url: string;
  } | null;
  names: Array<{
    name: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }>;
  moves: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonInfoData {
  id: number;
  name: string;
  height: number; // em decímetros (da API)
  weight: number; // em hectogramas (da API)
  heightInMeters: number; // convertido para metros
  weightInKg: number; // convertido para kg
  baseExperience: number;
  types: Array<{
    name: PokemonType;
    slot: number;
  }>;
  stats: Array<{
    name: string;
    baseStat: number;
    effort: number;
  }>;
  abilities: Array<{
    name: string;
    isHidden: boolean;
    slot: number;
  }>;
  sprites: {
    frontDefault: string | null;
    frontShiny: string | null;
    officialArtwork: string | null;
    dreamWorld: string | null;
  };
  species: {
    name: string;
    url: string;
  };
  habitat: string | null; // habitat natural do pokémon
  description: string | null; // descrição em português/inglês
}
