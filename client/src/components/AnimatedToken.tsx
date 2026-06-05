import React, { useEffect, useState, useRef } from 'react';
// @ts-ignore — animejs v4.4.1 ESM совместимость через vite optimizeDeps
import anime from 'animejs';
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
  const tokenRef = useRef<HTMLDivElement>(null);
  // @ts-ignore - animejs не предоставляет типы анимаций
  const animationRef = useRef<any | null>(null);

  useEffect(() => {
    if (currentPosition !== targetPosition) {
      setIsAnimating(true);
      animateMovement(currentPosition, targetPosition);
    }
  }, [currentPosition, targetPosition]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, []);

  const animateMovement = (from: number, to: number) => {
    const steps = to >= from ? to - from : (40 - from) + to;
    const durationPerStep = 200;
    const totalDuration = steps * durationPerStep;

    // Создаём массив позиций для анимации через keyframes
    const positions: number[] = [];
    for (let i = 0; i <= steps; i++) {
      positions.push((from + i) % 40);
    }

    if (tokenRef.current) {
      // @ts-ignore — animejs v4.4.1 не предоставляет типы для вызова функции
      animationRef.current = anime({
        targets: tokenRef.current,
        keyframes: positions.map((_pos: number, index: number) => ({
          translateY: [`${index * 0}px`, `${(index + 1) * 0}px`],
          scale: [
            { value: 1.2, duration: 100, easing: 'easeOutQuad' },
            { value: 1, duration: 100, easing: 'easeInQuad' }
          ],
          rotate: { value: '+=360deg', duration: totalDuration, easing: 'linear' }
        })),
        duration: totalDuration,
        easing: 'easeInOutQuad',
        // @ts-ignore — параметры анимации anime.js не типизированы в этой версии
        update: (anim: any) => {
          const progress = anim.progress / 100;
          const currentStepIndex = Math.min(
            Math.floor(progress * steps),
            steps
          );
          setAnimatingPosition(positions[currentStepIndex]);
        },
        complete: () => {
          setIsAnimating(false);
          setAnimatingPosition(to);
          onAnimationComplete?.();
        }
      });
    }
  };

  return (
    <div
      ref={tokenRef}
      className={`${isAnimating ? 'z-50' : ''}`}
      data-player-token={playerId}
      data-position={animatingPosition}
      style={{
        willChange: 'transform',
        transformOrigin: 'center'
      }}
    >
      <TokenPiece 
        color={color} 
        size={size} 
        animate={isAnimating} 
      />
    </div>
  );
};

export default AnimatedToken;
