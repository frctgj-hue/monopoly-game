import React, { useEffect, useState } from 'react';

const CHANCE_COLOR = '#ff183d';
const CARD_COUNT = 8;
const CARD_WIDTH = 140;
const CARD_HEIGHT = 195;

interface CardDeckAnimationProps {
  onComplete?: () => void;
  className?: string;
}

const CardDeckAnimation: React.FC<CardDeckAnimationProps> = ({ onComplete, className = '' }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Запускаем анимацию после монтирования
    const t1 = setTimeout(() => setAnimated(true), 10);
    // Сообщаем о завершении после последней карты (~1.2 сек)
    const t2 = setTimeout(() => onComplete?.(), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1, overflow: 'visible' }}
    >
      {Array.from({ length: CARD_COUNT }).map((_, index) => {
        const center = (CARD_COUNT - 1) / 2;
        
        // 🔥 ТОЛЬКО ГОРИЗОНТАЛЬНОЕ ПОЗИЦИОНИРОВАНИЕ через left:
        // 50% - 70px = центр экрана минус половина карты = точка отсчёта
        // + (index - center) * 75 = разлёт влево/вправо
        const leftPos = `calc(50% - ${CARD_WIDTH / 2}px + ${(index - center) * 75}px)`;
        
        // Анимация: только opacity и scale, никаких translate!
        const delay = index * 0.08;
        const opacity = animated ? 0.35 : 0;
        const scale = animated ? 1 : 0.5;

        return (
          <div
            key={`chance-${index}`}
            className="absolute rounded-lg"
            style={{
              // 🔥 Позиция: только left и top, никаких margin!
              left: leftPos,
              top: '15%',
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              zIndex: CARD_COUNT - index,
              backgroundColor: CHANCE_COLOR,
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              boxShadow: '0 6px 25px rgba(0,0,0,0.35), inset 0 0 30px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
              // 🔥 Анимация: только opacity и scale — НИКАКОГО transform: translate!
              opacity: opacity,
              transform: `scale(${scale})`,
              transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
            }}
          >
            {/* Декоративная рамка */}
            <div style={{ position: 'absolute', inset: '8px', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '6px', pointerEvents: 'none' }} />
            {/* Заголовок */}
            <span style={{ position: 'absolute', top: '12px', fontSize: '9px', fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', fontFamily: 'Georgia, serif', letterSpacing: '2px', textTransform: 'uppercase', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              CHANCE
            </span>
            {/* Знак вопроса */}
            <span style={{ fontSize: '72px', fontWeight: '300', color: 'rgba(255,255,255,0.95)', fontFamily: '"Times New Roman", Georgia, serif', lineHeight: '1', textShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
              ?
            </span>
            {/* Полоска снизу */}
            <div style={{ position: 'absolute', bottom: '12px', width: '40px', height: '3px', background: 'rgba(255,255,255,0.4)', borderRadius: '2px' }} />
            {/* Блик */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)', pointerEvents: 'none', borderRadius: '10px' }} />
          </div>
        );
      })}
    </div>
  );
};

export default CardDeckAnimation;