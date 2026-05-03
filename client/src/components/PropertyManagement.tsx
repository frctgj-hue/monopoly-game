import React from 'react';
import type { Property, Player } from '../types/game.types';

interface PropertyManagementProps {
  properties: Property[];
  player: Player;
  onBuildHouse: (propertyId: number) => void;
  onSellHouse: (propertyId: number) => void;
  onClose: () => void;
}

const PropertyManagement: React.FC<PropertyManagementProps> = ({
  properties,
  player,
  onBuildHouse,
  onSellHouse,
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
    };
    return colorMap[color] || 'bg-gray-200';
  };

  const getHouseCost = (color: string): number => {
    const costs: { [key: string]: number } = {
      brown: 50,
      lightblue: 50,
      pink: 100,
      orange: 100,
      red: 150,
      yellow: 150,
      green: 200,
      darkblue: 200,
    };
    return costs[color] || 50;
  };

  const myProperties = properties.filter(p => p.owner === player.id && p.type === 'property');

  // Группировка по цветам
  const groupedProperties: { [key: string]: Property[] } = {};
  myProperties.forEach(prop => {
    if (!groupedProperties[prop.color]) {
      groupedProperties[prop.color] = [];
    }
    groupedProperties[prop.color].push(prop);
  });

  // Проверка монополии
  const hasMonopoly = (color: string): boolean => {
    const allInColor = properties.filter(p => p.color === color && p.type === 'property');
    const ownedInColor = allInColor.filter(p => p.owner === player.id);
    return allInColor.length === ownedInColor.length;
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="p-4 text-white border-b-4 border-black" style={{ backgroundColor: '#2d8659' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase">Управление недвижимостью</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 transition-all font-bold text-xl"
            >
              ×
            </button>
          </div>
          <div className="mt-2 text-base font-bold">
            Баланс: ${player.money}
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[800px]">
          {Object.keys(groupedProperties).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-3">🏚️</div>
              <p className="text-base">У вас пока нет недвижимости</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedProperties).map(([color, props]) => {
                const monopoly = hasMonopoly(color);
                const houseCost = getHouseCost(color);

                return (
                  <div key={color} className="bg-gray-50 rounded-lg p-3 border-2 border-gray-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`${getColorClass(color)} w-6 h-6 rounded border-2 border-black`}></div>
                      <h3 className="text-sm font-bold text-gray-800 uppercase">
                        {color}
                      </h3>
                      {monopoly && (
                        <span className="text-white text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: '#2d8659' }}>
                          МОНОПОЛИЯ
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {props.map(prop => (
                        <div
                          key={prop.id}
                          className="bg-white rounded-lg p-3 border-2 border-gray-300"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-bold text-gray-800 text-sm">{prop.name}</div>
                              <div className="text-xs text-gray-600">
                                {prop.houses === 0 && 'Без построек'}
                                {prop.houses > 0 && prop.houses < 5 && `🏠 ${prop.houses} ${prop.houses === 1 ? 'дом' : 'дома'}`}
                                {prop.houses === 5 && '🏨 Отель'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-600">Аренда</div>
                              <div className="font-bold text-sm" style={{ color: '#2d8659' }}>
                                ${prop.rent[prop.houses] || prop.rent[0]}
                              </div>
                            </div>
                          </div>

                          {monopoly && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => onBuildHouse(prop.id)}
                                disabled={prop.houses >= 5 || player.money < houseCost}
                                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all ${
                                  prop.houses >= 5 || player.money < houseCost
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'text-white'
                                }`}
                                style={prop.houses < 5 && player.money >= houseCost ? { backgroundColor: '#2d8659' } : {}}
                              >
                                {prop.houses === 4 ? `Отель ($${houseCost})` : `Дом ($${houseCost})`}
                              </button>
                              {prop.houses > 0 && (
                                <button
                                  onClick={() => onSellHouse(prop.id)}
                                  className="flex-1 py-1.5 px-3 rounded-lg font-bold text-xs text-white transition-all"
                                  style={{ backgroundColor: '#dc3545' }}
                                >
                                  Продать ($${houseCost / 2})
                                </button>
                              )}
                            </div>
                          )}

                          {!monopoly && (
                            <div className="text-center text-xs text-gray-500 py-1">
                              Нужна монополия
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyManagement;
