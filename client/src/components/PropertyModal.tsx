import React from 'react';
import type { Property } from '../types/game.types';

interface PropertyModalProps {
  property: Property;
  playerMoney: number;
  onBuy: () => void;
  onAuction?: () => void;
  onClose: () => void;
  canBuy: boolean;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  playerMoney,
  onBuy,
  onAuction,
  onClose,
  canBuy,
}) => {
  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      brown: 'bg-amber-800',
      lightblue: 'bg-sky-400',
      pink: 'bg-pink-500',
      orange: 'bg-orange-500',
      red: 'bg-red-600',
      yellow: 'bg-yellow-400',
      green: 'bg-green-600',
      darkblue: 'bg-blue-800',
      railroad: 'bg-gray-700',
      utility: 'bg-gray-500',
    };
    return colorMap[color] || 'bg-gray-300';
  };

  const getPropertyIcon = () => {
    if (property.type === 'railroad') return '🚂';
    if (property.type === 'utility') return '💡';
    return '🏠';
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full animate-scale-in border-2 border-black" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок с цветом */}
        <div className={`${getColorClass(property.color)} text-white p-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getPropertyIcon()}</span>
              <div>
                <h2 className="text-2xl font-bold">{property.name}</h2>
                <p className="text-sm opacity-90">
                  {property.type === 'railroad' ? 'Железная дорога' :
                   property.type === 'utility' ? 'Коммунальное предприятие' :
                   'Недвижимость'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Информация */}
        <div className="p-6 space-y-4">
          {/* Цена */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Цена покупки:</span>
              <span className="text-2xl font-bold text-green-600">${property.price}</span>
            </div>
          </div>

          {/* Аренда */}
          {property.rent.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Аренда:</h3>
              <div className="space-y-1 text-sm">
                {property.type === 'property' ? (
                  <>
                    <div className="flex justify-between">
                      <span>Без домов:</span>
                      <span className="font-semibold">${property.rent[0]}</span>
                    </div>
                    {property.rent.slice(1, 5).map((rent, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{idx + 1} {idx === 0 ? 'дом' : 'дома'}:</span>
                        <span className="font-semibold">${rent}</span>
                      </div>
                    ))}
                    {property.rent[5] && (
                      <div className="flex justify-between">
                        <span>Отель:</span>
                        <span className="font-semibold">${property.rent[5]}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>Базовая аренда:</span>
                    <span className="font-semibold">${property.rent[0]}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Баланс игрока */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Ваш баланс:</span>
              <span className={`text-xl font-bold ${playerMoney >= property.price ? 'text-green-600' : 'text-red-600'}`}>
                ${playerMoney}
              </span>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onBuy}
              disabled={!canBuy}
              className={`flex-1 py-3 px-6 rounded-lg font-bold text-lg transition-all ${
                canBuy
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canBuy ? 'Купить' : 'Недостаточно средств'}
            </button>
            {onAuction && (
              <button
                onClick={() => {
                  onAuction();
                  onClose();
                }}
                className="flex-1 py-3 px-6 rounded-lg font-bold text-lg bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                🔨 Аукцион
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-lg font-bold text-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
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
