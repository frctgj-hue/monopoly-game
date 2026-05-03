import React, { useEffect, useState } from 'react';
import TokenPiece from './TokenPiece';

interface AnimatedTokenProps {
  playerId: string;
  color: string;
  currentPosition: number;
  targetPosition: number;
  onAnimationComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedToken: React.FC<AnimatedTokenProps> = ({
  playerId,
  color,
  currentPosition,
  targetPosition,
  onAnimationComplete,
  size = 'md'
}) => {
  const [animatingPosition, setAnimatingPosition] = useState(currentPosition);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentPosition !== targetPosition) {
      setIsAnimating(true);
      animateMovement(currentPosition, targetPosition);
    }
  }, [currentPosition, targetPosition]);

  const animateMovement = async (from: number, to: number) => {
    // Вычисляем количество шагов (учитываем переход через "Старт")
    let steps = to >= from ? to - from : (40 - from) + to;

    // Анимируем движение через каждую клетку
    for (let i = 1; i <= steps; i++) {
      const nextPos = (from + i) % 40;
      setAnimatingPosition(nextPos);

      // Задержка между шагами (150ms для плавности)
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    setIsAnimating(false);
    setAnimatingPosition(to);
    onAnimationComplete?.();
  };

  return (
    <div
      className={`transition-all duration-150 ${isAnimating ? 'scale-125 z-50' : 'scale-100'}`}
      data-player-token={playerId}
      data-position={animatingPosition}
    >
      <TokenPiece color={color} size={size} animate={isAnimating} />
    </div>
  );
};

export default AnimatedToken;
