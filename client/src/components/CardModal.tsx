import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
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
    return type === 'chance' ? <FontAwesomeIcon icon={faQuestion} /> : <FontAwesomeIcon icon={faMoneyBill} />;
  };

  const getCardColor = (type: string) => {
    return type === 'chance'
      ? '#dc3545'
      : '#2d8659';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4 perspective-1000">
        <div
          className={`relative w-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Рубашка карточки (задняя сторона) */}
          <div className="absolute inset-0 backface-hidden">
            <div className="bg-gray-800 border-4 border-black rounded-lg shadow-2xl p-8 h-full">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-8xl mb-4 opacity-30 text-white">
                    {getCardIcon(card.type)}
                  </div>
                  <div className="text-white text-2xl font-bold opacity-50 uppercase">
                    {card.type === 'chance' ? 'ШАНС' : 'КАЗНА'}
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-2">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-white opacity-10"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Лицевая сторона карточки */}
          <div className="backface-hidden rotate-y-180">
            <div className="bg-white rounded-lg shadow-2xl border-4 border-black">
              <div className="p-8 text-white" style={{ backgroundColor: getCardColor(card.type) }}>
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {getCardIcon(card.type)}
                  </div>
                  <h2 className="text-2xl font-bold uppercase">
                    {card.type === 'chance' ? 'Шанс' : 'Общественная казна'}
                  </h2>
                </div>
              </div>

              <div className="p-8">
                <div className="bg-gray-100 border-2 border-gray-300 p-6 mb-6">
                  <p className="text-lg text-gray-800 text-center leading-relaxed font-medium">
                    {card.text}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-4 px-6 text-white rounded-lg font-bold text-lg uppercase transition-all shadow-lg"
                  style={{ backgroundColor: '#dc3545' }}
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
