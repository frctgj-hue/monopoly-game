import React, { useEffect, useState } from 'react';

const CHANCE_COLOR = '#ff183d';
const CARD_COUNT = 15;
const CARD_WIDTH = 170;
const CARD_HEIGHT = 238;

const FAN_MIN_ANGLE = -70;
const FAN_MAX_ANGLE = 70;
const FAN_ANCHOR_X = '50%';
const FAN_ANCHOR_Y = '65%'; // 🔥 Подняли веер чуть выше

interface CardDeckAnimationProps {
  onComplete?: () => void;
  className?: string;
}

const CardDeckAnimation: React.FC<CardDeckAnimationProps> = ({ onComplete, className = '' }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimated(true), 10);
    const t2 = setTimeout(() => onComplete?.(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1, overflow: 'visible' }}
    >
      {Array.from({ length: CARD_COUNT }).map((_, index) => {
        const angle = FAN_MIN_ANGLE + (index / (CARD_COUNT - 1)) * (FAN_MAX_ANGLE - FAN_MIN_ANGLE);

        const normalizedPos = (index / (CARD_COUNT - 1)) * 2 - 1;
        const arcLift = -Math.pow(normalizedPos, 2) * 30;

        const delay = index * 0.045;
        const currentAngle = animated ? angle : 0;
        const opacity = animated ? 1 : 0;
        const scale = animated ? 1 : 0.5;
        const liftY = animated ? (-40 + arcLift) : 0;

        const edgeDim = 1 - Math.abs(normalizedPos) * 0.18;
        const shadowAngleOffset = angle * 0.3;

        return (
          <div
            key={`chance-${index}`}
            style={{
              position: 'absolute',
              left: FAN_ANCHOR_X,
              top: FAN_ANCHOR_Y,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              zIndex: index,
              backgroundColor: CHANCE_COLOR,
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              boxShadow: `${shadowAngleOffset}px 8px 30px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.12)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px',
              boxSizing: 'border-box',
              overflow: 'hidden',
              transformOrigin: 'center bottom',
              opacity: opacity * edgeDim,
              transform: `translateX(-50%) translateY(${liftY}px) scale(${scale}) rotate(${currentAngle}deg)`,
              transition: [
                `opacity 0.5s ease-out ${delay}s`,
                `transform 0.75s cubic-bezier(0.34, 1.35, 0.64, 1) ${delay}s`,
              ].join(', '),
            }}
          >
            <div style={{ position: 'absolute', inset: '9px', border: '1px solid rgba(255,255,255,0.28)', borderRadius: '7px', pointerEvents: 'none' }} />

            <span style={{ position: 'absolute', top: '13px', fontSize: '10px', fontWeight: 'bold', color: 'rgba(255,255,255,0.92)', fontFamily: 'Georgia, serif', letterSpacing: '2.5px', textTransform: 'uppercase', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              CHANCE
            </span>

            <span style={{ position: 'absolute', bottom: '13px', fontSize: '10px', fontWeight: 'bold', color: 'rgba(255,255,255,0.92)', fontFamily: 'Georgia, serif', letterSpacing: '2.5px', textTransform: 'uppercase', textShadow: '0 1px 3px rgba(0,0,0,0.4)', transform: 'rotate(180deg)' }}>
              CHANCE
            </span>

            <span style={{ fontSize: '90px', fontWeight: '300', color: 'rgba(255,255,255,0.95)', fontFamily: '"Times New Roman", Georgia, serif', lineHeight: '1', textShadow: '0 5px 16px rgba(0,0,0,0.3)', userSelect: 'none' }}>
              ?
            </span>

            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '14px', height: '14px', borderTop: '2px solid rgba(255,255,255,0.4)', borderLeft: '2px solid rgba(255,255,255,0.4)', borderRadius: '2px 0 0 0' }} />
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '14px', height: '14px', borderTop: '2px solid rgba(255,255,255,0.4)', borderRight: '2px solid rgba(255,255,255,0.4)', borderRadius: '0 2px 0 0' }} />
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '14px', height: '14px', borderBottom: '2px solid rgba(255,255,255,0.4)', borderLeft: '2px solid rgba(255,255,255,0.4)', borderRadius: '0 0 0 2px' }} />
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '14px', height: '14px', borderBottom: '2px solid rgba(255,255,255,0.4)', borderRight: '2px solid rgba(255,255,255,0.4)', borderRadius: '0 0 2px 0' }} />

            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 45%, rgba(0,0,0,0.12) 100%)', pointerEvents: 'none', borderRadius: '12px' }} />
          </div>
        );
      })}
    </div>
  );
};

export default CardDeckAnimation;