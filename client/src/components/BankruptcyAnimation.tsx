import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import type { Player } from '../types/game.types';

interface BankruptcyAnimationProps {
  player: Player;
  onComplete: () => void;
}

const BankruptcyAnimation: React.FC<BankruptcyAnimationProps> = ({ player, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="w-full">
      <div className="text-center">
        <div className="theme-panel p-8 border-4 border-[var(--color-accent-red)] animate-bankruptcy">
          {/* Иконка банкротства */}
          <div className="text-6xl mb-4 text-[var(--color-accent-red)] animate-bankruptcy-shake">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>

          {/* Заголовок */}
          <h1 className="theme-title text-4xl mb-3 text-[var(--color-accent-red)]">
            БАНКРОТСТВО
          </h1>

          {/* Фишка игрока */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg opacity-50 border-4 border-black font-bold"
              style={{ backgroundColor: player.color }}
            >
              {player.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Имя игрока */}
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3 uppercase">
            {player.name}
          </h2>

          {/* Сообщение */}
          <div className="theme-panel-inset p-4">
            <p className="text-lg text-[var(--color-text-muted)] font-medium">
              Игрок обанкротился и выбывает из игры
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankruptcyAnimation;