import React, { useState, useEffect } from 'react';
import type { DiceRoll } from '../types/game.types';

interface DiceAnimationProps {
  diceRoll?: DiceRoll;
  isRolling: boolean;
}

const DiceAnimation: React.FC<DiceAnimationProps> = ({ diceRoll, isRolling }) => {
  const [displayDice1, setDisplayDice1] = useState(1);
  const [displayDice2, setDisplayDice2] = useState(1);

  useEffect(() => {
    if (isRolling) {
      // Анимация случайных чисел во время броска
      const interval = setInterval(() => {
        setDisplayDice1(Math.floor(Math.random() * 6) + 1);
        setDisplayDice2(Math.floor(Math.random() * 6) + 1);
      }, 100);

      return () => clearInterval(interval);
    } else if (diceRoll) {
      // Показываем финальный результат
      setDisplayDice1(diceRoll.dice1);
      setDisplayDice2(diceRoll.dice2);
    }
  }, [isRolling, diceRoll]);

  const renderDots = (value: number) => {
    const positions = [
      [], // 0 (не используется)
      [[50, 50]], // 1
      [[25, 25], [75, 75]], // 2
      [[25, 25], [50, 50], [75, 75]], // 3
      [[25, 25], [25, 75], [75, 25], [75, 75]], // 4
      [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]], // 5
      [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]], // 6
    ];

    const dotPositions = positions[value] || [];

    return dotPositions.map((pos, idx) => (
      <div
        key={idx}
        className="absolute w-3 h-3 bg-gray-800 rounded-full"
        style={{
          left: `${pos[0]}%`,
          top: `${pos[1]}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    ));
  };

  return (
    <div className="flex gap-3">
      <div
        className={`relative w-16 h-16 bg-white border-3 border-gray-800 rounded-lg shadow-lg flex items-center justify-center ${
          isRolling ? 'animate-dice-roll' : 'animate-bounce-soft'
        }`}
      >
        {renderDots(displayDice1)}
      </div>
      <div
        className={`relative w-16 h-16 bg-white border-3 border-gray-800 rounded-lg shadow-lg flex items-center justify-center ${
          isRolling ? 'animate-dice-roll' : 'animate-bounce-soft'
        }`}
        style={{ animationDelay: '0.1s' }}
      >
        {renderDots(displayDice2)}
      </div>
    </div>
  );
};

export default DiceAnimation;
