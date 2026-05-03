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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="bg-white rounded-lg shadow-2xl p-12 max-w-xl mx-4 border-4 border-red-600">
          {/* Иконка банкротства */}
          <div className="text-8xl mb-6 text-red-600">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>

          {/* Заголовок */}
          <h1 className="text-5xl font-bold text-red-600 mb-4 uppercase">
            БАНКРОТСТВО
          </h1>

          {/* Фишка игрока */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg opacity-50 border-4 border-black font-bold"
              style={{ backgroundColor: player.color }}
            >
              {player.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Имя игрока */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4 uppercase">
            {player.name}
          </h2>

          {/* Сообщение */}
          <div className="bg-gray-100 border-2 border-gray-300 p-6">
            <p className="text-xl text-gray-800 font-medium">
              Игрок обанкротился и выбывает из игры
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankruptcyAnimation;
