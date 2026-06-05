import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faTrain, faLightbulb, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Property } from '../types/game.types';

interface PropertyInfoModalProps {
  property: Property;
  onMortgage: () => void;
  onUnmortgage: () => void;
  onBuildHouse: () => void;
  onSellHouse: () => void;
  canBuildHouse: boolean;
  canSellHouse: boolean;
  hasMonopoly: boolean;
  onClose: () => void;
}

const PropertyInfoModal: React.FC<PropertyInfoModalProps> = ({
  property,
  onMortgage,
  onUnmortgage,
  onBuildHouse,
  onSellHouse,
  canBuildHouse,
  canSellHouse,
  hasMonopoly,
  onClose,
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

  const mortgageValue = Math.floor(property.price / 2);
  const unmortgageValue = Math.floor(mortgageValue * 1.1);

  return (
    <div className="theme-panel w-full border-4 border-black">
      {/* Заголовок с цветом */}
      <div className={`${getPropertyColorClass(property.color)} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getPropertyIcon()}</span>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider">{property.name}</h2>
              <p className="text-xs opacity-90 uppercase">
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
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Информация */}
      <div className="p-4 space-y-3 theme-bg-secondary">
        {/* Цена */}
        <div className="theme-panel-inset p-3">
          <div className="flex justify-between items-center">
            <span className="theme-text-label font-bold">Цена покупки:</span>
            <span className="text-xl font-bold text-[var(--color-text-gold)]">${property.price}</span>
          </div>
        </div>

        {/* Аренда */}
        {property.rent.length > 0 && (
          <div className="theme-panel-inset p-3">
            <h3 className="theme-text-label font-bold mb-2">Аренда:</h3>
            <div className="space-y-1 text-xs">
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

        {/* Текущее состояние */}
        {property.houses > 0 && (
          <div className="theme-panel-inset p-3 border-l-4 border-[var(--color-accent-blue)]">
            <div className="flex justify-between items-center">
              <span className="theme-text-label font-bold">Построено:</span>
              <span className="text-lg font-bold text-[var(--color-accent-blue)]">
                {property.houses === 5 ? '🏨 Отель' : `🏠 ${property.houses} ${property.houses === 1 ? 'дом' : 'дома'}`}
              </span>
            </div>
          </div>
        )}

        {/* Стоимость залога */}
        <div className="theme-panel-inset p-3 border-l-4 border-[var(--color-accent-gold)]">
          <div className="flex justify-between items-center">
            <span className="theme-text-label font-bold">
              {property.mortgaged ? 'Стоимость выкупа:' : 'Стоимость залога:'}
            </span>
            <span className="text-xl font-bold text-[var(--color-text-gold)]">
              ${property.mortgaged ? unmortgageValue : mortgageValue}
            </span>
          </div>
        </div>

        {/* Индикатор залога */}
        {property.mortgaged && (
          <div className="theme-panel-inset p-3 border-l-4 border-[var(--color-accent-red)]">
            <div className="text-center font-bold uppercase text-sm text-[var(--color-accent-red)]">
              ⚠️ Недвижимость заложена
            </div>
          </div>
        )}

        {/* Управление домами */}
        {property.type === 'property' && !property.mortgaged && hasMonopoly && (
          <div className="theme-panel-inset p-3 border-l-4 border-[var(--color-accent-blue)]">
            <h3 className="theme-text-label font-bold mb-2 text-center">Управление домами</h3>
            <div className="flex gap-2">
              <button
                onClick={onSellHouse}
                disabled={!canSellHouse}
                className="flex-1 py-2 px-4 rounded-lg font-bold text-lg theme-btn hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'var(--color-accent-red)', color: '#fff' }}
              >
                - Продать
              </button>
              <button
                onClick={onBuildHouse}
                disabled={!canBuildHouse}
                className="flex-1 py-2 px-4 rounded-lg font-bold text-lg theme-btn hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'var(--color-accent-green)', color: '#fff' }}
              >
                + Построить
              </button>
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex gap-2 pt-2">
          {property.mortgaged ? (
            <button
              onClick={onUnmortgage}
              className="flex-1 py-2 px-4 rounded-lg font-bold text-sm text-white theme-btn theme-btn-secondary uppercase"
            >
              Выкупить
            </button>
          ) : (
            <button
              onClick={onMortgage}
              disabled={property.houses > 0}
              className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm text-white theme-btn uppercase disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-500`}
              style={property.houses === 0 ? { background: 'var(--color-accent-red)', color: '#fff' } : {}}
            >
              {property.houses > 0 ? 'Продайте дома' : 'Заложить'}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg font-bold text-sm theme-btn theme-btn-ghost uppercase"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfoModal;