import React, { useEffect, useState } from 'react';
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
      <div className="text-center animate-bankruptcy-shake">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-12 max-w-xl mx-4 border-4 border-red-600">
          {/* Иконка банкротства */}
          <div className="text-8xl mb-6 animate-bankruptcy">
            💸
          </div>

          {/* Заголовок */}
          <h1 className="font-display text-5xl font-bold text-red-500 mb-4">
            БАНКРОТСТВО
          </h1>

          {/* Фишка игрока */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg opacity-50 animate-bankruptcy"
              style={{ backgroundColor: player.color }}
            >
              {player.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Имя игрока */}
          <h2 className="text-3xl font-bold text-white mb-4">
            {player.name}
          </h2>

          {/* Сообщение */}
          <div className="bg-red-900 bg-opacity-30 rounded-2xl p-6 mb-6">
            <p className="text-xl text-red-200">
              Игрок обанкротился и выбывает из игры
            </p>
          </div>

          {/* Эмодзи */}
          <div className="flex justify-center gap-4 text-4xl opacity-70">
            <span>😢</span>
            <span>💔</span>
            <span>📉</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankruptcyAnimation;
