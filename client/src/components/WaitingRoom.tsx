import React, { useState } from 'react';
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
    <div className="min-h-screen gradient-monopoly flex items-center justify-center p-4 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🎩</div>
        <div className="absolute top-40 right-20 text-5xl opacity-20 animate-float-delayed">🚗</div>
        <div className="absolute bottom-32 left-1/4 text-7xl opacity-20 animate-float">🐕</div>
        <div className="absolute bottom-20 right-1/3 text-6xl opacity-20 animate-float-delayed">🚢</div>
      </div>

      <div className="backdrop-blur-glass rounded-3xl shadow-2xl p-10 max-w-3xl w-full animate-scale-in relative z-10">
        <div className="text-center mb-8">
          <h2 className="font-display text-5xl font-bold text-gray-800 mb-3 text-shadow">
            Комната ожидания
          </h2>
          <p className="text-gray-600 text-lg">Ожидание игроков...</p>
        </div>

        {/* ID игры с кнопкой копирования */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-8 shadow-lg">
          <p className="text-white text-sm font-semibold text-center mb-2 opacity-90">
            ID игры для друзей:
          </p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-3xl font-mono font-bold text-white text-shadow-lg">
              {gameId}
            </p>
            <button
              onClick={handleCopyGameId}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 font-semibold"
            >
              {copied ? '✓ Скопировано!' : '📋 Копировать'}
            </button>
          </div>
        </div>

        {/* Прогресс-бар игроков */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-700">
              Игроки
            </h3>
            <span className="text-lg font-semibold text-gray-600">
              {players.length}/4
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${(players.length / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Список игроков */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-5 shadow-lg animate-slide-in border-2 border-transparent hover:border-blue-300 transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <TokenPiece color={player.color} size="lg" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 text-lg">
                        {player.name}
                      </span>
                      {player.id === myPlayerId && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                          Вы
                        </span>
                      )}
                      {index === 0 && (
                        <span className="text-2xl animate-bounce-soft" title="Хост">
                          👑
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 font-medium mt-1">
                      ✓ Готов к игре
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Пустые слоты */}
            {Array.from({ length: 4 - players.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-gray-100 bg-opacity-50 backdrop-blur-sm rounded-xl p-5 border-2 border-dashed border-gray-300 animate-pulse-glow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <div className="text-gray-400 font-medium">
                      Ожидание игрока...
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Информация */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <p className="text-gray-700 font-medium">
              {isHost ? (
                <>
                  <strong className="text-yellow-700">Вы хост игры.</strong> Вы можете начать игру, когда будет минимум 2 игрока.
                </>
              ) : (
                <>
                  <strong className="text-yellow-700">Ожидание хоста.</strong> Хост начнет игру, когда все будут готовы.
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
            className={`w-full font-bold py-5 px-8 rounded-xl transition-all text-xl shadow-lg ${
              canStart
                ? 'gradient-green text-white hover:shadow-2xl transform hover:scale-105 animate-pulse-glow'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canStart ? '🎮 Начать игру' : '⏳ Ожидание игроков (минимум 2)'}
          </button>
        )}

        {!isHost && (
          <div className="text-center py-5">
            <div className="inline-flex items-center gap-3 bg-white bg-opacity-50 rounded-full px-6 py-3">
              <div className="animate-spin text-2xl">⏳</div>
              <span className="text-gray-600 font-semibold">Ожидание начала игры...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
