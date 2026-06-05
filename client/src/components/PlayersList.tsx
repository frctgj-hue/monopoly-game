import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faPlay } from '@fortawesome/free-solid-svg-icons';
import type { Player } from '../types/game.types';
import TokenPiece from './TokenPiece';

interface PlayersListProps {
  players: Player[];
  currentPlayerId: string;
  myPlayerId: string;
}

const PlayersList: React.FC<PlayersListProps> = ({ players, currentPlayerId, myPlayerId }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-black uppercase mb-4 text-center tracking-widest" style={{ color: 'var(--color-accent-gold)' }}>
        Игроки
      </h2>

      <div className="space-y-3">
        {players.map((player) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          const isMe = player.id === myPlayerId;

          return (
            <div
              key={player.id}
              className={`p-4 rounded-xl border ${
                isCurrentPlayer
                  ? 'border-[var(--color-accent-gold)] shadow-lg'
                  : 'border-[var(--color-border-subtle)] hover:border-[var(--color-accent-gold)]/30'
              } ${player.isBankrupt ? 'opacity-40 grayscale' : ''}`}
              style={{
                background: isCurrentPlayer
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, var(--color-bg-tertiary) 100%)'
                  : 'var(--color-bg-tertiary)',
              }}
            >
              {/* Имя игрока и фишка */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={isCurrentPlayer ? 'animate-pulse' : ''}>
                    <TokenPiece color={player.color} size="sm" />
                  </div>
                  <div>
                    <div className="font-bold text-base flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                      {player.name}
                      {isMe && (
                        <span className="text-xs px-2 py-0.5 rounded-md font-bold" style={{ background: 'var(--color-accent-gold)', color: '#000' }}>
                          Вы
                        </span>
                      )}
                    </div>
                    {isMe && player.getOutOfJailFreeCards > 0 && (
                      <div className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                        🎫 Освобождений: {player.getOutOfJailFreeCards}
                      </div>
                    )}
                  </div>
                </div>
                {isCurrentPlayer && !player.isBankrupt && (
                  <FontAwesomeIcon icon={faPlay} className="text-[var(--color-accent-green)] animate-pulse" />
                )}
              </div>

              {/* Баланс и недвижимость */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <FontAwesomeIcon icon={faHouse} className="text-[var(--color-accent-gold)]" />
                  {player.properties.length}
                </div>
                <div className="font-bold text-lg" style={{ color: player.money > 0 ? 'var(--color-accent-gold)' : 'var(--color-accent-red)' }}>
                  ${player.money}
                </div>
              </div>

              {/* Статусы */}
              {player.inJail && (
                <div className="mt-2 text-xs rounded-lg p-1 text-center font-bold" style={{ background: 'var(--color-accent-red)', color: '#fff' }}>
                  🔒 В тюрьме
                </div>
              )}
              {player.isBankrupt && (
                <div className="mt-2 text-xs rounded-lg p-1 text-center font-bold" style={{ background: 'var(--color-text-muted)', color: '#fff' }}>
                  💀 Банкрот
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayersList;
