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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#2d8659' }}>
      <div className="bg-white rounded-lg shadow-2xl p-10 max-w-3xl w-full border-4 border-black">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-3 uppercase">
            Комната ожидания
          </h2>
          <p className="text-gray-600 text-lg">Ожидание игроков...</p>
        </div>

        {/* ID игры с кнопкой копирования */}
        <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 mb-8">
          <p className="text-gray-700 text-sm font-bold text-center mb-2 uppercase">
            ID игры для друзей:
          </p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-3xl font-mono font-bold text-gray-800">
              {gameId}
            </p>
            <button
              onClick={handleCopyGameId}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all font-semibold flex items-center gap-2"
            >
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
              {copied ? 'Скопировано!' : 'Копировать'}
            </button>
          </div>
        </div>

        {/* Прогресс-бар игроков */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-800 uppercase">
              Игроки
            </h3>
            <span className="text-lg font-bold text-gray-800">
              {players.length}/4
            </span>
          </div>
          <div className="w-full bg-gray-200 border-2 border-gray-300 h-4">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(players.length / 4) * 100}%`,
                backgroundColor: '#2d8659'
              }}
            />
          </div>
        </div>

        {/* Список игроков */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="bg-white border-2 border-gray-300 rounded-lg p-5 shadow-md hover:border-gray-400 transition-all"
              >
                <div className="flex items-center gap-4">
                  <TokenPiece color={player.color} size="lg" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 text-lg">
                        {player.name}
                      </span>
                      {player.id === myPlayerId && (
                        <span className="bg-gray-800 text-white text-xs px-2 py-1 font-bold uppercase">
                          Вы
                        </span>
                      )}
                      {index === 0 && (
                        <FontAwesomeIcon icon={faCrown} className="text-yellow-600" title="Хост" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600 font-medium mt-1">
                      <FontAwesomeIcon icon={faCheck} className="text-green-600" /> Готов к игре
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Пустые слоты */}
            {Array.from({ length: 4 - players.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-5"
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
        <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-5 mb-6">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={faInfoCircle} className="text-2xl text-gray-700 mt-1" />
            <p className="text-gray-700 font-medium">
              {isHost ? (
                <>
                  <strong className="text-gray-900">Вы хост игры.</strong> Вы можете начать игру, когда будет минимум 2 игрока.
                </>
              ) : (
                <>
                  <strong className="text-gray-900">Ожидание хоста.</strong> Хост начнет игру, когда все будут готовы.
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
            className={`w-full font-bold py-5 px-8 rounded-lg transition-all text-xl shadow-lg uppercase ${
              canStart
                ? 'text-white hover:shadow-2xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={canStart ? { backgroundColor: '#dc3545' } : {}}
          >
            <FontAwesomeIcon icon={canStart ? faGamepad : faClock} className="mr-2" />
            {canStart ? 'Начать игру' : 'Ожидание игроков (минимум 2)'}
          </button>
        )}

        {!isHost && (
          <div className="text-center py-5">
            <div className="inline-flex items-center gap-3 bg-gray-100 border-2 border-gray-300 rounded-lg px-6 py-3">
              <FontAwesomeIcon icon={faClock} className="text-2xl text-gray-600" />
              <span className="text-gray-700 font-bold uppercase">Ожидание начала игры...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
