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
    if (property.type === 'railroad') return <FontAwesomeIcon icon={faTrain} />;
    if (property.type === 'utility') return <FontAwesomeIcon icon={faLightbulb} />;
    return <FontAwesomeIcon icon={faHouse} />;
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-2xl w-full border-4 border-black" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок с цветом */}
        <div className={`${getColorClass(property.color)} text-white p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getPropertyIcon()}</span>
              <div>
                <h2 className="text-2xl font-bold uppercase">{property.name}</h2>
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
        <div className="p-6 space-y-4">
          {/* Цена */}
          <div className="bg-gray-100 border-2 border-gray-300 p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-bold uppercase">Цена покупки:</span>
              <span className="text-2xl font-bold text-gray-900">${property.price}</span>
            </div>
          </div>

          {/* Аренда */}
          {property.rent.length > 0 && (
            <div className="bg-gray-100 border-2 border-gray-300 p-4">
              <h3 className="font-bold text-gray-800 mb-2 uppercase">Аренда:</h3>
              <div className="space-y-1 text-sm">
                {property.type === 'property' ? (
                  <>
                    <div className="flex justify-between">
                      <span>Без домов:</span>
                      <span className="font-bold">${property.rent[0]}</span>
                    </div>
                    {property.rent.slice(1, 5).map((rent, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{idx + 1} {idx === 0 ? 'дом' : 'дома'}:</span>
                        <span className="font-bold">${rent}</span>
                      </div>
                    ))}
                    {property.rent[5] && (
                      <div className="flex justify-between">
                        <span>Отель:</span>
                        <span className="font-bold">${property.rent[5]}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>Базовая аренда:</span>
                    <span className="font-bold">${property.rent[0]}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Баланс игрока */}
          <div className="bg-gray-100 border-2 border-gray-400 p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-bold uppercase">Ваш баланс:</span>
              <span className={`text-xl font-bold ${playerMoney >= property.price ? 'text-gray-900' : 'text-red-600'}`}>
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
                  ? 'text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={canBuy ? { backgroundColor: '#2d8659' } : {}}
            >
              {canBuy ? 'Купить' : 'Недостаточно средств'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-lg font-bold text-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors uppercase"
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
