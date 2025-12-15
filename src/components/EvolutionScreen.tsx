
import { useGame } from '../context/GameContext';
import { useEffect } from 'react';
import { POKEMON_DATABASE } from '../data/pokemon';
import './EvolutionScreen.css';

export default function EvolutionScreen() {
  const { pendingEvolution, resolveEvolution, caughtPokemon } = useGame();

  useEffect(() => {
    // Just trigger animation logic
  }, [pendingEvolution]);

  if (!pendingEvolution) return null;

  // Derive data
  const baseMon = caughtPokemon.find(p => p.instanceId === pendingEvolution.instanceId);
  if (!baseMon) return null;

  const fromSpecies = POKEMON_DATABASE[baseMon.speciesId];
  const toSpecies = POKEMON_DATABASE[pendingEvolution.toSpeciesId];

  return (
    <div className="evolution-overlay">
      <div className="evolution-content">
        <h2 className="evo-title">What? {fromSpecies.name} is evolving!</h2>

        <div className="evo-stage">
          <img src={fromSpecies.baseImage} className="evo-sprite from-sprite" alt="from" />
          <img src={toSpecies.baseImage} className="evo-sprite to-sprite" alt="to" />
          <div className="evo-flash"></div>
        </div>

        <p className="evo-message">Congratulations! Your {fromSpecies.name} evolved into {toSpecies.name}!</p>

        <button className="evo-continue-btn" onClick={resolveEvolution}>
          Continue Journey
        </button>
      </div>
    </div>
  );
}
