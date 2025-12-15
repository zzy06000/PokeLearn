import { PokemonSpecies } from '../types/game'; // Import type
import './VictoryScreen.css';

interface VictoryScreenProps {
  onClose: () => void;
  caughtPokemon?: PokemonSpecies; // Optional caught details
}

export default function VictoryScreen({ onClose, caughtPokemon }: VictoryScreenProps) {
  return (
    <div className="victory-overlay">
      <div className="victory-card">
        <h2 className="victory-title">GOTCHA!</h2>

        {caughtPokemon && (
          <div className="caught-display">
            <img src={caughtPokemon.baseImage} alt={caughtPokemon.name} className="caught-img" />
            <p className="caught-text">{caughtPokemon.name} was caught!</p>
            <div className="dex-badge">New Pokedex Data Added</div>
          </div>
        )}

        <div className="xp-reward">
          {!caughtPokemon && <p>Victory!</p>}
          {/* User requested no XP number here */}
        </div>

        <button className="continue-btn" onClick={onClose}>
          Continue Journey
        </button>
      </div>
    </div>
  );
}
