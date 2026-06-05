import React, { useEffect, useState } from 'react';

interface BuildingAnimationProps {
  houses: number;
  previousHouses?: number;
  color?: string;
}

const BuildingAnimation: React.FC<BuildingAnimationProps> = ({
  houses,
  previousHouses = 0,
}) => {
  const [animatingHouse, setAnimatingHouse] = useState<number | null>(null);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (houses > previousHouses) {
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
      return (
        <div className={`relative inline-block ${animatingHouse === 4 ? 'animate-build-house' : ''}`}>
          <div className="w-6 h-6 border-2 border-black relative rounded-sm" style={{
            backgroundColor: 'var(--color-accent-red)',
            boxShadow: '0 3px 6px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
            transform: 'rotate(-2deg)'
          }}>
            <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[7px] border-l-transparent border-r-transparent" style={{
              borderBottomColor: 'var(--color-accent-red)',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))'
            }}></div>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent opacity-30 rounded-t-sm"></div>
          </div>
          {showSparkles && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="animate-sparkle" style={{ color: 'var(--color-text-gold)', fontSize: '1.25rem' }}>✨</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex gap-1.5">
        {Array.from({ length: houses }).map((_, index) => (
          <div key={index} className={`relative ${animatingHouse === index ? 'animate-build-house' : ''}`}>
            <div
              className="w-5 h-5 border-2 border-black relative rounded-sm"
              style={{
                backgroundColor: 'var(--color-accent-green)',
                boxShadow: '0 3px 5px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                transform: `rotate(${index % 2 === 0 ? '-3deg' : '3deg'})`
              }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent" style={{
                borderBottomColor: 'var(--color-accent-green)',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))'
              }}></div>
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent opacity-30 rounded-t-sm"></div>
            </div>
            {showSparkles && animatingHouse === index && (
              <div className="absolute -top-1 -right-1">
                <span className="animate-sparkle" style={{ color: 'var(--color-text-gold)', fontSize: '0.875rem' }}>✨</span>
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