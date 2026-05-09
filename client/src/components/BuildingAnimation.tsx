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
      // Отель - темно-зеленый стикер-дом в красном кружке
      return (
        <div className={`relative inline-block ${animatingHouse === 4 ? 'animate-build-house' : ''}`}>
          {/* Красный кружок с эффектом стикера */}
          <div className="w-8 h-8 bg-red-600 rounded-full border-3 border-white flex items-center justify-center" style={{ 
            boxShadow: '0 3px 6px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)',
            transform: 'rotate(-2deg)'
          }}>
            {/* Темно-зеленый дом-стикер внутри */}
            <div className="w-5 h-5 bg-[#1a7a3e] border-2 border-white relative rounded-sm" style={{ 
              boxShadow: '0 2px 3px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.4)',
              transform: 'rotate(2deg)'
            }}>
              {/* Крыша */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#1a7a3e]" style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))'
              }}></div>
              {/* Блик на доме */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent opacity-30 rounded-t-sm"></div>
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

    // Дома - темно-зеленые стикеры с эффектом наклейки
    return (
      <div className="flex gap-1.5">
        {Array.from({ length: houses }).map((_, index) => (
          <div
            key={index}
            className={`relative ${animatingHouse === index ? 'animate-build-house' : ''}`}
          >
            {/* Дом-стикер с небольшим поворотом */}
            <div 
              className="w-5 h-5 bg-[#1a7a3e] border-2 border-white relative rounded-sm" 
              style={{ 
                boxShadow: '0 3px 5px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                transform: `rotate(${index % 2 === 0 ? '-3deg' : '3deg'})`
              }}
            >
              {/* Крыша */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#1a7a3e]" style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))'
              }}></div>
              {/* Блик на доме для эффекта стикера */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent opacity-30 rounded-t-sm"></div>
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
