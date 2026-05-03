import React from 'react';

interface TokenPieceProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const TokenPiece: React.FC<TokenPieceProps> = ({ color, size = 'md', animate = false }) => {
  const getColorClass = () => {
    const colorMap: { [key: string]: string } = {
      red: 'bg-monopoly-red',
      blue: 'bg-monopoly-blue',
      green: 'bg-monopoly-green',
      yellow: 'bg-monopoly-yellow',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const getSizeClass = () => {
    const sizeMap = {
      sm: 'w-4 h-4 text-xs',
      md: 'w-6 h-6 text-sm',
      lg: 'w-8 h-8 text-base',
    };
    return sizeMap[size];
  };

  const getIcon = () => {
    const iconMap: { [key: string]: string } = {
      red: '🎩',      // Шляпа
      blue: '🐱',     // Кот
      green: '🐕',    // Собака
      yellow: '🌉',   // Мост
    };
    return iconMap[color] || '⭐';
  };

  return (
    <div
      className={`${getSizeClass()} ${getColorClass()} rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
        animate ? 'animate-token-move' : ''
      }`}
      style={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
      }}
    >
      <span className="filter drop-shadow-sm">{getIcon()}</span>
    </div>
  );
};

export default TokenPiece;
