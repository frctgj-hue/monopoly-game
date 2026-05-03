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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">🏠 Управление недвижимостью</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 text-lg">
            💰 Баланс: ${player.money}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {Object.keys(groupedProperties).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🏚️</div>
              <p className="text-xl">У вас пока нет недвижимости</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedProperties).map(([color, props]) => {
                const monopoly = hasMonopoly(color);
                const houseCost = getHouseCost(color);

                return (
                  <div key={color} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${getColorClass(color)} w-8 h-8 rounded`}></div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {color.toUpperCase()}
                      </h3>
                      {monopoly && (
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                          ⭐ МОНОПОЛИЯ
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      {props.map(prop => (
                        <div
                          key={prop.id}
                          className="bg-white rounded-xl p-4 border-2 border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-bold text-gray-800">{prop.name}</div>
                              <div className="text-sm text-gray-600">
                                {prop.houses === 0 && 'Без построек'}
                                {prop.houses > 0 && prop.houses < 5 && `🏠 ${prop.houses} ${prop.houses === 1 ? 'дом' : 'дома'}`}
                                {prop.houses === 5 && '🏨 Отель'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Аренда</div>
                              <div className="font-bold text-green-600">
                                ${prop.rent[prop.houses] || prop.rent[0]}
                              </div>
                            </div>
                          </div>

                          {monopoly && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => onBuildHouse(prop.id)}
                                disabled={prop.houses >= 5 || player.money < houseCost}
                                className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
                                  prop.houses >= 5 || player.money < houseCost
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                              >
                                {prop.houses === 4 ? `🏨 Построить отель ($${houseCost})` : `🏠 Построить дом ($${houseCost})`}
                              </button>
                              {prop.houses > 0 && (
                                <button
                                  onClick={() => onSellHouse(prop.id)}
                                  className="flex-1 py-2 px-4 rounded-lg font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all"
                                >
                                  💸 Продать ($${houseCost / 2})
                                </button>
                              )}
                            </div>
                          )}

                          {!monopoly && (
                            <div className="text-center text-sm text-gray-500 py-2">
                              Нужна монополия для строительства
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
