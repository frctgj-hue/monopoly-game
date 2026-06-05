import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faCopy, faCheck, faInfoCircle, faGamepad, faClock } from '@fortawesome/free-solid-svg-icons';
import type { Player } from '../types/game.types';
import TokenPiece from './TokenPiece';

interface WaitingRoomProps {
  gameId: string;
  players: Player[];
  myPlayerId: string;
  onStartGame: () => void;
  canStart: boolean;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({
  gameId,
  players,
  myPlayerId,
  onStartGame,
  canStart,
}) => {
  const [copied, setCopied] = useState(false);

  const isHost = players[0]?.id === myPlayerId;

  const handleCopyGameId = () => {
    navigator.clipboard.writeText(gameId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-center p-8 lg:p-12 xl:p-16 relative overflow-hidden min-h-screen"
         style={{
           background: 'linear-gradient(135deg, rgba(60, 60, 65, 0.95) 0%, rgba(37, 37, 40, 0.95) 100%)',
           backdropFilter: 'blur(20px)',
           WebkitBackdropFilter: 'blur(20px)',
         }}>
      <div className="theme-panel p-10 lg:p-14 max-w-6xl w-full relative z-10 animate-fade-in min-h-[85vh] flex flex-col justify-center">
        {/* Заголовок */}
        <div className="text-center mb-10">
          <h2 className="theme-title text-4xl lg:text-5xl mb-2">
            WAITING ROOM
          </h2>
          <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4"></div>
          <p className="theme-text-muted text-lg">Waiting for players...</p>
        </div>

        {/* ID игры с кнопкой копирования */}
        <div className="theme-panel-inset p-8 mb-8">
          <p className="theme-text-label text-center mb-4 text-base">
            Lobby Code
          </p>
          <div className="flex items-center w-full">
            <p className="text-3xl lg:text-4xl font-mono font-light tracking-widest text-[var(--color-text-gold)] flex-shrink-0" style={{ marginLeft: '40px' }}>
              {gameId}
            </p>
            <button
              onClick={handleCopyGameId}
              className="theme-btn theme-btn-primary px-10 py-4 rounded-xl transition-all font-light tracking-wider flex items-center gap-2 hover:scale-105 text-lg flex-shrink-0 ml-auto"
              style={{ marginRight: '40px' }}
            >
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Прогресс-бар игроков */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="theme-title text-lg uppercase">
              Players
            </h3>
            <span className="text-sm font-light px-4 py-2 rounded-full tracking-wider theme-panel-inset text-[var(--color-text-gold)]">
              {players.length}/4
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden theme-panel-inset">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(players.length / 4) * 100}%`,
                background: 'linear-gradient(90deg, #d4af37 0%, #f4d03f 100%)',
                boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
              }}
            />
          </div>
        </div>

        {/* Список игроков */}
        <div className="mb-8 px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="theme-panel p-8 min-h-[80px] flex items-center transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center w-full">
                  <div className="flex-shrink-0" style={{ marginLeft: '10px' }}>
                    <TokenPiece color={player.color} size="lg" />
                  </div>
                  <div className="flex-1 min-w-0" style={{ marginLeft: '60px' }}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-light tracking-wide text-[var(--color-text-gold)]" style={{ fontSize: '1.6rem' }}>
                        {player.name}
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0" style={{ marginRight: '10px' }}>
                        {index === 0 && (
                          <div className="relative group">
                            <FontAwesomeIcon
                              icon={faCrown}
                              className="text-xl text-[var(--color-text-gold)]"
                              style={{ transform: 'translateX(-60px)' }}
                            />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap theme-panel-inset text-[var(--color-text-gold)]">
                              Host
                            </span>
                          </div>
                        )}
                        {player.id === myPlayerId && (
                          <span className="rounded-full font-light tracking-wider theme-btn-primary" style={{ width: '160px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            YOU
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="theme-text-muted mt-1 flex items-center gap-1">
                      <FontAwesomeIcon icon={faCheck} className="text-[var(--color-text-green)]" /> Ready
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Пустые слоты */}
            {Array.from({ length: 4 - players.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="theme-panel-inset p-8 border-2 border-dashed min-h-[80px] flex items-center"
                style={{ borderColor: 'rgba(100, 100, 100, 0.3)', background: 'transparent' }}
              >
                <div className="flex items-center gap-5 w-full">
                  <div className="w-12 h-12 rounded-full animate-pulse flex-shrink-0" style={{ background: 'rgba(100, 100, 100, 0.2)' }}></div>
                  <div className="flex-1 min-w-0">
                    <div className="theme-text-muted font-light text-sm">
                      Waiting for player...
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Информация */}
        <div className="theme-panel-inset p-6 mb-8" style={{ marginLeft: '40px', marginRight: '40px' }}>
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={faInfoCircle} className="text-xl mt-1 text-[var(--color-text-gold)]" />
            <p className="text-gray-400 font-light text-sm leading-relaxed">
              {isHost ? (
                <>
                  <strong className="text-[var(--color-text-gold)]">You are the host.</strong> You can start the game when there are at least 2 players.
                </>
              ) : (
                <>
                  <strong className="text-[var(--color-text-gold)]">Waiting for host.</strong> The host will start the game when everyone is ready.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Кнопка старта */}
        {isHost && (
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className={`theme-btn theme-btn-primary py-6 rounded-xl transition-all text-xl font-light tracking-widest uppercase ${
              !canStart ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            style={{ marginLeft: '40px', marginRight: '40px', width: 'calc(100% - 80px)' }}
          >
            <FontAwesomeIcon icon={canStart ? faGamepad : faClock} className="mr-3" />
            {canStart ? 'Start Game' : 'Waiting for players (min 2)'}
          </button>
        )}

        {!isHost && (
          <div className="text-center py-5">
            <div className="theme-panel-inset inline-flex items-center gap-3 rounded-2xl px-8 py-4">
              <FontAwesomeIcon
                icon={faClock}
                className="text-xl animate-pulse text-[var(--color-text-gold)]"
              />
              <span className="font-light uppercase tracking-widest text-sm text-[var(--color-text-gold)]">
                Waiting for game to start...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;