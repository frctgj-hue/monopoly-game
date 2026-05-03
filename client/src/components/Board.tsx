import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEye, faParking, faHandcuffs, faQuestion, faMoneyBill, faTrain, faLightbulb, faDroplet } from '@fortawesome/free-solid-svg-icons';
import type { Property, Player } from '../types/game.types';
import TokenPiece from './TokenPiece';
import BuildingAnimation from './BuildingAnimation';
import TokenPathAnimation from './TokenPathAnimation';

interface BoardProps {
  board: Property[];
  players: Player[];
  onCellClick?: (propertyId: number) => void;
}

interface AnimatingPlayer {
  id: string;
  fromPosition: number;
  toPosition: number;
}

const Board: React.FC<BoardProps> = ({ board, players, onCellClick }) => {
  const [previousBoard, setPreviousBoard] = useState<Property[]>(board);
  const [previousPlayers, setPreviousPlayers] = useState<Player[]>(players);
  const [animatingPlayers, setAnimatingPlayers] = useState<Map<string, AnimatingPlayer>>(new Map());

  useEffect(() => {
    // Отслеживаем изменения в строительстве
    setPreviousBoard(board);
  }, [board]);

  useEffect(() => {
    // Отслеживаем движение игроков
    const newAnimating = new Map<string, AnimatingPlayer>();

    players.forEach(player => {
      const prevPlayer = previousPlayers.find(p => p.id === player.id);
      if (prevPlayer && prevPlayer.position !== player.position) {
        newAnimating.set(player.id, {
          id: player.id,
          fromPosition: prevPlayer.position,
          toPosition: player.position
        });
      }
    });

    if (newAnimating.size > 0) {
      setAnimatingPlayers(newAnimating);
    }

    setPreviousPlayers(players);
  }, [players]);
  const getColorStyle = (color: string): React.CSSProperties => {
    const colorMap: { [key: string]: string } = {
      brown: '#8B4513',
      lightblue: '#87CEEB',
      pink: '#FF1493',
      orange: '#FF8C00',
      red: '#DC143C',
      yellow: '#FFD700',
      green: '#228B22',
      darkblue: '#00008B',
      railroad: '#000000',
      utility: '#FFFFFF',
      special: '#F5F0E8',
    };
    const bgColor = colorMap[color] || '#E5E7EB';
    console.log('Color:', color, '→', bgColor);
    return { backgroundColor: bgColor };
  };

  const getSpecialIcon = (property: Property) => {
    if (property.id === 0) return <FontAwesomeIcon icon={faArrowRight} />; // Старт
    if (property.id === 10) return <FontAwesomeIcon icon={faEye} />; // В гостях
    if (property.id === 20) return <FontAwesomeIcon icon={faParking} />; // Парковка
    if (property.id === 30) return <FontAwesomeIcon icon={faHandcuffs} />; // В тюрьму
    if (property.name.includes('Шанс')) return <FontAwesomeIcon icon={faQuestion} />;
    if (property.name.includes('казна')) return <FontAwesomeIcon icon={faQuestion} />;
    if (property.name.includes('налог')) return <FontAwesomeIcon icon={faMoneyBill} />;
    if (property.type === 'railroad') return <FontAwesomeIcon icon={faTrain} />;
    if (property.type === 'utility') {
      if (property.name.includes('Электро')) return <FontAwesomeIcon icon={faLightbulb} />;
      if (property.name.includes('Водо')) return <FontAwesomeIcon icon={faDroplet} />;
    }
    return null;
  };

  const getCornerStyle = (index: number) => {
    if (index === 0) return 'bg-gradient-to-br from-red-100 to-red-200'; // Старт
    if (index === 10) return 'bg-gradient-to-br from-orange-100 to-orange-200'; // В гостях
    if (index === 20) return 'bg-gradient-to-br from-green-100 to-green-200'; // Парковка
    if (index === 30) return 'bg-gradient-to-br from-blue-100 to-blue-200'; // В тюрьму
    return 'bg-[#F5F0E8]';
  };

  const renderCell = (property: Property, index: number) => {
    const playersOnCell = players.filter(p => p.position === index);
    const isOwned = property.owner !== null;
    const owner = players.find(p => p.id === property.owner);
    const specialIcon = getSpecialIcon(property);
    const isCorner = [0, 10, 20, 30].includes(index);
    const isTopOrBottomRow = (index >= 0 && index <= 10) || (index >= 20 && index <= 30);

    return (
      <div
        key={index}
        data-property-id={index}
        className={`relative border-2 border-black cursor-pointer hover:brightness-95 transition-all duration-200 flex flex-col items-center justify-between ${
          isCorner ? 'p-2' : 'p-1'
        } ${isOwned && owner ? 'ring-2 ring-offset-0' : ''} ${isCorner ? getCornerStyle(index) : 'bg-[#F5F0E8]'} group shadow-sm hover:shadow-md`}
        style={{
          ...(isOwned && owner ? { borderColor: owner.color, borderWidth: '3px' } : {}),
          ...(isTopOrBottomRow ? { minHeight: '95px' } : {})
        }}
        onClick={() => onCellClick?.(index)}
      >
        {/* Внутренняя тень для глубины */}
        <div className="absolute inset-0 pointer-events-none" style={{
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
        }}></div>
        {/* Цветная полоска сверху для недвижимости - 20px высота */}
        {property.type === 'property' && (
          <div
            className="w-full h-5 -mx-1 -mt-1 mb-1 border-b-2 border-black relative overflow-hidden"
            style={getColorStyle(property.color)}
          >
            {/* Блик на цветной полоске */}
            <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-30"></div>
          </div>
        )}

        {/* Цветная полоска для железных дорог */}
        {property.type === 'railroad' && (
          <div
            className="w-full h-5 -mx-1 -mt-1 mb-1 border-b-2 border-black flex items-center justify-center relative overflow-hidden"
            style={getColorStyle(property.color)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-20"></div>
            <span className="text-white text-xs relative z-10">
              <FontAwesomeIcon icon={faTrain} />
            </span>
          </div>
        )}

        {/* Иконка для специальных клеток */}
        {specialIcon && property.type === 'special' && (
          <div className={`text-center ${isCorner ? 'text-4xl' : 'text-xl'} mb-1`}>
            {isCorner ? (
              <div className="relative">
                {/* Декоративная рамка для угловых клеток */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-black rounded-full opacity-20"></div>
                </div>
                <div className="relative z-10" style={{
                  filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))'
                }}>
                  {specialIcon}
                </div>
              </div>
            ) : (
              specialIcon
            )}
          </div>
        )}

        {/* Иконка для коммунальных служб */}
        {property.type === 'utility' && (
          <div className="text-center text-2xl mb-1 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full opacity-30"></div>
            </div>
            <div className="relative z-10" style={{
              filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.2))'
            }}>
              {specialIcon}
            </div>
          </div>
        )}

        {/* Название - капсом, жирный шрифт */}
        <div className={`${isCorner ? 'text-[12px]' : 'text-[9px]'} font-black text-center uppercase leading-tight text-gray-900 px-0.5`}>
          {property.name}
        </div>

        {/* Цена - поверх полоски */}
        {property.price > 0 && (
          <div className={`${isCorner ? 'text-[11px]' : 'text-[10px]'} text-center font-bold mt-1 relative`} style={{ zIndex: 101 }}>
            <span className="bg-white bg-opacity-80 px-1 py-0.5 rounded text-gray-900">
              ${property.price}
            </span>
          </div>
        )}

        {/* Дома с анимацией */}
        {property.houses > 0 && (
          <BuildingAnimation
            houses={property.houses}
            previousHouses={previousBoard[index]?.houses || 0}
            color={property.color}
          />
        )}

        {/* Фишки игроков */}
        {playersOnCell.length > 0 && (
          <div className="flex flex-wrap gap-0.5 justify-center mt-1 relative z-[110]">
            {playersOnCell.map(player => {
              // Не показываем фишку, если она анимируется
              if (animatingPlayers.has(player.id)) {
                return null;
              }

              // Обычная фишка без анимации
              return (
                <div key={player.id}>
                  <TokenPiece color={player.color} size="sm" />
                </div>
              );
            })}
          </div>
        )}

        {/* Индикатор владельца */}
        {isOwned && owner && (
          <div className="absolute top-0.5 right-0.5 z-[110]">
            <TokenPiece color={owner.color} size="sm" />
          </div>
        )}

        {/* Цветная полоска снизу для недвижимости - INLINE STYLES */}
        {property.type === 'property' && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '14px',
              backgroundColor: property.color === 'brown' ? '#8B4513' :
                              property.color === 'lightblue' ? '#87CEEB' :
                              property.color === 'pink' ? '#FF1493' :
                              property.color === 'orange' ? '#FF8C00' :
                              property.color === 'red' ? '#DC143C' :
                              property.color === 'yellow' ? '#FFD700' :
                              property.color === 'green' ? '#228B22' :
                              property.color === 'darkblue' ? '#00008B' : '#FF0000',
              borderTop: '2px solid #000000',
              zIndex: 100
            }}
          >
          </div>
        )}

        {/* Hover эффект */}
        <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
      </div>
    );
  };

  // Разделяем поле на 4 стороны с правильной нумерацией
  // Нижняя строка: 0-10 (слева направо)
  const bottom = board.slice(0, 11);
  // Правая сторона: 11-19 (снизу вверх) - нужно развернуть
  const right = board.slice(11, 20).reverse();
  // Верхняя строка: 20-30 (справа налево) - нужно развернуть
  const top = board.slice(20, 31).reverse();
  // Левая сторона: 31-39 (сверху вниз)
  const left = board.slice(31, 40);

  return (
    <div className="w-[1000px] h-[1150px]">
      <div className="board-container relative shadow-2xl rounded-lg overflow-hidden bg-[#CDE6D0] w-full h-full border-4 border-black" style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="grid grid-cols-11 gap-0 text-xs w-full h-full">
          {/* Верхняя сторона: 20-30 (справа налево) */}
          {top.map((property) => renderCell(property, property.id))}

          {/* Средняя часть */}
          <div className="col-span-11 row-span-9 grid grid-cols-11">
            {/* Левая сторона: 31-39 (сверху вниз) */}
            <div className="grid grid-rows-9 overflow-hidden">
              {left.map((property) => renderCell(property, property.id))}
            </div>

            {/* Центр поля - чистый дизайн */}
            <div className="col-span-9 bg-[#CDE6D0] relative overflow-hidden border-2 border-black">
              {/* Фоновый паттерн - диагональные линии */}
              <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="20" height="20">
                      <path d="M0,20 l20,-20 M-5,5 l10,-10 M15,25 l10,-10" stroke="#000" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#diagonalLines)" />
                </svg>
              </div>

              {/* Декоративная рамка */}
              <div className="absolute inset-4 border-4 border-black rounded-lg opacity-20"></div>
              <div className="absolute inset-8 border-2 border-black rounded-lg opacity-10"></div>
            </div>

            {/* Правая сторона: 11-19 (снизу вверх) */}
            <div className="grid grid-rows-9">
              {right.map((property) => renderCell(property, property.id))}
            </div>
          </div>

          {/* Нижняя сторона: 0-10 (слева направо) */}
          {bottom.map((property) => renderCell(property, property.id))}
        </div>

        {/* Слой для анимирующихся фишек */}
        {Array.from(animatingPlayers.values()).map(animPlayer => {
          const player = players.find(p => p.id === animPlayer.id);
          if (!player) return null;

          return (
            <TokenPathAnimation
              key={animPlayer.id}
              playerId={animPlayer.id}
              color={player.color}
              fromPosition={animPlayer.fromPosition}
              toPosition={animPlayer.toPosition}
              onComplete={() => {
                setAnimatingPlayers(prev => {
                  const newMap = new Map(prev);
                  newMap.delete(animPlayer.id);
                  return newMap;
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Board;
