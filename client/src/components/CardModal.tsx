import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faMoneyBill, faSkull } from '@fortawesome/free-solid-svg-icons';
import type { Card } from '../types/game.types';

interface CardModalProps {
  card: Card | null;
  playerMoney: number;
  onClose: () => void;
  onBankruptcy: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, playerMoney, onClose, onBankruptcy }) => {
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

  // Проверяем, требует ли карточка оплаты (отрицательное значение)
  const requiresPayment = card.action === 'money' && card.value !== undefined && card.value < 0;
  const paymentAmount = card.value ? Math.abs(card.value) : 0;
  const canAfford = !requiresPayment || playerMoney >= paymentAmount;

  const getCardIcon = (type: string) => {
    return type === 'chance' ? <FontAwesomeIcon icon={faQuestion} /> : <FontAwesomeIcon icon={faMoneyBill} />;
  };

  const getCardColor = (type: string) => {
    return type === 'chance'
      ? '#dc3545'
      : '#2d8659';
  };

  return (
    <div className="w-full perspective-1000">
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

                {/* Предупреждение о недостатке средств */}
                {requiresPayment && !canAfford && (
                  <div className="bg-red-100 border-2 border-red-600 rounded-lg p-3 mb-4">
                    <p className="text-red-800 font-black text-sm uppercase text-center">
                      ⚠️ Недостаточно средств!
                    </p>
                    <p className="text-red-700 text-xs mt-1 text-center">
                      Вы должны объявить банкротство
                    </p>
                  </div>
                )}

                {/* Кнопки */}
                <div className="space-y-3">
                  <button
                    onClick={onClose}
                    disabled={!canAfford}
                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg uppercase transition-all ${
                      canAfford
                        ? 'bg-[#2d6b4a] text-white hover:bg-[#357a55] hover:scale-105 active:scale-95'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Продолжить
                  </button>

                  {requiresPayment && (
                    <button
                      onClick={onBankruptcy}
                      className="w-full py-4 px-6 bg-gradient-to-r from-[#c92a3a] to-[#b01f2e] text-white rounded-lg font-bold text-lg transition-all hover:from-[#b01f2e] hover:to-[#9a1a27] hover:scale-105 active:scale-95 uppercase flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faSkull} />
                      <span>Объявить банкротство</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default CardModal;
