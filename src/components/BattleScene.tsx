import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { POKEMON_DATABASE } from '../data/pokemon';
import { QUESTIONS } from '../data/questions';
import { Question } from '../types/game';
import VictoryScreen from './VictoryScreen';
import './BattleScene.css';

type BattlePhase = 'idle' | 'attack' | 'throw' | 'shake' | 'caught';

export default function BattleScene() {
  const { activeBattle, activePokemonId, caughtPokemon, endBattle, gainXp, damageEnemy, playerEnergy, capturePokemon } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [battleMessage, setBattleMessage] = useState<string>('');

  // Visual States
  const [isAnimateHit, setIsAnimateHit] = useState(false);
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false);
  const [xpGainText, setXpGainText] = useState<number | null>(null);
  const [showVictory, setShowVictory] = useState(false);

  // Logic Phase
  const [phase, setPhase] = useState<BattlePhase>('idle');

  // V5 Mechanics
  const [playerHp, setPlayerHp] = useState(3);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());

  // Derived
  const playerPokemon = caughtPokemon.find(p => p.instanceId === activePokemonId);
  const playerSpecies = playerPokemon ? POKEMON_DATABASE[playerPokemon.speciesId] : null;
  const enemySpecies = activeBattle ? POKEMON_DATABASE[activeBattle.enemyId] : null;

  useEffect(() => {
    // Pick a random question if none and not ended
    if (!currentQuestion && !showVictory && playerHp > 0 && phase === 'idle') {
      const available = QUESTIONS.filter(q => !usedQuestionIds.has(q.id));
      if (available.length === 0) {
        const r = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
        setCurrentQuestion(r);
      } else {
        const r = available[Math.floor(Math.random() * available.length)];
        setCurrentQuestion(r);
        setUsedQuestionIds(prev => new Set(prev).add(r.id));
      }
      setSelectedAnswer(null);
      setBattleMessage('What will you do?');
    }
  }, [currentQuestion, showVictory, playerHp, usedQuestionIds, phase]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = currentQuestion && index === currentQuestion.correctAnswerIndex;

    if (isCorrect) {
      // Correct
      setIsPlayerAttacking(true);
      setPhase('attack');
      setTimeout(() => setIsPlayerAttacking(false), 500);

      setBattleMessage("It's super effective!");

      // Delay hit slightly
      setTimeout(() => {
        setIsAnimateHit(true);
        damageEnemy(1);
      }, 300);

      setTimeout(() => {
        setIsAnimateHit(false);
        setPhase('idle'); // Animation done

        // Instant XP
        const bonus = 4;
        gainXp(bonus);
        setXpGainText(bonus);
        setTimeout(() => setXpGainText(null), 1500);

        // Check Win
        if (activeBattle && activeBattle.hp - 1 <= 0) {
          setBattleMessage(`${enemySpecies?.name} fainted!`);

          // Start Capture
          setTimeout(() => {
            setBattleMessage("Go! Pokeball!");
            setPhase('throw'); // Start Throw Arc

            // Throw duration (0.8s) + slight buffer
            setTimeout(() => {
              setPhase('shake'); // Ball hits, enemy vanishes, shaking starts

              const shakes = Math.floor(Math.random() * 3) + 1;
              const shakeDuration = 800 * shakes; // 800ms per wobble

              setTimeout(() => {
                setPhase('caught'); // Stops shaking, ball stays or vanishes
                setBattleMessage(`Gotcha! ${enemySpecies?.name} was caught!`);
                capturePokemon(activeBattle.enemyId);

                setTimeout(() => {
                  setShowVictory(true);
                }, 1500);
              }, shakeDuration);

            }, 800);
          }, 1500);
        } else {
          // Next Question
          setCurrentQuestion(null);
          setSelectedAnswer(null);
        }
      }, 1000);

    } else {
      // Incorrect
      setBattleMessage("Attack missed!");
      const nextHp = playerHp - 1;
      setPlayerHp(nextHp);

      setTimeout(() => {
        if (nextHp <= 0) {
          setBattleMessage(`${playerPokemon?.nickname} fainted...`);
          setTimeout(() => endBattle(false), 2000);
        } else {
          setCurrentQuestion(null);
          setSelectedAnswer(null);
        }
      }, 1000);
    }
  };

  if (!activeBattle || !activePokemonId) return null;
  if (!playerSpecies || !enemySpecies) return <div>Loading Battle...</div>;

  return (
    <div className="battle-container">
      {showVictory && (
        <VictoryScreen
          onClose={() => {
            setShowVictory(false);
            endBattle(true);
          }}
          caughtPokemon={enemySpecies}
        />
      )}

      <div className="energy-overlay">
        ⚡ {playerEnergy}
      </div>

      <div className="battle-arena">
        {/* Enemy Side */}
        <div className="enemy-station">
          <div className="stat-box enemy-hud">
            <div className="hud-row-top">
              <span>{enemySpecies.name}</span>
              <span>Lv.5</span>
            </div>
            <div className="hp-bar-container">
              <div className="hp-bar" style={{ width: `${(activeBattle.hp / activeBattle.maxHp) * 100}%` }}></div>
            </div>
          </div>

          <div className="sprite-container">
            {/* Show Enemy only if NOT shaking and NOT caught */}
            {(phase === 'idle' || phase === 'attack' || phase === 'throw') && (
              <img src={enemySpecies.baseImage} className={`enemy-sprite ${isAnimateHit ? 'hit-anim' : ''}`} alt="Enemy" />
            )}

            {/* Show Ball only during Shake or Caught (optional persistence) */}
            {(phase === 'shake') && (
              <div className="captured-ball shaking" style={{ marginTop: '100px' }}></div>
            )}
            {/* If we want to show the ball sitting there after catch: */}
            {(phase === 'caught') && (
              <div className="captured-ball" style={{ marginTop: '100px' }}></div>
            )}
          </div>
        </div>

        {/* Floating Question Bubble - Positioned LEFT of Enemy Station (Enemy is Right 15%) */}
        {currentQuestion && !selectedAnswer && phase === 'idle' && (
          <div className="answer-dialog" style={{
            top: '50px',
            right: '320px',
            position: 'absolute',
            zIndex: 200
          }}>
            {currentQuestion.text}
          </div>
        )}

        {/* Player Side */}
        <div className="player-station">
          <div className={`sprite-container ${isPlayerAttacking ? 'attack-anim' : ''}`}>
            <img src={playerSpecies.baseImage} className="player-sprite" alt="Player" />
          </div>

          <div className="stat-box player-hud">
            <div className="hud-row-top">
              <span>{playerPokemon!.nickname}</span>
              <span>Lv.{playerPokemon!.level}</span>
            </div>
            <div className="hp-bar-container">
              <div className="hp-bar" style={{ width: `${(playerHp / 3) * 100}%` }}></div>
            </div>
            <div className="xp-label-row">
              <span className="xp-text">EXP</span>
              <div className="xp-bar-container">
                <div className="xp-bar" style={{ width: `${(playerPokemon!.xp % 10) * 10}%` }}></div>
              </div>
            </div>
            {xpGainText && <span style={{ color: 'orange', fontWeight: 'bold' }}>+{xpGainText}</span>}
          </div>

          {/* Floating Options Menu - DETACHED from Bottom Console */}
          <div className="player-options">
            {currentQuestion && phase === 'idle' ? (
              <div className="options-grid">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${selectedAnswer === index ? (index === currentQuestion.correctAnswerIndex ? 'correct' : 'wrong') : ''}`}
                    onClick={() => handleAnswer(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="waiting-text">{phase === 'idle' ? 'Loading...' : '...'}</div>
            )}
          </div>
        </div>

        {/* Throwing Animation */}
        {phase === 'throw' && <div className="pokeball-projectile"></div>}

      </div>

      {/* Controls - Floating UI */}
      {/* 1. Run Button (Top Right) */}
      <button className="run-btn-floating" onClick={() => endBattle(false)}>RUN</button>

      {/* Suppress unused var warning while keeping logic intact */}
      <div style={{ display: 'none' }}>{battleMessage}</div>
    </div>
  );
}
