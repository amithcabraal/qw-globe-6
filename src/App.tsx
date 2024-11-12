import React, { useState, useCallback, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { countries } from './data/countries';
import type { Country, Clue, GameStats } from './types/country';
import { Header } from './components/Header';
import { ClueCard } from './components/ClueCard';
import { GuessInput } from './components/GuessInput';
import { GameOver } from './components/GameOver';
import { ScoreDisplay } from './components/ScoreDisplay';
import DifficultySelector from './components/DifficultySelector';
import { CLUE_POINTS, calculateScore } from './utils/scoring';
import { getRandomCountry } from './utils/countrySelection';

const initialClues: Clue[] = [
  { type: 'flag', revealed: false, points: CLUE_POINTS.flag },
  { type: 'map', revealed: false, points: CLUE_POINTS.map },
  { type: 'population', revealed: false, points: CLUE_POINTS.population },
  { type: 'capital', revealed: false, points: CLUE_POINTS.capital },
  { type: 'export', revealed: false, points: CLUE_POINTS.export },
  { type: 'funFact', revealed: false, points: CLUE_POINTS.funFact }
];

export const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [usedCountries, setUsedCountries] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('usedCountries');
    return stored ? new Set(JSON.parse(stored)) : new Set<string>();
  });

  const [startTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [country, setCountry] = useState<Country | null>(null);
  const [clues, setClues] = useState<Clue[]>(initialClues);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(500);

  const getFilteredCountries = useCallback((diff: 'easy' | 'medium' | 'hard') => {
    const sortedCountries = [...countries].sort((a, b) => b.population - a.population);
    switch (diff) {
      case 'easy':
        return sortedCountries.slice(0, 30);
      case 'medium':
        return sortedCountries.slice(0, 90);
      case 'hard':
        return sortedCountries;
    }
  }, []);

  const initializeGame = useCallback((diff: 'easy' | 'medium' | 'hard') => {
    const filteredCountries = getFilteredCountries(diff);
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('c');
    if (shareId) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setCountry(getRandomCountry(usedCountries, filteredCountries, shareId));
    setDifficulty(diff);
  }, [getFilteredCountries, usedCountries]);

  const handleDifficultySelect = useCallback((diff: 'easy' | 'medium' | 'hard') => {
    initializeGame(diff);
  }, [initializeGame]);

  useEffect(() => {
    if (gameOver && won && country) {
      const newUsedCountries = new Set(usedCountries);
      newUsedCountries.add(country.name);
      setUsedCountries(newUsedCountries);
      localStorage.setItem('usedCountries', JSON.stringify([...newUsedCountries]));
      setElapsedTime((Date.now() - startTime) / 1000);
    }
  }, [gameOver, won, country, usedCountries, startTime]);

  const handleRevealClue = useCallback((index: number) => {
    if (gameOver) return;
    
    setClues(prev => prev.map((clue, i) => 
      i === index ? { ...clue, revealed: true } : clue
    ));
    
    setScore(prev => prev - clues[index].points);
  }, [gameOver, clues]);

  const handleGuess = useCallback((guess: string) => {
    if (!country) return;
    
    const normalizedGuess = guess.toLowerCase();
    const normalizedCountry = country.name.toLowerCase();
    
    setAttempts(prev => {
      const newAttempts = [...prev, guess];
      
      if (normalizedGuess === normalizedCountry) {
        const finalScore = calculateScore(
          clues.filter(c => c.revealed).length,
          newAttempts.length
        );
        setScore(finalScore);
        setWon(true);
        setGameOver(true);
        setShowGameOver(true);
      } else if (newAttempts.length >= 6 || clues.every(c => c.revealed)) {
        setScore(0);
        setGameOver(true);
        setShowGameOver(true);
      }
      
      return newAttempts;
    });
  }, [country, clues]);

  const handleGiveUp = useCallback(() => {
    setScore(0);
    setGameOver(true);
    setShowGameOver(true);
    setWon(false);
    setElapsedTime((Date.now() - startTime) / 1000);
  }, [startTime]);

  const getGameStats = useCallback((): GameStats => ({
    attempts: attempts.length,
    score,
    cluesRevealed: clues.filter(c => c.revealed).length,
    won,
    elapsedTime
  }), [attempts.length, score, clues, won, elapsedTime]);

  const restartGame = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      
      {!difficulty ? (
        <div className="flex-1">
          <DifficultySelector onSelect={handleDifficultySelect} />
        </div>
      ) : !country ? (
        <div className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      ) : (
        <main className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-400">
              Attempts: {attempts.length}/6
            </div>
            <ScoreDisplay score={score} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 flex-1 max-w-4xl mx-auto w-full">
            {clues.map((clue, index) => (
              <ClueCard
                key={clue.type}
                type={clue.type}
                content={
                  clue.type === 'flag' ? country.flag :
                  clue.type === 'population' ? country.population :
                  clue.type === 'capital' ? country.capital :
                  clue.type === 'export' ? country.mainExport :
                  clue.type === 'funFact' ? country.funFact :
                  ''
                }
                revealed={clue.revealed}
                points={clue.points}
                onClick={() => handleRevealClue(index)}
                countryCode={country.code}
              />
            ))}
          </div>

          {attempts.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2 justify-center">
              {attempts.map((attempt, i) => (
                <span key={i} className="px-2 py-1 bg-gray-700 rounded text-sm">
                  {attempt}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 items-center justify-center">
            {gameOver ? (
              <button
                onClick={restartGame}
                className="w-32 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Play Again
              </button>
            ) : (
              <GuessInput 
                onGuess={handleGuess}
                onGiveUp={handleGiveUp}
                disabled={gameOver}
                previousGuesses={attempts}
              />
            )}
          </div>
        </main>
      )}

      {showGameOver && country && (
        <GameOver
          won={won}
          country={country}
          stats={getGameStats()}
          onRestart={restartGame}
          onClose={() => setShowGameOver(false)}
        />
      )}
    </div>
  );
};

export default App;