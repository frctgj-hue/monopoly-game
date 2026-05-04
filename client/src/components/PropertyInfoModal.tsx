import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faTrain, faLightbulb, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Property } from '../types/game.types';

interface PropertyInfoModalProps {
  property: Property;
  onMortgage: () => void;
  onClose: () => void;
}

const PropertyInfoModal: React.FC<PropertyInfoModalProps> = ({
  property,
  onMortgage,
  onClose,
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

  const mortgageValue = Math.floor(property.price / 2);

  return (
    <div className="bg-white rounded-lg shadow-2xl w-full border-4 border-black">
      {/* Заголовок с цветом */}
      <div className={`${getColorClass(property.color)} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getPropertyIcon()}</span>
            <div>
              <h2 className="text-lg font-bold uppercase">{property.name}</h2>
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
      <div className="p-4 space-y-3">
        {/* Цена */}
        <div className="bg-gray-100 border-2 border-gray-300 p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-bold uppercase text-sm">Цена покупки:</span>
            <span className="text-xl font-bold text-gray-900">${property.price}</span>
          </div>
        </div>

        {/* Аренда */}
        {property.rent.length > 0 && (
          <div className="bg-gray-100 border-2 border-gray-300 p-3">
            <h3 className="font-bold text-gray-800 mb-2 uppercase text-sm">Аренда:</h3>
            <div className="space-y-1 text-xs">
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

        {/* Текущее состояние */}
        {property.houses > 0 && (
          <div className="bg-blue-50 border-2 border-blue-300 p-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-700 font-bold uppercase text-sm">Построено:</span>
              <span className="text-lg font-bold text-blue-900">
                {property.houses === 5 ? '🏨 Отель' : `🏠 ${property.houses} ${property.houses === 1 ? 'дом' : 'дома'}`}
              </span>
            </div>
          </div>
        )}

        {/* Стоимость залога */}
        <div className="bg-yellow-50 border-2 border-yellow-400 p-3">
          <div className="flex justify-between items-center">
            <span className="text-yellow-800 font-bold uppercase text-sm">Стоимость залога:</span>
            <span className="text-xl font-bold text-yellow-900">${mortgageValue}</span>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onMortgage}
            className="flex-1 py-2 px-4 rounded-lg font-bold text-sm text-white transition-all uppercase shadow-lg"
            style={{ backgroundColor: '#dc3545' }}
          >
            Заложить
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg font-bold text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors uppercase"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfoModal;
