import { useGame } from '../context/GameContext';
import BagScreen from './BagScreen';
import './MainMenu.css';
import { useState, useEffect } from 'react';
import { POKEMON_DATABASE } from '../data/pokemon';
import logoImg from '../assets/logo_final.png';

interface MainMenuProps {
  onStartBattle: () => void;
  onOpenPokedex: () => void;
}

export default function MainMenu({ onStartBattle, onOpenPokedex }: MainMenuProps) {
  const { } = useGame();
  const [showBag, setShowBag] = useState(false);
  const [bgPokemon, setBgPokemon] = useState<{ id: string, x: number, y: number, img: string, scale: number, delay: number }[]>([]);

  useEffect(() => {
    // Generate scattered background pokemon
    const allIds = Object.keys(POKEMON_DATABASE);

    // 1. Shuffle and pick unique 12
    const shuffled = [...allIds].sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, 12);

    // 2. Grid-based positioning (3 cols x 4 rows) to ensure even distribution
    const generated = selectedIds.map((id, index) => {
      const specie = POKEMON_DATABASE[id];

      const cols = 4;
      const col = index % cols;
      const row = Math.floor(index / cols);

      // Cell size: 100/4 = 25% width, 100/3 = 33% height
      // Add random jitter within the cell
      const x = (col * 25) + (Math.random() * 15 + 5);
      const y = (row * 33) + (Math.random() * 20 + 5);

      return {
        id: `bg-${id}-${index}`,
        img: specie.baseImage,
        x,
        y,
        scale: 0.25 + Math.random() * 0.15, // Consistent small size
        delay: Math.random() * 5
      };
    });
    setBgPokemon(generated);
  }, []);

  return (
    <div className="main-menu title-screen-mode">
      {/* Scattered Background Layer */}
      <div className="menu-bg-layer">
        {bgPokemon.map(p => (
          <img
            key={p.id}
            src={p.img}
            className="bg-pokemon-sprite"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `scale(${p.scale})`,
              animationDelay: `${p.delay}s`
            }}
            alt=""
          />
        ))}
      </div>

      <div className="title-content">
        {/* User Provided Logo Image */}
        <div className="logo-container">
          <img src={logoImg} alt="PokéLearn" className="game-logo-img" />
        </div>

        <div className="start-area">
          <button className="main-start-btn" onClick={onStartBattle}>
            <span className="btn-shine"></span>
            BATTLE START
          </button>
        </div>

        <div className="menu-tools">
          <button className="tool-btn bag-btn" onClick={() => setShowBag(true)}>
            🎒 BAG
          </button>
          <button className="tool-btn dex-btn" onClick={onOpenPokedex}>
            📕 POKEDEX
          </button>
        </div>
      </div>

      {showBag && <BagScreen onClose={() => setShowBag(false)} />}
    </div>
  );
}
