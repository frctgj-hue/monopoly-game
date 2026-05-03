import React, { useEffect, useState } from 'react';
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
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
      <div className="relative z-10 text-center animate-victory-bounce">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl mx-4">
          {/* Корона */}
          <div className="text-9xl mb-6 animate-crown-spin">
            👑
          </div>

          {/* Заголовок */}
          <h1 className="font-display text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 mb-4 animate-victory-text">
            ПОБЕДА!
          </h1>

          {/* Фишка победителя */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg animate-winner-pulse"
              style={{ backgroundColor: winner.color }}
            >
              {winner.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Имя победителя */}
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {winner.name}
          </h2>

          {/* Статистика */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-600 text-sm mb-1">Капитал</div>
                <div className="text-3xl font-bold text-green-600">
                  ${winner.money}
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-sm mb-1">Недвижимость</div>
                <div className="text-3xl font-bold text-blue-600">
                  {winner.properties.length}
                </div>
              </div>
            </div>
          </div>

          {/* Фейерверк эмодзи */}
          <div className="flex justify-center gap-4 text-5xl mb-8">
            <span className="animate-firework" style={{ animationDelay: '0s' }}>🎉</span>
            <span className="animate-firework" style={{ animationDelay: '0.2s' }}>🎊</span>
            <span className="animate-firework" style={{ animationDelay: '0.4s' }}>✨</span>
            <span className="animate-firework" style={{ animationDelay: '0.6s' }}>🎆</span>
            <span className="animate-firework" style={{ animationDelay: '0.8s' }}>🎇</span>
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="w-full py-4 px-8 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-xl font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Завершить игру
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryAnimation;
