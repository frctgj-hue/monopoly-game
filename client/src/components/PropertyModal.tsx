import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faTrain, faLightbulb, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Property } from '../types/game.types';

interface PropertyModalProps {
  property: Property;
  playerMoney: number;
  onBuy: () => void;
  onClose: () => void;
  canBuy: boolean;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  playerMoney,
  onBuy,
  onClose,
  canBuy,
}) => {
  const getPropertyColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      brown: 'property-brown',
      lightblue: 'property-lightblue',
      pink: 'property-pink',
      orange: 'property-orange',
      red: 'property-red',
      yellow: 'property-yellow',
      green: 'property-green',
      darkblue: 'property-darkblue',
      railroad: 'bg-gray-700',
      utility: 'bg-gray-500',
    };
    return colorMap[color] || 'bg-gray-300';
  };

  const getPropertyIcon = () => {
    if (property.type === 'railroad') return <FontAwesomeIcon icon={faTrain} />;
    if (property.type === 'utility') return <FontAwesomeIcon icon={faLightbulb} />;
    return <FontAwesomeIcon icon={faHouse} />;
  };

  return (
    <div>
      <div className="theme-panel w-full border-4 border-black" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок с цветом */}
        <div className={`${getPropertyColorClass(property.color)} text-white p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getPropertyIcon()}</span>
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-wider">{property.name}</h2>
                <p className="text-sm opacity-90 uppercase">
                  {property.type === 'railroad' ? 'Железная дорога' :
                   property.type === 'utility' ? 'Коммунальное предприятие' :
                   'Недвижимость'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-3xl" />
            </button>
          </div>
        </div>

        {/* Информация */}
        <div className="p-6 space-y-4 theme-bg-secondary">
          {/* Цена */}
          <div className="theme-panel-inset p-4">
            <div className="flex justify-between items-center">
              <span className="theme-text-label font-bold">Цена покупки:</span>
              <span className="text-2xl font-bold text-[var(--color-text-gold)]">${property.price}</span>
            </div>
          </div>

          {/* Аренда */}
          {property.rent.length > 0 && (
            <div className="theme-panel-inset p-4">
              <h3 className="theme-text-label font-bold mb-2">Аренда:</h3>
              <div className="space-y-1 text-sm">
                {property.type === 'property' ? (
                  <>
                    <div className="flex justify-between text-[var(--color-text-primary)]">
                      <span className="theme-text-muted">Без домов:</span>
                      <span className="font-bold">${property.rent[0]}</span>
                    </div>
                    {property.rent.slice(1, 5).map((rent, idx) => (
                      <div key={idx} className="flex justify-between text-[var(--color-text-primary)]">
                        <span className="theme-text-muted">{idx + 1} {idx === 0 ? 'дом' : 'дома'}:</span>
                        <span className="font-bold">${rent}</span>
                      </div>
                    ))}
                    {property.rent[5] && (
                      <div className="flex justify-between text-[var(--color-text-primary)]">
                        <span className="theme-text-muted">Отель:</span>
                        <span className="font-bold">${property.rent[5]}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-between text-[var(--color-text-primary)]">
                    <span className="theme-text-muted">Базовая аренда:</span>
                    <span className="font-bold">${property.rent[0]}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Баланс игрока */}
          <div className="theme-panel-inset p-4 border-[var(--color-border-gold)]">
            <div className="flex justify-between items-center">
              <span className="theme-text-label font-bold">Ваш баланс:</span>
              <span className={`text-xl font-bold ${playerMoney >= property.price ? 'text-[var(--color-text-gold)]' : 'text-[var(--color-accent-red)]'}`}>
                ${playerMoney}
              </span>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onBuy}
              disabled={!canBuy}
              className={`flex-1 py-3 px-6 rounded-lg font-bold text-lg transition-all uppercase ${
                canBuy
                  ? 'theme-btn theme-btn-secondary'
                  : 'opacity-30 cursor-not-allowed theme-panel-inset'
              }`}
            >
              {canBuy ? 'Купить' : 'Недостаточно средств'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-lg font-bold text-lg theme-btn theme-btn-ghost uppercase"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;