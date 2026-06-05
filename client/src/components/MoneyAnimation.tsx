import React, { useEffect, useState, useRef } from 'react';
// @ts-ignore - animejs@4.4.1 не предоставляет типы
import anime from 'animejs';

interface MoneyAnimationProps {
  amount: number;
  type: 'gain' | 'loss';
  trigger: number;
}

const MoneyAnimation: React.FC<MoneyAnimationProps> = ({ amount, type, trigger }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    if (trigger <= 0) return;

    setShow(true);
    setDisplayAmount(0);

    // Анимация счётчика чисел
    const counterObj = { val: 0 };
    anime({
      targets: counterObj,
      val: amount,
      round: 1,
      duration: 800,
      easing: 'easeOutExpo',
      update: () => {
        setDisplayAmount(counterObj.val);
      },
    });

    // Всплывающая дуга с затуханием
    const arcX = type === 'gain' ? 20 : -20;
    if (textRef.current) {
      anime({
        targets: textRef.current,
        translateX: [0, arcX, arcX * 1.5],
        translateY: [0, -50, -30],
        opacity: [1, 1, 0],
        scale: [0.8, 1.15, 0.95],
        rotate: type === 'gain' ? [0, 8, 4] : [0, -8, -4],
        duration: 1800,
        delay: 200,
        easing: 'easeInOutQuad',
        complete: () => {
          setShow(false);
        },
      });

      // Пульсация свечения
      anime({
        targets: textRef.current,
        textShadow: [
          '0 0 4px currentColor',
          '0 0 16px currentColor',
          '0 0 4px currentColor',
        ],
        duration: 1200,
        easing: 'easeInOutQuad',
        loop: 1,
      });
    }

    return () => {
      setShow(false);
    };
  }, [trigger, amount, type]);

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-1/2 z-50 pointer-events-none"
      style={{ transform: 'translateX(-50%)', overflow: 'visible' }}
    >
      <div
        ref={textRef}
        className="text-2xl font-bold"
        style={{
          color: type === 'gain' ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
          opacity: 1,
        }}
      >
        {type === 'gain' ? '+' : '−'}${Math.abs(displayAmount)}
      </div>
    </div>
  );
};

export default MoneyAnimation;