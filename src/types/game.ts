export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'steel' | 'dark' | 'fairy';

export interface PokemonSpecies {
  id: string;
  pokedexId?: number; // Added for V20: Display ID
  name: string;
  type: PokemonType;
  baseImage: string; // URL to image
  evolutionLevel?: number;
  evolvesTo?: string; // ID of the next evolution
  maxHp: number; // Base HP for battle scaling
  cnName: string; // Chinese Name
  description: string; // Pokedex entry
}

export interface PlayerPokemon {
  instanceId: string;
  speciesId: string;
  xp: number;
  level: number;
  nickname?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  category: 'english' | 'math' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  playerEnergy: number; // Max 100?
  caughtPokemon: PlayerPokemon[];
  activePokemonId: string | null;
  unlockedSpecies: string[]; // For Pokedex
}
