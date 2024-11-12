import React from 'react';
import { Globe, Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from '../hooks/useFullscreen';

export const Header: React.FC = () => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <header className="border-b border-gray-700 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Globe className="w-8 h-8 mr-2 text-blue-400" />
          <h1 className="text-3xl font-bold tracking-wider text-white">QuizWordz Globe</h1>
        </div>
        <button
          onClick={toggleFullscreen}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-6 h-6 text-gray-300" />
          ) : (
            <Maximize2 className="w-6 h-6 text-gray-300" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;