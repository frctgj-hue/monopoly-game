import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEye, faParking, faHandcuffs, faQuestion, faMoneyBill, faTrain, faLightbulb, faDroplet, faSackDollar } from '@fortawesome/free-solid-svg-icons';
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
    setPreviousBoard(board);
  }, [board]);

  useEffect(() => {
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

  const getPropertyColorClass = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      brown: 'property-brown',
      lightblue: 'property-lightblue',
      pink: 'property-pink',
      orange: 'property-orange',
      red: 'property-red',
      yellow: 'property-yellow',
      green: 'property-green',
      darkblue: 'property-darkblue',
      railroad: 'property-railroad',
      utility: 'property-utility',
      special: 'property-special',
    };
    return colorMap[color] || 'bg-gray-200';
  };

  const getSpecialIcon = (property: Property) => {
    if (property.id === 0) return <FontAwesomeIcon icon={faArrowRight} />;
    if (property.id === 10) return <FontAwesomeIcon icon={faEye} />;
    if (property.id === 20) return <FontAwesomeIcon icon={faParking} />;
    if (property.id === 30) return <FontAwesomeIcon icon={faHandcuffs} />;
    if (property.name.includes('Шанс')) return <FontAwesomeIcon icon={faQuestion} />;
    if (property.name.includes('Казна')) return <FontAwesomeIcon icon={faSackDollar} />;
    if (property.name.includes('налог')) return <FontAwesomeIcon icon={faMoneyBill} />;
    if (property.type === 'railroad') return <FontAwesomeIcon icon={faTrain} />;
    if (property.type === 'utility') {
      if (property.name.includes('Электро')) return <FontAwesomeIcon icon={faLightbulb} />;
      if (property.name.includes('Водо')) return <FontAwesomeIcon icon={faDroplet} />;
    }
    return null;
  };

  const renderCell = (property: Property, index: number) => {
    const playersOnCell = players.filter(p => p.position === index);
    const isOwned = property.owner !== null;
    const owner = players.find(p => p.id === property.owner);
    const isCorner = [0, 10, 20, 30].includes(index);

    const cornerClass = isCorner ? 'corner' : '';
    const specificCorner = isCorner
      ? (index === 0 ? 'corner-start' : index === 10 ? 'corner-gotojail' : index === 20 ? 'corner-parking' : 'corner-jail')
      : '';

    return (
      <div
        key={index}
        data-property-id={index}
        className={`board-cell ${cornerClass} ${specificCorner} ${isOwned && owner ? 'highlighted' : ''}`}
        style={isOwned && owner ? { '--owner-color': owner.color } as React.CSSProperties : {}}
        onClick={() => onCellClick?.(index)}
      >
        {/* Color Strip */}
        {property.type === 'property' && (
          <div className={`property-color-bar ${getPropertyColorClass(property.color).replace('property-', '')}`}></div>
        )}
        {property.type === 'railroad' && (
          <div className="property-color-bar railroad">
            <span style={{ fontSize: '12px' }}>🚂</span>
          </div>
        )}

        {/* Special Icons */}
        {(property.type === 'utility' || property.type === 'special') && (
          <div className="cell-icon">
            {getSpecialIcon(property)}
          </div>
        )}

        {/* Property Name */}
        <div className="cell-name" style={{ color: isCorner ? '#ffffff' : undefined }}>
          {property.name.includes('Шанс') || property.name.includes('Казна') ? (
            property.name.includes('Шанс') ? 'Шанс' : 'Казна'
          ) : (
            property.name
          )}
        </div>

        {/* Price */}
        {property.price > 0 && (
          <div className="cell-price" style={{ color: isCorner ? '#ffffff' : undefined }}>${property.price}</div>
        )}

        {/* Player Tokens */}
        {playersOnCell.length > 0 && (
          <div className="cell-tokens">
            {playersOnCell.map(player => {
              if (animatingPlayers.has(player.id)) return null;
              return (
                <div key={player.id}>
                  <TokenPiece color={player.color} size="sm" />
                </div>
              );
            })}
          </div>
        )}

        {/* Owner Indicator */}
        {isOwned && owner && (
          <div className="cell-owner-indicator" style={{ background: owner.color }}></div>
        )}

        {/* Houses Animation */}
        {property.houses > 0 && !isCorner && (
          <div className="absolute top-0 left-0 right-0 z-[250] pointer-events-none flex justify-center gap-0.5" style={{ marginTop: '18px' }}>
            <BuildingAnimation
              houses={property.houses}
              previousHouses={previousBoard[index]?.houses || 0}
              color={property.color}
            />
          </div>
        )}

        {/* Mortgaged Overlay */}
        {property.mortgaged && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            <span className="font-black border-[3px] px-2 py-1 rounded" style={{ color: '#dc143c', borderColor: '#dc143c', backgroundColor: 'rgba(255,255,255,0.92)', fontSize: 'clamp(8px, 1.6vw, 14px)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              ЗАЛОГ
            </span>
          </div>
        )}
      </div>
    );
  };

  const bottom = board.slice(0, 11);
  const right = board.slice(11, 20).reverse();
  const top = board.slice(20, 31).reverse();
  const left = board.slice(31, 40);

  return (
    <div className="board-wrapper flex items-center justify-center w-full h-full">
      <div className="board-container" style={{ borderColor: '#5a5a5e' }}>
        <div className="board-inner" style={{ borderColor: '#5a5a5e' }}>
          {/* Top row: columns 1-11, row 1 */}
          {top.map((property, i) => (
            <div key={property.id} className="board-cell-wrapper" style={{ gridColumn: i + 1, gridRow: 1 }}>
              {renderCell(property, property.id)}
            </div>
          ))}

          {/* Left column: rows 2-10, column 1 */}
          {left.map((property, i) => (
            <div key={property.id} className="board-cell-wrapper" style={{ gridColumn: 1, gridRow: i + 2 }}>
              {renderCell(property, property.id)}
            </div>
          ))}

          {/* Right column: rows 2-10, column 11 */}
          {right.map((property, i) => (
            <div key={property.id} className="board-cell-wrapper" style={{ gridColumn: 11, gridRow: i + 2 }}>
              {renderCell(property, property.id)}
            </div>
          ))}

          {/* Bottom row: columns 1-11, row 11 */}
          {bottom.map((property, i) => (
            <div key={property.id} className="board-cell-wrapper" style={{ gridColumn: i + 1, gridRow: 11 }}>
              {renderCell(property, property.id)}
            </div>
          ))}

          {/* Center area */}
          <div className="board-center" style={{ gridColumn: '2 / 11', gridRow: '2 / 11' }}>
            <div className="board-center-logo">MONOPOLY</div>
            <div className="board-center-subtitle">Классическая игра</div>
          </div>
        </div>

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