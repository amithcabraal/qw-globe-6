import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

interface DifficultySelectorProps {
  onSelect: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 top-[73px] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Select Difficulty</h2>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelect('easy')}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6" />
              <span className="font-bold">EASY</span>
            </div>
            <span className="text-sm opacity-75">Top 30 Countries</span>
          </button>

          <button
            onClick={() => onSelect('medium')}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <Medal className="w-6 h-6" />
              <span className="font-bold">MEDIUM</span>
            </div>
            <span className="text-sm opacity-75">Top 90 Countries</span>
          </button>

          <button
            onClick={() => onSelect('hard')}
            className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6" />
              <span className="font-bold">HARD</span>
            </div>
            <span className="text-sm opacity-75">All Countries</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DifficultySelector;