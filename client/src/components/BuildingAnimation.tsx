import React, { useEffect, useState } from 'react';

interface BuildingAnimationProps {
  houses: number;
  previousHouses?: number;
  color: string; // Оставляем для совместимости, но не используем
}

const BuildingAnimation: React.FC<BuildingAnimationProps> = ({
  houses,
  previousHouses = 0,
}) => {
  const [animatingHouse, setAnimatingHouse] = useState<number | null>(null);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (houses > previousHouses) {
      // Строительство нового дома
      setAnimatingHouse(houses - 1);
      setShowSparkles(true);

      const timer = setTimeout(() => {
        setAnimatingHouse(null);
        setShowSparkles(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [houses, previousHouses]);

  const renderHouses = () => {
    if (houses === 5) {
      // Отель - один зеленый дом в красном кружке
      return (
        <div className={`relative inline-block ${animatingHouse === 4 ? 'animate-build-house' : ''}`}>
          {/* Красный кружок с белой обводкой */}
          <div className="w-7 h-7 bg-red-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg" style={{ 
            boxShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.3)' 
          }}>
            {/* Зеленый дом внутри */}
            <div className="w-4 h-4 bg-[#1FB25A] border border-white relative" style={{ 
              boxShadow: '0 1px 2px rgba(0,0,0,0.3)' 
            }}>
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent border-b-[#1FB25A]" style={{
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))'
              }}></div>
            </div>
          </div>
          {showSparkles && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="animate-sparkle text-yellow-400 text-xl">✨</span>
            </div>
          )}
        </div>
      );
    }

    // Дома - зеленые с белой обводкой
    return (
      <div className="flex gap-1">
        {Array.from({ length: houses }).map((_, index) => (
          <div
            key={index}
            className={`relative ${animatingHouse === index ? 'animate-build-house' : ''}`}
          >
            <div className="w-4 h-4 bg-[#1FB25A] border-2 border-white relative shadow-md" style={{ 
              boxShadow: '0 2px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.2)' 
            }}>
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent border-b-[#1FB25A]" style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
              }}></div>
            </div>
            {showSparkles && animatingHouse === index && (
              <div className="absolute -top-1 -right-1">
                <span className="animate-sparkle text-yellow-400 text-sm">✨</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (houses === 0) return null;

  return (
    <div className="flex items-center justify-center py-1">
      {renderHouses()}
    </div>
  );
};

export default BuildingAnimation;
