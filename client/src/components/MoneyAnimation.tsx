import React, { useEffect, useState } from 'react';

interface MoneyAnimationProps {
  amount: number;
  type: 'gain' | 'loss';
  trigger: number; // Изменяется для запуска анимации
}

const MoneyAnimation: React.FC<MoneyAnimationProps> = ({ amount, type, trigger }) => {
  const [show, setShow] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    if (trigger > 0) {
      setShow(true);
      setDisplayAmount(amount);

      const timer = setTimeout(() => {
        setShow(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [trigger, amount]);

  if (!show) return null;

  return (
    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none ${
      type === 'gain' ? 'animate-money-gain' : 'animate-money-loss'
    }`}>
      <div className={`text-2xl font-bold ${
        type === 'gain' ? 'text-green-500' : 'text-red-500'
      } filter drop-shadow-lg`}>
        {type === 'gain' ? '+' : '-'}${Math.abs(displayAmount)}
      </div>
    </div>
  );
};

export default MoneyAnimation;
