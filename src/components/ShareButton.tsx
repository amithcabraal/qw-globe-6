import React from 'react';
import { Share2 } from 'lucide-react';
import type { GameStats } from '../types/country';
import { generateShareableLink } from '../utils/countrySelection';

interface ShareButtonProps {
  stats: GameStats;
  countryName: string;
  isDaily?: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({ stats, countryName, isDaily = false }) => {
  const generateShareText = () => {
    const emoji = stats.won ? '🎉' : '😔';
    const shareableLink = generateShareableLink(countryName, isDaily);
    const timeStr = stats.elapsedTime.toFixed(2);
    
    return `${emoji} QuizWordz Globe ${new Date().toISOString().split('T')[0]}

Score: ${stats.score} points
Time: ${timeStr} seconds
Clues used: ${stats.cluesRevealed}/6
Attempts: ${stats.attempts}

Play this country: ${shareableLink}`;
  };

  const handleShare = async () => {
    const text = generateShareText();
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          fallbackShare(text);
        }
      }
    } else {
      fallbackShare(text);
    }
  };

  const fallbackShare = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Results copied to clipboard!');
  };

  return (
    <button
      onClick={handleShare}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 w-32"
    >
      <Share2 className="w-4 h-4" />
      Share
    </button>
  );
};

export default ShareButton;