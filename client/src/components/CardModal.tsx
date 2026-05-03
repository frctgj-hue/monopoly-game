import React, { useState, useEffect } from 'react';
import type { Card } from '../types/game.types';

interface CardModalProps {
  card: Card | null;
  onClose: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (card) {
      // Сначала показываем рубашку, затем переворачиваем
      setIsFlipped(false);
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [card]);

  if (!card) return null;

  const getCardIcon = (type: string) => {
    return type === 'chance' ? '❓' : '💰';
  };

  const getCardColor = (type: string) => {
    return type === 'chance'
      ? 'from-orange-400 to-red-500'
      : 'from-blue-400 to-purple-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="max-w-md w-full mx-4 perspective-1000">
        <div
          className={`relative w-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Рубашка карточки (задняя сторона) */}
          <div className="absolute inset-0 backface-hidden">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl shadow-2xl p-8 h-full">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-8xl mb-4 opacity-30">
                    {getCardIcon(card.type)}
                  </div>
                  <div className="text-white text-2xl font-bold opacity-50">
                    {card.type === 'chance' ? 'ШАНС' : 'КАЗНА'}
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-2">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-white opacity-10 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Лицевая сторона карточки */}
          <div className="backface-hidden rotate-y-180">
            <div className="bg-white rounded-3xl shadow-2xl animate-scale-in">
              <div className={`bg-gradient-to-br ${getCardColor(card.type)} p-8 rounded-t-3xl text-white`}>
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce-soft">
                    {getCardIcon(card.type)}
                  </div>
                  <h2 className="text-2xl font-bold">
                    {card.type === 'chance' ? 'Шанс' : 'Общественная казна'}
                  </h2>
                </div>
              </div>

              <div className="p-8">
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <p className="text-lg text-gray-800 text-center leading-relaxed">
                    {card.text}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Продолжить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
