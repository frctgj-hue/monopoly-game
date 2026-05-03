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
    // Анимация длится 2 секунды, затем вызываем callback
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
        <div className="bg-white rounded-lg shadow-2xl p-8 border-4 border-red-600">
          {/* Иконка банкротства */}
          <div className="text-6xl mb-4 text-red-600">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>

          {/* Заголовок */}
          <h1 className="text-4xl font-bold text-red-600 mb-3 uppercase">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-3 uppercase">
            {player.name}
          </h2>

          {/* Сообщение */}
          <div className="bg-gray-100 border-2 border-gray-300 p-4">
            <p className="text-lg text-gray-800 font-medium">
              Игрок обанкротился и выбывает из игры
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankruptcyAnimation;
