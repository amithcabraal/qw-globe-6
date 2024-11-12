import React, { useState, useRef, useEffect } from 'react';
import { Search, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { countries } from '../data/countries';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  onGiveUp: () => void;
  disabled: boolean;
  previousGuesses: string[];
}

export const GuessInput: React.FC<GuessInputProps> = ({ onGuess, onGiveUp, disabled, previousGuesses }) => {
  const [guess, setGuess] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showError, setShowError] = useState(false);
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const getSuggestions = (input: string): string[] => {
    if (!input.trim()) return [];
    
    const searchTerm = input.toLowerCase();
    const matches = new Set<string>();

    countries.forEach(country => {
      if (country.name.toLowerCase().includes(searchTerm)) {
        matches.add(country.name);
      }
      country.aliases?.forEach(alias => {
        if (alias.toLowerCase().includes(searchTerm)) {
          matches.add(country.name);
        }
      });
    });

    return Array.from(matches).slice(0, 5);
  };

  useEffect(() => {
    setSuggestions(getSuggestions(guess));
    setSelectedIndex(-1);
  }, [guess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedGuess = guess.trim();
    
    if (normalizedGuess && !previousGuesses.includes(normalizedGuess)) {
      onGuess(normalizedGuess);
      setGuess('');
      setSuggestions([]);
    } else if (previousGuesses.includes(normalizedGuess)) {
      setShowError(true);
      setTimeout(() => setShowError(false), 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex > -1) {
      e.preventDefault();
      const selectedGuess = suggestions[selectedIndex];
      if (!previousGuesses.includes(selectedGuess)) {
        setGuess(selectedGuess);
        onGuess(selectedGuess);
        setSuggestions([]);
        setSelectedIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setSelectedIndex(-1);
      setShowGiveUpConfirm(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!previousGuesses.includes(suggestion)) {
      setGuess(suggestion);
      onGuess(suggestion);
      setSuggestions([]);
      setSelectedIndex(-1);
      inputRef.current?.focus();
    }
  };

  const handleGiveUpClick = () => {
    if (showGiveUpConfirm) {
      setShowGiveUpConfirm(false);
      onGiveUp();
    } else {
      setShowGiveUpConfirm(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setSelectedIndex(-1);
      }
      
      const giveUpButton = document.getElementById('give-up-button');
      if (!giveUpButton?.contains(event.target as Node)) {
        setShowGiveUpConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex gap-2 w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative flex-1">
        <motion.div
          animate={showError ? {
            x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
          } : {}}
          transition={{ duration: 0.4 }}
        >
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? "Game Over" : "Guess the country..."}
            className={`w-full px-4 py-3 bg-gray-700 rounded-lg pr-12 focus:outline-none focus:ring-2 
              ${showError ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-blue-500'}
              disabled:opacity-50`}
            autoComplete="off"
            aria-label="Country guess input"
          />
        </motion.div>
        
        <button
          type="submit"
          disabled={disabled || !guess.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-white disabled:opacity-50"
          aria-label="Submit guess"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {!disabled && (
        <motion.button
          id="give-up-button"
          onClick={handleGiveUpClick}
          className={`py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-32
            ${showGiveUpConfirm 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <XCircle className="w-5 h-5" />
          {showGiveUpConfirm ? 'Confirm?' : 'Give Up'}
        </motion.button>
      )}

      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-md"
          >
            {suggestions.map((suggestion, index) => {
              const isPreviousGuess = previousGuesses.includes(suggestion);
              return (
                <motion.button
                  key={suggestion}
                  type="button"
                  onClick={() => !isPreviousGuess && handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-2 text-left transition-colors flex items-center justify-between
                    ${isPreviousGuess ? 'cursor-not-allowed text-gray-500' : 'hover:bg-gray-700'}
                    ${index === selectedIndex ? 'bg-gray-700' : ''}`}
                  whileHover={!isPreviousGuess ? { backgroundColor: 'rgba(55, 65, 81, 1)' } : {}}
                  transition={{ duration: 0.2 }}
                  aria-label={`Suggest ${suggestion}${isPreviousGuess ? ' (already guessed)' : ''}`}
                >
                  <span className={isPreviousGuess ? 'line-through' : ''}>
                    {suggestion}
                  </span>
                  {isPreviousGuess && (
                    <XCircle className="w-4 h-4 text-gray-500" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {showError && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -bottom-6 left-0 text-sm text-red-400"
          role="alert"
        >
          Already guessed this country
        </motion.div>
      )}
    </div>
  );
};

export default GuessInput;