// Fixed import
import { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import './App.css'
import BattleScene from './components/BattleScene';
import MainMenu from './components/MainMenu';
import Pokedex from './components/Pokedex';

function GameContent() {
  const { activePokemonId, startGame, activeBattle, startBattle } = useGame();
  const [view, setView] = useState<'menu' | 'pokedex'>('menu');

  if (!activePokemonId) {
    return (
      <div className="starter-selection">
        <h2>Choose your Starter!</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => startGame('charmander')}>Charmander</button>
          <button onClick={() => startGame('pikachu')}>Pikachu</button>
        </div>
      </div>
    )
  }

  if (activeBattle) {
    return (
      <div className="game-hud">
        <BattleScene />
      </div>
    )
  }

  return (
    <div className="game-hud">
      {view === 'menu' && (
        <MainMenu
          onStartBattle={() => startBattle()} // Random enemy
          onOpenPokedex={() => setView('pokedex')}
        />
      )}
      {view === 'pokedex' && (
        <Pokedex onClose={() => setView('menu')} />
      )}
    </div>
  )
}

import EvolutionScreen from './components/EvolutionScreen';

function App() {
  return (
    <GameProvider>
      <div className="app-container">
        <GameContent />
        <EvolutionScreen />
      </div>
    </GameProvider>
  )
}

export default App
