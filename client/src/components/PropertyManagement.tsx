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
    return colorMap[color] || 'bg-gray-200';
  };

  const myProperties = properties.filter(p => p.owner === player.id && p.price > 0);

  const groupedProperties: { [key: string]: Property[] } = {};
  myProperties.forEach(prop => {
    if (!groupedProperties[prop.color]) {
      groupedProperties[prop.color] = [];
    }
    groupedProperties[prop.color].push(prop);
  });

  return (
    <div className="w-full">
      <div className="theme-panel border-4 border-black shadow-2xl overflow-hidden">
        {/* Заголовок */}
        <div className="p-4 text-white border-b-4 border-black" style={{ background: 'var(--color-accent-green)' }}>
          <div className="flex items-center justify-between">
            <h2 className="theme-title text-xl uppercase">Моя недвижимость</h2>
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

        <div className="p-4 overflow-y-auto max-h-[800px]" style={{ background: '#F5F0E8' }}>
          {Object.keys(groupedProperties).length === 0 ? (
            <div className="text-center py-8">
              <div className="theme-panel border-4 border-black rounded p-6">
                <div className="text-4xl mb-3">🏚️</div>
                <p className="theme-text-muted font-bold uppercase">У вас пока нет недвижимости</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedProperties).map(([color, props]) => {
                return (
                  <div key={color}>
                    {/* Заголовок группы */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`${getPropertyColorClass(color)} w-8 h-8 rounded border-3 border-black`} style={{
                        boxShadow: '2px 2px 0px rgba(0,0,0,0.3)'
                      }}></div>
                      <h3 className="theme-text-label text-sm font-black uppercase">
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
                            className="theme-panel rounded border-4 border-black shadow-lg overflow-hidden"
                          >
                            {/* Цветная полоска сверху */}
                            <div
                              className={`${getPropertyColorClass(color)} h-10 border-b-3 border-black flex items-center justify-center`}
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
                                  <div className="font-black text-[var(--color-text-primary)] text-base uppercase tracking-tight leading-tight">
                                    {prop.name}
                                  </div>
                                  <div className="text-xs font-bold theme-text-muted mt-1.5 uppercase">
                                    {prop.mortgaged && '🏦 ЗАЛОЖЕНА'}
                                    {!prop.mortgaged && prop.houses === 0 && 'БЕЗ ПОСТРОЕК'}
                                    {!prop.mortgaged && prop.houses > 0 && prop.houses < 5 && `🏠 ${prop.houses} ${prop.houses === 1 ? 'ДОМ' : 'ДОМА'}`}
                                    {!prop.mortgaged && prop.houses === 5 && '🏨 ОТЕЛЬ'}
                                  </div>
                                </div>
                                <div className="theme-panel-inset text-right px-3 py-2 rounded border-3 border-black ml-2">
                                  <div className="text-[9px] font-black theme-text-muted uppercase">Цена</div>
                                  <div className="font-black text-lg leading-none" style={{ color: 'var(--color-accent-green)' }}>
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
                                        ? 'theme-btn hover:shadow-lg active:translate-y-0.5'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400'
                                    }`}
                                    style={canMortgage ? {
                                      background: 'var(--color-accent-gold)',
                                      color: '#000',
                                      boxShadow: '3px 3px 0px rgba(0,0,0,0.3)'
                                    } : {}}
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
                                        ? 'theme-btn theme-btn-secondary hover:shadow-lg active:translate-y-0.5'
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