import { useGame } from '../context/GameContext';
import { POKEMON_DATABASE } from '../data/pokemon';
import './Pokedex.css';

interface PokedexProps {
  onClose: () => void;
}

export default function Pokedex({ onClose }: PokedexProps) {
  const { unlockedSpecies } = useGame();
  const allSpecs = Object.values(POKEMON_DATABASE);

  return (
    <div className="pokedex-overlay">
      <div className="pokedex-frame">
        <header className="pokedex-header">
          <div className="sensor-light"></div>
          <div className="small-lights">
            <div className="light red"></div>
            <div className="light yellow"></div>
            <div className="light green"></div>
          </div>
          <button onClick={onClose} className="dex-close-btn">✖</button>
        </header>

        <div className="dex-screen">
          <div className="dex-grid">
            {allSpecs.map(spec => {
              const isUnlocked = unlockedSpecies.includes(spec.id);
              return (
                <div key={spec.id} className={`dex-entry ${isUnlocked ? 'unlocked' : 'locked'}`}>
                  <div className="dex-num">No.{String(spec.pokedexId || 999).padStart(3, '0')}</div>

                  <div className="dex-image-container">
                    {isUnlocked ? (
                      <img src={spec.baseImage} alt={spec.name} />
                    ) : (
                      <img src={spec.baseImage} alt="Locked" className="silhouette" />
                    )}
                  </div>

                  <div className="dex-details">
                    <div className="dex-names">
                      <span className="cn-name">{isUnlocked ? spec.cnName : '???'}</span>
                      <span className="en-name">{isUnlocked ? spec.name : '???'}</span>
                    </div>
                    {isUnlocked && <div className="dex-desc">{spec.description}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
