import React from 'react';
import type { Property, Player } from '../types/game.types';

interface PropertyManagementProps {
  properties: Property[];
  player: Player;
  onClose: () => void;
  onMortgage: (propertyId: number) => void;
  onUnmortgage: (propertyId: number) => void;
}

const PropertyManagement: React.FC<PropertyManagementProps> = ({
  properties,
  player,
  onClose,
  onMortgage,
  onUnmortgage,
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
    return colorMap[color] || 'bg-gray-200';
  };

  const myProperties = properties.filter(p => p.owner === player.id && p.price > 0);

  // Группировка по цветам
  const groupedProperties: { [key: string]: Property[] } = {};
  myProperties.forEach(prop => {
    if (!groupedProperties[prop.color]) {
      groupedProperties[prop.color] = [];
    }
    groupedProperties[prop.color].push(prop);
  });

  return (
    <div className="w-full">
      <div className="bg-white rounded border-4 border-black shadow-2xl overflow-hidden" style={{
        boxShadow: '6px 6px 0px rgba(0,0,0,0.4)'
      }}>
        {/* Заголовок в классическом стиле */}
        <div className="p-4 text-white border-b-4 border-black" style={{ backgroundColor: '#2d8659' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-wide">Моя недвижимость</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 transition-all font-black text-2xl border-2 border-white"
            >
              ×
            </button>
          </div>
          <div className="mt-2 text-base font-black bg-white bg-opacity-20 inline-block px-3 py-1 rounded border-2 border-white">
            БАЛАНС: ${player.money}
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[800px]" style={{ backgroundColor: '#F5F0E8' }}>
          {Object.keys(groupedProperties).length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-white border-4 border-black rounded p-6" style={{
                boxShadow: '4px 4px 0px rgba(0,0,0,0.3)'
              }}>
                <div className="text-4xl mb-3">🏚️</div>
                <p className="text-base font-bold text-gray-700 uppercase">У вас пока нет недвижимости</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedProperties).map(([color, props]) => {
                return (
                  <div key={color}>
                    {/* Заголовок группы */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`${getColorClass(color)} w-8 h-8 rounded border-3 border-black shadow-md`} style={{
                        boxShadow: '2px 2px 0px rgba(0,0,0,0.3)'
                      }}></div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                        {color === 'brown' && 'Коричневая группа'}
                        {color === 'lightblue' && 'Голубая группа'}
                        {color === 'pink' && 'Розовая группа'}
                        {color === 'orange' && 'Оранжевая группа'}
                        {color === 'red' && 'Красная группа'}
                        {color === 'yellow' && 'Желтая группа'}
                        {color === 'green' && 'Зеленая группа'}
                        {color === 'darkblue' && 'Синяя группа'}
                        {color === 'railroad' && 'Вокзалы'}
                        {color === 'utility' && 'Коммунальные услуги'}
                      </h3>
                    </div>

                    {/* Карточки недвижимости */}
                    <div className="space-y-3">
                      {props.map(prop => {
                        const mortgageValue = Math.floor(prop.price / 2);
                        const unmortgageCost = Math.floor((prop.price / 2) * 1.1);
                        const canMortgage = !prop.mortgaged && prop.houses === 0;
                        const canUnmortgage = prop.mortgaged && player.money >= unmortgageCost;

                        return (
                          <div
                            key={prop.id}
                            className="bg-white rounded border-4 border-black shadow-lg overflow-hidden"
                            style={{
                              boxShadow: '4px 4px 0px rgba(0,0,0,0.3)'
                            }}
                          >
                            {/* Цветная полоска сверху - как на карточке */}
                            <div 
                              className={`${getColorClass(color)} h-10 border-b-3 border-black flex items-center justify-center`}
                            >
                              <div className="text-white font-black text-xs uppercase tracking-wider drop-shadow-lg">
                                {prop.type === 'property' && 'НЕДВИЖИМОСТЬ'}
                                {prop.type === 'railroad' && 'ВОКЗАЛ'}
                                {prop.type === 'utility' && 'КОММУНАЛЬНЫЕ УСЛУГИ'}
                              </div>
                            </div>

                            {/* Содержимое карточки */}
                            <div className="p-3">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="font-black text-gray-900 text-base uppercase tracking-tight leading-tight">
                                    {prop.name}
                                  </div>
                                  <div className="text-xs font-bold text-gray-700 mt-1.5 uppercase">
                                    {prop.mortgaged && '🏦 ЗАЛОЖЕНА'}
                                    {!prop.mortgaged && prop.houses === 0 && 'БЕЗ ПОСТРОЕК'}
                                    {!prop.mortgaged && prop.houses > 0 && prop.houses < 5 && `🏠 ${prop.houses} ${prop.houses === 1 ? 'ДОМ' : 'ДОМА'}`}
                                    {!prop.mortgaged && prop.houses === 5 && '🏨 ОТЕЛЬ'}
                                  </div>
                                </div>
                                <div className="text-right bg-gray-100 px-3 py-2 rounded border-3 border-black ml-2" style={{
                                  boxShadow: '2px 2px 0px rgba(0,0,0,0.2)'
                                }}>
                                  <div className="text-[9px] font-black text-gray-600 uppercase tracking-wide">Цена</div>
                                  <div className="font-black text-lg leading-none" style={{ color: '#2d8659' }}>
                                    ${prop.price}
                                  </div>
                                </div>
                              </div>

                              {/* Кнопки залога/выкупа */}
                              <div className="flex gap-2 mt-3">
                                {!prop.mortgaged && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onMortgage(prop.id);
                                    }}
                                    disabled={!canMortgage}
                                    className={`flex-1 px-3 py-2.5 rounded border-3 border-black text-xs font-black uppercase transition-all ${
                                      canMortgage
                                        ? 'bg-yellow-400 hover:bg-yellow-500 text-black shadow-md hover:shadow-lg active:translate-y-0.5'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400'
                                    }`}
                                    style={canMortgage ? { boxShadow: '3px 3px 0px rgba(0,0,0,0.3)' } : {}}
                                    title={prop.houses > 0 ? 'Сначала продайте все постройки' : `Получить $${mortgageValue}`}
                                  >
                                    💰 Заложить +${mortgageValue}
                                  </button>
                                )}
                                {prop.mortgaged && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onUnmortgage(prop.id);
                                    }}
                                    disabled={!canUnmortgage}
                                    className={`flex-1 px-3 py-2.5 rounded border-3 border-black text-xs font-black uppercase transition-all ${
                                      canUnmortgage
                                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg active:translate-y-0.5'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400'
                                    }`}
                                    style={canUnmortgage ? { boxShadow: '3px 3px 0px rgba(0,0,0,0.3)' } : {}}
                                    title={player.money < unmortgageCost ? 'Недостаточно денег' : `Выкупить за $${unmortgageCost}`}
                                  >
                                    🏦 Выкупить -${unmortgageCost}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
