import React from 'react';

interface TokenPieceProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const TokenPiece: React.FC<TokenPieceProps> = ({ color, size = 'md', animate = false }) => {
  const getSizeStyle = () => {
    const styleMap: { [key: string]: React.CSSProperties } = {
      sm: { width: '16px', height: '16px', fontSize: '12px' },
      md: { width: '24px', height: '24px', fontSize: '14px' },
      lg: { width: '48px', height: '48px', fontSize: '20px' },
    };
    return styleMap[size] || styleMap.md;
  };

  const getIcon = () => {
    const iconMap: { [key: string]: string } = {
      red: '🎩',
      blue: '🐱',
      green: '🐕',
      yellow: '🌉',
    };
    return iconMap[color] || '⭐';
  };

  const getBgColor = () => {
    const colorMap: { [key: string]: string } = {
      red: '#DC143C',
      blue: '#0078D7',
      green: '#1FB25A',
      yellow: '#FEF200',
    };
    return colorMap[color] || '#6b7280';
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center border-2 border-white ${
        animate ? 'animate-token-move' : ''
      }`}
      style={{
        ...getSizeStyle(),
        backgroundColor: getBgColor(),
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
      }}
    >
      <span className="filter drop-shadow-sm">{getIcon()}</span>
    </div>
  );
};

export default TokenPiece;