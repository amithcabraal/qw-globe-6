import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import type { Country, GameStats } from '../types/country';
import ShareButton from './ShareButton';
import ScoreDisplay from './ScoreDisplay';

interface GameOverProps {
  won: boolean;
  country: Country;
  stats: GameStats;
  onRestart: () => void;
  onClose: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ won, country, stats, onRestart, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {won ? '🎉 Congratulations!' : '😔 Game Over'}
            </h2>
            
            <div className="flex items-center justify-center gap-4">
              <div className="text-2xl font-bold text-blue-400">
                {country.name}
              </div>
              <ScoreDisplay score={stats.score} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 my-4">
            <div className="text-center">
              <img 
                src={country.flag} 
                alt={`${country.name} flag`}
                className="w-24 h-auto rounded-md shadow-lg mb-2"
              />
              <div className="text-sm text-gray-400">Capital: {country.capital}</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 w-48"
            >
              <RefreshCw className="w-4 h-4" />
              Play Again
            </button>

            <ShareButton stats={stats} countryName={country.name} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameOver;