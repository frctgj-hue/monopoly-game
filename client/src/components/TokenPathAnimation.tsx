import React, { useEffect, useState } from 'react';
import TokenPiece from './TokenPiece';

interface TokenPathAnimationProps {
  playerId: string;
  color: string;
  fromPosition: number;
  toPosition: number;
  onComplete: () => void;
}

const TokenPathAnimation: React.FC<TokenPathAnimationProps> = ({
  playerId,
  color,
  fromPosition,
  toPosition,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [path, setPath] = useState<number[]>([]);

  useEffect(() => {
    const steps: number[] = [];
    const totalSteps = toPosition >= fromPosition
      ? toPosition - fromPosition
      : (40 - fromPosition) + toPosition;

    for (let i = 0; i <= totalSteps; i++) {
      steps.push((fromPosition + i) % 40);
    }

    setPath(steps);
    setCurrentStep(0);
  }, [fromPosition, toPosition]);

  useEffect(() => {
    if (path.length === 0) return;

    if (currentStep < path.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    } else if (currentStep === path.length - 1) {
      setTimeout(() => {
        onComplete();
      }, 200);
    }
  }, [currentStep, path, onComplete]);

  if (path.length === 0) return null;

  const currentPosition = path[currentStep];
  const cellElement = document.querySelector(`[data-property-id="${currentPosition}"]`);
  if (!cellElement) return null;

  const rect = cellElement.getBoundingClientRect();
  const boardElement = document.querySelector('.board-container');
  const boardRect = boardElement?.getBoundingClientRect();
  if (!boardRect) return null;

  const left = rect.left - boardRect.left + rect.width / 2 - 16;
  const top = rect.top - boardRect.top + rect.height / 2 - 16;

  return (
    <div
      className="absolute z-50 pointer-events-none transition-all duration-150 ease-linear"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        transform: 'translate(-50%, -50%)',
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))'
      }}
      data-animating-token={playerId}
    >
      <div className="animate-token-jump scale-125">
        <TokenPiece color={color} size="md" animate={true} />
      </div>
    </div>
  );
};

export default TokenPathAnimation;