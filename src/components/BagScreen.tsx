import { useGame } from '../context/GameContext';
import { POKEMON_DATABASE } from '../data/pokemon';
import './BagScreen.css';

interface BagScreenProps {
  onClose: () => void;
}

export default function BagScreen({ onClose }: BagScreenProps) {
  const { caughtPokemon, activePokemonId, setActivePokemon } = useGame();

  const handleEquip = (instanceId: string) => {
    setActivePokemon(instanceId);
  };

  // Filter unique species for shorter list if desired, but user wants to see their collection.
  // Filter unique species but prioritize the ACTIVE one or the Highest Level one.
  // This ensures that if the user has a Level 16 Charmander (active) and Level 1 Charmander (inactive),
  // we show the Level 16 one.
  const uniqueDisplay = Object.values(
    caughtPokemon.reduce((acc, p) => {
      const existing = acc[p.speciesId];
      // If no existing, or if p is the ACTIVE one, or if p is higher level than existing (and existing is not active)
      if (
        !existing ||
        p.instanceId === activePokemonId ||
        (existing.instanceId !== activePokemonId && p.level > existing.level)
      ) {
        acc[p.speciesId] = p;
      }
      return acc;
    }, {} as Record<string, typeof caughtPokemon[0]>)
  );

  return (
    <div className="bag-overlay">
      <div className="bag-container">
        <header className="bag-header">
          <h2>Pokemon Bag</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </header>

        <div className="bag-grid">
          {uniqueDisplay.map((p) => {
            const species = POKEMON_DATABASE[p.speciesId];
            const isActive = p.instanceId === activePokemonId;

            return (
              <div key={p.instanceId} className={`bag-card ${isActive ? 'active' : ''}`} onClick={() => handleEquip(p.instanceId)}>

                {/* Left: Visual */}
                <div className="card-visual">
                  <img
                    src={species.baseImage}
                    alt={species.name}
                    className="bag-sprite"
                  />
                </div>

                {/* Right: Info */}
                <div className="card-info">
                  <div className="bag-name-row">
                    <span className="cn-name">{species.cnName}</span>
                    <span className="en-name">{species.name}</span>
                  </div>

                  {/* <div className="bag-level">Lv.{p.level}</div> */}

                  <div className="bag-xp-row">
                    <div className="bag-xp-bar">
                      <div className="bag-xp-fill" style={{ width: `${(p.xp % 10) * 10}%` }}></div>
                    </div>
                    <span className="bag-xp-text">{p.xp % 10}/10</span>
                  </div>

                  {isActive && <div className="equipped-badge">EQUIPPED</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
