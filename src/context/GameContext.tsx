import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GameState, PlayerPokemon } from '../types/game';
import { POKEMON_DATABASE, getRandomEncounterId } from '../data/pokemon';

// GameState imported from types/game

// Define an extended GameState for the context's internal use, adding new properties
interface InternalGameState extends GameState {
  pendingEvolution?: {
    instanceId: string;
    toSpeciesId: string;
  };
  activeBattle?: {
    enemyId: string;
    currentQuestionId: string | null;
    hp: number; // Enemy HP (or questions left)
    maxHp: number;
  };
}

interface GameContextType extends InternalGameState {
  startGame: (starterId: string) => void;
  gainXp: (amount: number) => void;
  useEnergy: (amount: number) => boolean;
  unlockSpecies: (speciesId: string) => void;
  startBattle: (enemyId?: string) => void;
  damageEnemy: (amount: number) => void;
  endBattle: (won: boolean) => void;
  resolveEvolution: () => void;
  setActivePokemon: (instanceId: string) => void;
  capturePokemon: (speciesId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const MAX_ENERGY = 100;

export function GameProvider({ children }: { children: ReactNode }) {
  // Initial state from local storage or default
  const [gameState, setGameState] = useState<InternalGameState>(() => {
    const saved = localStorage.getItem('pokemon-game-state');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      activePokemonId: null,
      unlockedSpecies: [],
      playerEnergy: 100, // Default to full energy
      caughtPokemon: []
    };
  });

  // Seed Mock Data if empty
  useEffect(() => {
    if (gameState.caughtPokemon.length === 0) {
      // Only if completely empty (first load or manually cleared)
      // Actually, let's not force seed if they have a starter. 
      // But user asked for "more starter pokemon in bag".
      // Let's manually inject if we detect we are in "fresh dev state" or just a one-time dev seed.
      // For simplicity, let's just leave it relying on startGame, OR we can add a 'devSeed' function.
      // Or better: ensure the initial state in `useEffect` for `startGame` provides extras? 
      // No, startGame is called by UI. 
    }
  }, []);

  const capturePokemon = (speciesId: string) => {
    const species = POKEMON_DATABASE[speciesId];
    if (!species) return;
    const newP: PlayerPokemon = {
      instanceId: crypto.randomUUID(),
      speciesId: speciesId,
      xp: 0,
      level: 1, // Capture at lvl 1
      nickname: species.name
    };
    setGameState(prev => ({
      ...prev,
      caughtPokemon: [...prev.caughtPokemon, newP],
      unlockedSpecies: prev.unlockedSpecies.includes(speciesId) ? prev.unlockedSpecies : [...prev.unlockedSpecies, speciesId]
    }));
  };

  useEffect(() => {
    localStorage.setItem('pokemon-game-state', JSON.stringify(gameState));
  }, [gameState]);

  const startGame = (starterId: string) => {
    const starterSpecies = POKEMON_DATABASE[starterId];
    if (!starterSpecies) return;

    const createMon = (id: string, lvl: number) => ({
      instanceId: crypto.randomUUID(),
      speciesId: id,
      xp: 0,
      level: lvl,
      nickname: POKEMON_DATABASE[id].name
    });

    // V6 Mocks: Starter, Unevolved, Cant Evolve
    // User asked "One unevolved, one cannot evolve"
    // Squirtle (Unevolved), Lapras (Cannot evolve approx), Starter.
    const starters = [
      createMon(starterId, 5),
      createMon('squirtle', 3), // Unevolved
      createMon('mewtwo', 50)   // Cannot evolve (Legendary mock)
    ];

    setGameState(prev => ({
      ...prev,
      caughtPokemon: starters,
      activePokemonId: starters[0].instanceId,
      unlockedSpecies: starters.map(s => s.speciesId)
    }));
  };

  const gainXp = (amount: number) => {
    setGameState(prev => {
      if (!prev.activePokemonId) return prev;

      let pendingEvo: { instanceId: string; toSpeciesId: string } | undefined;

      const updatedCaught = prev.caughtPokemon.map(p => {
        if (p.instanceId !== prev.activePokemonId) return p;

        let newXp = p.xp + amount;

        // V20: Remove Level Logic. Levels are just visual or tied to XP directly if we wanted.
        // User requested removing Levels.
        // We will just keep level constant or equal to 1 for data integrity, or tracking purely for other reasons.
        // Let's keep level = 1 or Math.floor(newXp / 10) but NOT display it.
        // For evolution, we use XP thresholds directly.
        const currentLevel = Math.floor(newXp / 10) + 1;

        const species = POKEMON_DATABASE[p.speciesId];
        if (species.evolvesTo && species.evolutionLevel && newXp >= species.evolutionLevel) {
          // Check if we are already dealing with a pending evo or if we passed it long ago?
          // Since we set pending, we should prevent re-triggering if already pending.
          // Also need to ensure we don't re-trigger if we are ALREADY the evolved form (this is handled by only checking the CURRENT species)
          // But wait, if I am Charmander and I have 20 XP (Target 10), I should evolve.
          // If I am Charmeleon and have 20 XP, I should NOT evolve to Charizard (Target 30).

          // So:
          pendingEvo = { instanceId: p.instanceId, toSpeciesId: species.evolvesTo };
        }

        return {
          ...p,
          xp: newXp,
          level: currentLevel,
        };
      });

      // Update Pokedex if evolved - this part is now handled by resolveEvolution
      // const activeP = updatedCaught.find(p => p.instanceId === prev.activePokemonId);
      // const newUnlocked = [...prev.unlockedSpecies];
      // if (activeP && !newUnlocked.includes(activeP.speciesId)) {
      //   newUnlocked.push(activeP.speciesId);
      // }

      return {
        ...prev,
        caughtPokemon: updatedCaught,
        // unlockedSpecies: newUnlocked, // No longer updated here
        pendingEvolution: pendingEvo || prev.pendingEvolution
      };
    });
  };

  const useEnergy = (amount: number): boolean => {
    if (gameState.playerEnergy < amount) return false;
    setGameState(prev => ({
      ...prev,
      playerEnergy: Math.max(0, prev.playerEnergy - amount)
    }));
    return true;
  };

  const unlockSpecies = (speciesId: string) => {
    setGameState((prev: InternalGameState) => {
      if (prev.unlockedSpecies.includes(speciesId)) return prev;
      return { ...prev, unlockedSpecies: [...prev.unlockedSpecies, speciesId] };
    });
  };

  const startBattle = (enemyId?: string) => {
    let targetId = enemyId;

    if (!targetId) {
      // V21: Smart Encounter - Prioritize UNCAUGHT species
      const allIds = Object.keys(POKEMON_DATABASE);
      const caughtIds = new Set(gameState.unlockedSpecies);

      const newSpecies = allIds.filter(id => !caughtIds.has(id));

      if (newSpecies.length > 0) {
        targetId = newSpecies[Math.floor(Math.random() * newSpecies.length)];
      } else {
        // Fallback if all caught
        targetId = getRandomEncounterId();
      }
    }

    // V23: Difficulty Scaling
    // Normal = 10 Questions.
    // Strong (MaxHP > 50) = 20 Questions.
    // This covers Evolutions and Legends.
    const species = POKEMON_DATABASE[targetId!];
    const battleHp = (species && species.maxHp > 50) ? 20 : 10;

    setGameState((prev: InternalGameState) => ({
      ...prev,
      activeBattle: {
        enemyId: targetId!,
        currentQuestionId: null, // Will be set by Battle component or logic
        hp: battleHp,
        maxHp: battleHp
      }
    }));
  };

  const damageEnemy = (amount: number) => {
    setGameState((prev: InternalGameState) => {
      if (!prev.activeBattle) return prev;
      const newHp = Math.max(0, prev.activeBattle.hp - amount);
      return {
        ...prev,
        activeBattle: {
          ...prev.activeBattle,
          hp: newHp
        }
      };
    });
  };

  const endBattle = (won: boolean) => {
    setGameState((prev: InternalGameState) => {
      if (won && prev.activeBattle) {
        // Grant rewards logic here
      }
      const { activeBattle, ...rest } = prev;
      return rest;
    });
  };

  const resolveEvolution = () => {
    setGameState((prev: InternalGameState) => {
      if (!prev.pendingEvolution) return prev;

      const { instanceId, toSpeciesId } = prev.pendingEvolution;

      const updatedCaught = prev.caughtPokemon.map(p => {
        if (p.instanceId !== instanceId) return p;
        return { ...p, speciesId: toSpeciesId };
      });

      // Unlock in Dex
      const newUnlocked = [...prev.unlockedSpecies];
      if (!newUnlocked.includes(toSpeciesId)) {
        newUnlocked.push(toSpeciesId);
      }

      const { pendingEvolution, ...rest } = prev; // Remove pending
      return {
        ...rest,
        caughtPokemon: updatedCaught,
        unlockedSpecies: newUnlocked
      };
    });
  };

  const setActivePokemon = (instanceId: string) => {
    setGameState(prev => ({ ...prev, activePokemonId: instanceId }));
  };

  return (
    <GameContext.Provider value={{ ...gameState, startGame, gainXp, useEnergy, unlockSpecies, startBattle, damageEnemy, endBattle, resolveEvolution, setActivePokemon, capturePokemon }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
