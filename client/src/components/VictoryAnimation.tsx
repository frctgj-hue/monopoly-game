import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faMoneyBill, faHouse } from '@fortawesome/free-solid-svg-icons';
import type { Player } from '../types/game.types';

interface VictoryAnimationProps {
  winner: Player;
  onClose: () => void;
}

interface Confetti {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

const VictoryAnimation: React.FC<VictoryAnimationProps> = ({ winner, onClose }) => {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    // Генерируем конфетти
    const confettiColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4'];
    const newConfetti: Confetti[] = [];

    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)]
      });
    }

    setConfetti(newConfetti);
  }, []);

  return (
    <div className="relative w-full">
      {/* Конфетти */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="absolute top-0 w-3 h-3 animate-confetti"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`
          }}
        />
      ))}

      {/* Основное содержимое */}
      <div className="relative z-10 text-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 border-4 border-black">
          {/* Корона */}
          <div className="text-7xl mb-4">
            <FontAwesomeIcon icon={faCrown} className="text-yellow-500" />
          </div>

          {/* Заголовок */}
          <h1 className="text-4xl font-bold text-gray-900 mb-3 uppercase">
            ПОБЕДА!
          </h1>

          {/* Фишка победителя */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-black font-bold"
              style={{ backgroundColor: winner.color }}
            >
              {winner.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Имя победителя */}
          <h2 className="text-3xl font-bold text-gray-800 mb-3 uppercase">
            {winner.name}
          </h2>

          {/* Статистика */}
          <div className="bg-gray-100 border-2 border-gray-300 p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-700 text-xs mb-1 font-bold uppercase">Капитал</div>
                <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faMoneyBill} className="text-xl" />
                  ${winner.money}
                </div>
              </div>
              <div>
                <div className="text-gray-700 text-xs mb-1 font-bold uppercase">Недвижимость</div>
                <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faHouse} className="text-xl" />
                  {winner.properties.length}
                </div>
              </div>
            </div>
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="w-full py-3 px-6 text-white rounded-lg font-bold text-lg transition-all shadow-lg uppercase"
            style={{ backgroundColor: '#dc3545' }}
          >
            Завершить игру
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryAnimation;
