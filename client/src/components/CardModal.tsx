import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore — animejs v4.4.1 ESM совместимость через vite optimizeDeps
import anime from 'animejs';
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
  const [isClosing, setIsClosing] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (card) {
      setIsFlipped(false);
      setIsClosing(false);
      const timer = setTimeout(() => setIsFlipped(true), 300);
      return () => clearTimeout(timer);
    }
  }, [card]);

  // Анимация появления карточки с помощью anime.js
  useEffect(() => {
    // @ts-ignore - animejs не предоставляет типы анимаций
    let animation: any | null = null;
    
    if (card && modalRef.current) {
      const el = modalRef.current;
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px) scale(0.95)';
      
      animation = anime({
        targets: el,
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.95, 1],
        duration: 500,
        easing: 'easeOutBack(1.5, 1.2)',
        delay: 100
      });
    }
    
    return () => {
      if (animation) animation.pause();
    };
  }, [card]);

  if (!card) return null;

  const requiresPayment = card.action === 'money' && card.value !== undefined && card.value < 0;
  const paymentAmount = card.value ? Math.abs(card.value) : 0;
  const canAfford = !requiresPayment || playerMoney >= paymentAmount;

  const getCardIcon = (type: string) => {
    return type === 'chance' ? <FontAwesomeIcon icon={faQuestion} /> : <FontAwesomeIcon icon={faMoneyBill} />;
  };

  const getCardGradient = (type: string) => {
    return type === 'chance'
      ? 'linear-gradient(135deg, #ff6b9d 0%, #c44582 100%)'
      : 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
  };

  // Обработчик закрытия с анимацией исчезновения
  const handleClose = () => {
    if (isClosing || !modalRef.current) {
      onClose();
      return;
    }
    
    setIsClosing(true);
    
    anime({
      targets: modalRef.current,
      opacity: [1, 0],
      translateY: [0, 30],
      scale: [1, 0.95],
      duration: 300,
      easing: 'easeInOutQuad',
      complete: () => {
        setIsFlipped(false);
        setIsClosing(false);
        onClose();
      }
    });
  };

  return (
    <div className="w-full perspective-1000" ref={modalRef}>
      <div
        className={`relative w-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Рубашка карточки */}
        <div className="absolute inset-0 backface-hidden">
          <div className="theme-panel border-4 border-black rounded-lg shadow-2xl p-8 h-full">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-8xl mb-4 opacity-30 text-[var(--color-text-muted)]">
                  {getCardIcon(card.type)}
                </div>
                <div className="theme-text-muted text-2xl font-bold uppercase">
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

        {/* Лицевая сторона */}
        <div className="backface-hidden rotate-y-180">
          <div className="theme-panel rounded-lg shadow-2xl border-4 border-black overflow-hidden">
            <div className="p-8 text-white" style={{ background: getCardGradient(card.type) }}>
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {getCardIcon(card.type)}
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-wider">
                  {card.type === 'chance' ? 'Шанс' : 'Общественная казна'}
                </h2>
              </div>
            </div>

            <div className="p-8 theme-bg-secondary">
              <div className="theme-panel-inset p-6 mb-6">
                <p className="text-lg text-[var(--color-text-primary)] text-center leading-relaxed font-medium">
                  {card.text}
                </p>
              </div>

              {requiresPayment && !canAfford && (
                <div className="theme-toast error mb-4 p-3">
                  <p className="font-black text-sm uppercase text-center">
                    ⚠️ Недостаточно средств!
                  </p>
                  <p className="text-xs mt-1 text-center theme-text-muted">
                    Вы должны объявить банкротство
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleClose}
                  disabled={!canAfford}
                  className={`theme-btn theme-btn-secondary w-full py-4 px-6 rounded-lg font-bold text-lg uppercase transition-all ${
                    canAfford ? 'hover:scale-105 active:scale-95' : 'opacity-30 cursor-not-allowed'
                  }`}
                >
                  Продолжить
                </button>

                {requiresPayment && (
                  <button
                    onClick={() => {
                      if (isClosing) return;
                      setIsClosing(true);
                      if (modalRef.current) {
                        anime({
                          targets: modalRef.current,
                          opacity: [1, 0],
                          translateY: [0, 30],
                          scale: [1, 0.95],
                          duration: 300,
                          easing: 'easeInOutQuad',
                          complete: onBankruptcy
                        });
                      } else {
                        onBankruptcy();
                      }
                    }}
                    className="theme-btn w-full py-4 px-6 rounded-lg font-bold text-lg uppercase transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #c92a3a 0%, #b01f2e 100%)',
                      color: '#fff',
                      boxShadow: '0 4px 16px rgba(201, 42, 58, 0.3)'
                    }}
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