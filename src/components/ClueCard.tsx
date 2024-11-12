import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Users, Building2, Container, Map, Info, X } from 'lucide-react';

interface ClueCardProps {
  type: string;
  content: string | number;
  revealed: boolean;
  points: number;
  onClick: () => void;
  countryCode?: string;
}

export const ClueCard: React.FC<ClueCardProps> = ({ type, content, revealed, points, onClick, countryCode }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const formatContent = (type: string, content: string | number) => {
    if (type === 'population') {
      return `${new Intl.NumberFormat().format(content as number)} people`;
    }
    return content;
  };

  const getIcon = () => {
    switch (type) {
      case 'flag': return <Flag className="w-5 h-5" />;
      case 'population': return <Users className="w-5 h-5" />;
      case 'capital': return <Building2 className="w-5 h-5" />;
      case 'export': return <Container className="w-5 h-5" />;
      case 'map': return <Map className="w-5 h-5" />;
      case 'funFact': return <Info className="w-5 h-5" />;
      default: return null;
    }
  };

  const getMapUrl = (code: string) => {
    return `https://vemaps.com/uploads/img/large/${code.toLowerCase()}-01.jpg`;
  };

  const handleClick = () => {
    if (!revealed) {
      onClick();
    } else {
      setIsZoomed(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full h-full"
      >
        <div
          onClick={handleClick}
          className={`w-full h-full p-3 rounded-lg ${
            revealed 
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
              : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
          } transition-colors duration-200 flex flex-col items-center justify-center min-h-[120px] relative`}
        >
          {revealed ? (
            <>
              {(type === 'flag' || type === 'map') ? (
                <div className="w-full h-24 relative mb-2">
                  <img 
                    src={type === 'map' ? getMapUrl(countryCode!) : content as string} 
                    alt={type === 'map' ? "Country Map" : "Country Flag"}
                    className="w-full h-full object-contain rounded-md"
                    loading="lazy"
                  />
                </div>
              ) : (
                <>
                  {getIcon()}
                  <div className="text-sm font-semibold text-center mt-2">
                    {formatContent(type, content)}
                  </div>
                </>
              )}
              <div className="mt-2 text-xs text-gray-200 uppercase tracking-wide">
                {type === 'funFact' ? 'FUN FACT' : type.toUpperCase()}
              </div>
            </>
          ) : (
            <>
              {getIcon()}
              <div className="text-xs font-medium text-gray-300 mt-2">
                {type === 'funFact' ? 'FUN FACT' : type.toUpperCase()}
              </div>
              <div className="mt-2 text-xs text-yellow-400">
                -{points} points
              </div>
            </>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-blue-700 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full h-full flex items-center justify-center p-8">
              {(type === 'flag' || type === 'map') ? (
                <img
                  src={type === 'map' ? getMapUrl(countryCode!) : content as string}
                  alt={type === 'map' ? "Country Map" : "Country Flag"}
                  className="max-w-full max-h-full object-contain"
                  style={{ touchAction: 'pinch-zoom' }}
                />
              ) : (
                <div className="bg-blue-600 p-8 rounded-lg max-w-2xl w-full">
                  <div className="flex items-center justify-center mb-4">
                    {getIcon()}
                  </div>
                  <p className="text-2xl text-center font-bold mb-2">
                    {type === 'funFact' ? 'FUN FACT' : type.toUpperCase()}
                  </p>
                  <p className="text-xl text-center">
                    {formatContent(type, content)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClueCard;