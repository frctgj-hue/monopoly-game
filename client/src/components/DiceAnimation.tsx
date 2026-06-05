import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore - animejs@4.4.1 не предоставляет типы
import anime from 'animejs';
import type { DiceRoll } from '../types/game.types';

interface DiceAnimationProps {
  diceRoll?: DiceRoll;
  isRolling: boolean;
}

const DiceAnimation: React.FC<DiceAnimationProps> = ({ diceRoll, isRolling }) => {
  const [displayDice1, setDisplayDice1] = useState(1);
  const [displayDice2, setDisplayDice2] = useState(1);
  const dice1Ref = useRef<HTMLDivElement>(null);
  const dice2Ref = useRef<HTMLDivElement>(null);
  // @ts-ignore - animejs не предоставляет типы анимаций
  const animationRef = useRef<any[]>([]);

  // Запуск анимации броска
  useEffect(() => {
    if (isRolling) {
      // Останавливаем предыдущие анимации
      animationRef.current.forEach(anim => anim.pause());
      animationRef.current = [];

      // Быстрая смена значений во время броска
      const interval = setInterval(() => {
        setDisplayDice1(Math.floor(Math.random() * 6) + 1);
        setDisplayDice2(Math.floor(Math.random() * 6) + 1);
      }, 80);

      // Анимация вращения и подбрасывания с anime.js
      [dice1Ref.current, dice2Ref.current].forEach((el, idx) => {
        if (!el) return;
        const anim = anime({
          targets: el,
          rotateZ: [0, 360 * (2 + Math.random() * 2)],
          translateY: [0, -20, 0],
          scale: [1, 1.15, 1],
          duration: 1200 + idx * 200,
          easing: 'easeInOutCubic',
        });
        animationRef.current.push(anim);
      });

      return () => {
        clearInterval(interval);
        animationRef.current.forEach(anim => anim.pause());
      };
    } else if (diceRoll) {
      // Фиксируем финальное значение
      setDisplayDice1(diceRoll.dice1);
      setDisplayDice2(diceRoll.dice2);

      // Эффект "приземления" при остановке
      [dice1Ref.current, dice2Ref.current].forEach((el, idx) => {
        if (!el) return;
        const anim = anime({
          targets: el,
          rotateZ: [el.style.rotate || 0, 0],
          translateY: [0, -8, 0],
          scale: [1.1, 1],
          duration: 400,
          delay: idx * 100,
          easing: 'easeOutElastic(1, .6)',
        });
        animationRef.current.push(anim);
      });

      // Свечение при дубле
      if (diceRoll.dice1 === diceRoll.dice2) {
        [dice1Ref.current, dice2Ref.current].forEach(el => {
          if (!el) return;
          anime({
            targets: el,
            boxShadow: ['var(--shadow-md)', '0 0 20px var(--color-gold)', 'var(--shadow-md)'],
            duration: 800,
            easing: 'easeInOutQuad',
          });
        });
      }
    }
  }, [isRolling, diceRoll]);

  const renderDots = (value: number) => {
    const positions = [
      [],
      [[50, 50]],
      [[25, 25], [75, 75]],
      [[25, 25], [50, 50], [75, 75]],
      [[25, 25], [25, 75], [75, 25], [75, 75]],
      [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
      [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]],
    ];

    const dotPositions = positions[value] || [];

    return dotPositions.map((pos, idx) => (
      <div
        key={idx}
        className="absolute w-3 h-3 rounded-full"
        style={{
          left: `${pos[0]}%`,
          top: `${pos[1]}%`,
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--color-bg-primary)',
        }}
      />
    ));
  };

  return (
    <div className="flex gap-3">
      <div
        ref={dice1Ref}
        className="relative w-16 h-16 rounded-lg shadow-lg flex items-center justify-center border-4"
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border-primary)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {renderDots(displayDice1)}
      </div>
      <div
        ref={dice2Ref}
        className="relative w-16 h-16 rounded-lg shadow-lg flex items-center justify-center border-4"
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border-primary)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {renderDots(displayDice2)}
      </div>
    </div>
  );
};

export default DiceAnimation;