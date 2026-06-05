import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore — animejs v4.4.1 не имеет default export в ESM, используем namespace
import * as anime from 'animejs';

const CameraExplodedView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState(false);

  // Детали камеры с их позициями
  const cameraParts = [
    { id: 'lens-front', name: 'Front Lens Element', color: '#e0e0e0', size: 80, z: 0 },
    { id: 'lens-group-1', name: 'Lens Group 1', color: '#c0c0c0', size: 75, z: 1 },
    { id: 'lens-group-2', name: 'Lens Group 2', color: '#d0d0d0', size: 70, z: 2 },
    { id: 'aperture', name: 'Aperture Blades', color: '#505050', size: 65, z: 3 },
    { id: 'lens-group-3', name: 'Lens Group 3', color: '#c5c5c5', size: 68, z: 4 },
    { id: 'shutter', name: 'Shutter Mechanism', color: '#606060', size: 72, z: 5 },
    { id: 'sensor-filter', name: 'IR Cut Filter', color: '#8b4789', size: 70, z: 6 },
    { id: 'sensor', name: 'Image Sensor', color: '#1a472a', size: 68, z: 7 },
    { id: 'processor', name: 'Image Processor', color: '#2d5f3f', size: 75, z: 8 },
    { id: 'circuit-board', name: 'Main Circuit Board', color: '#1e5631', size: 85, z: 9 },
    { id: 'battery', name: 'Battery Pack', color: '#d4af37', size: 60, z: 10 },
    { id: 'body-back', name: 'Camera Body', color: '#2a2a2a', size: 95, z: 11 },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Начальная анимация появления
    // @ts-ignore — animejs v4.4.1 не предоставляет типы для вызова функции
    anime({
      targets: '.camera-part',
      opacity: [0, 1],
      scale: [0.5, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: 'easeOutElastic(1, .8)',
    });

    // Автоматический цикл разборки/сборки
    const interval = setInterval(() => {
      toggleExplode();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleExplode = () => {
    setIsExploded(prev => !prev);

    if (!isExploded) {
      // Анимация разборки
      // @ts-ignore — animejs v4.4.1 не предоставляет типы для вызова функции
      anime({
        targets: '.camera-part',
        // @ts-ignore — параметры анимации anime.js не типизированы в этой версии
        translateZ: (_el: any, i: number) => {
          return (cameraParts.length - i) * 150;
        },
        // @ts-ignore
        translateX: (_el: any, i: number) => {
          const angle = (i / cameraParts.length) * Math.PI * 2;
          return Math.cos(angle) * 100;
        },
        // @ts-ignore
        translateY: (_el: any, i: number) => {
          const angle = (i / cameraParts.length) * Math.PI * 2;
          return Math.sin(angle) * 100;
        },
        // @ts-ignore
        rotateX: (_el: any, i: number) => {
          return (i % 2 === 0 ? 1 : -1) * 15;
        },
        // @ts-ignore
        rotateY: (_el: any, i: number) => {
          return (i % 3 === 0 ? 1 : -1) * 15;
        },
        scale: 1.1,
        duration: 1500,
        delay: anime.stagger(80),
        easing: 'easeOutExpo',
      });

      // Анимация меток
      // @ts-ignore — animejs v4.4.1 не предоставляет типы для вызова функции
      anime({
        targets: '.part-label',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(80, { start: 500 }),
        duration: 600,
        easing: 'easeOutQuad',
      });
    } else {
      // Анимация сборки
      // @ts-ignore
      anime({
        targets: '.camera-part',
        translateZ: 0,
        translateX: 0,
        translateY: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 1200,
        delay: anime.stagger(60, { from: 'last' }),
        easing: 'easeInOutQuad',
      });

      // Скрыть метки
      // @ts-ignore
      anime({
        targets: '.part-label',
        opacity: 0,
        translateY: -20,
        duration: 400,
        easing: 'easeInQuad',
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1c1c1e 50%, #0a0a0a 100%)',
        perspective: '2000px',
      }}
    >
      {/* Заголовок */}
      <div className="text-center mb-12">
        <h1 
          className="text-6xl font-light tracking-[0.3em] mb-4"
          style={{ 
            color: '#d4af37',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 300,
            textShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
          }}
        >
          CAMERA ANATOMY
        </h1>
        <p className="text-gray-400 text-lg tracking-wider">
          Precision Engineering • Advanced Optics • Cutting-Edge Technology
        </p>
      </div>

      {/* 3D контейнер камеры */}
      <div 
        ref={containerRef}
        className="relative"
        style={{
          width: '600px',
          height: '600px',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-10deg) rotateY(20deg)',
        }}
      >
        {cameraParts.map((part, index) => (
          <div key={part.id} className="absolute inset-0 flex items-center justify-center">
            {/* Деталь камеры */}
            <div
              className="camera-part absolute flex items-center justify-center"
              style={{
                width: `${part.size}px`,
                height: `${part.size}px`,
                background: `radial-gradient(circle at 30% 30%, ${part.color}, ${adjustBrightness(part.color, -30)})`,
                borderRadius: part.id.includes('lens') ? '50%' : part.id === 'sensor' ? '10%' : '8%',
                boxShadow: `
                  0 0 20px rgba(0,0,0,0.5),
                  inset 0 0 20px rgba(255,255,255,0.1),
                  0 0 40px ${part.color}40
                `,
                border: `2px solid ${adjustBrightness(part.color, 20)}`,
                transformStyle: 'preserve-3d',
                zIndex: cameraParts.length - index,
              }}
            >
              {/* Детализация для линз */}
              {part.id.includes('lens') && (
                <>
                  <div 
                    className="absolute rounded-full"
                    style={{
                      width: '60%',
                      height: '60%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent)',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                  <div 
                    className="absolute rounded-full"
                    style={{
                      width: '30%',
                      height: '30%',
                      background: 'radial-gradient(circle, rgba(100,150,255,0.4), transparent)',
                    }}
                  />
                </>
              )}

              {/* Детализация для сенсора */}
              {part.id === 'sensor' && (
                <div className="grid grid-cols-8 gap-px w-4/5 h-4/5">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i}
                      className="bg-green-900"
                      style={{
                        boxShadow: 'inset 0 0 2px rgba(0,255,0,0.3)',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Детализация для процессора */}
              {part.id === 'processor' && (
                <div className="text-xs text-white font-mono opacity-70">
                  AI CHIP
                </div>
              )}

              {/* Детализация для диафрагмы */}
              {part.id === 'aperture' && (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-gray-700"
                      style={{
                        width: '40%',
                        height: '8%',
                        top: '50%',
                        left: '50%',
                        transformOrigin: '0% 50%',
                        transform: `rotate(${i * 45}deg)`,
                        borderRadius: '2px',
                      }}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Метка детали */}
            <div
              className="part-label absolute opacity-0 pointer-events-none"
              style={{
                left: '120%',
                top: '50%',
                transform: 'translateY(-50%)',
                whiteSpace: 'nowrap',
              }}
            >
              <div 
                className="px-4 py-2 rounded-lg text-sm font-light tracking-wider"
                style={{
                  background: 'rgba(0,0,0,0.8)',
                  color: '#d4af37',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                {part.name}
              </div>
              {/* Линия к детали */}
              <div
                className="absolute right-full top-1/2 h-px bg-gradient-to-l from-yellow-600 to-transparent"
                style={{ width: '60px' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка управления */}
      <button
        onClick={toggleExplode}
        className="mt-12 px-12 py-4 rounded-xl text-lg font-light tracking-widest transition-all hover:scale-105"
        style={{
          background: '#d4af37',
          color: '#1c1c1e',
          boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
        }}
      >
        {isExploded ? 'ASSEMBLE' : 'EXPLODE VIEW'}
      </button>

      {/* Технические характеристики */}
      <div className="mt-12 grid grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-3xl font-light mb-2" style={{ color: '#d4af37' }}>108MP</div>
          <div className="text-gray-500 text-sm tracking-wider">RESOLUTION</div>
        </div>
        <div>
          <div className="text-3xl font-light mb-2" style={{ color: '#d4af37' }}>f/1.4</div>
          <div className="text-gray-500 text-sm tracking-wider">APERTURE</div>
        </div>
        <div>
          <div className="text-3xl font-light mb-2" style={{ color: '#d4af37' }}>8K</div>
          <div className="text-gray-500 text-sm tracking-wider">VIDEO</div>
        </div>
      </div>
    </div>
  );
};

// Вспомогательная функция для изменения яркости цвета
function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default CameraExplodedView;
