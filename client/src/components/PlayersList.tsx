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
    <div className="bg-white rounded-lg shadow-lg border-2 border-black p-4">
      <h2 className="text-lg font-black uppercase mb-3 text-center monopoly-title">
        Игроки
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left py-2 text-xs font-medium uppercase">Игрок</th>
            <th className="text-right py-2 text-xs font-medium uppercase">Деньги</th>
            <th className="text-center py-2 text-xs font-medium uppercase">Имущество</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const isCurrentPlayer = player.id === currentPlayerId;
            const isMe = player.id === myPlayerId;

            return (
              <tr
                key={player.id}
                className={`border-b border-gray-300 ${
                  isCurrentPlayer ? 'bg-yellow-100' : ''
                } ${player.isBankrupt ? 'opacity-50' : ''}`}
              >
                {/* Имя игрока */}
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <TokenPiece color={player.color} size="sm" />
                    <div>
                      <div className="font-medium text-sm">
                        {player.name}
                        {isMe && <span className="ml-1 text-xs text-blue-600">(Вы)</span>}
                      </div>
                      {isCurrentPlayer && (
                        <div className="text-xs font-bold uppercase flex items-center gap-1" style={{ color: '#2d8659' }}>
                          <FontAwesomeIcon icon={faPlay} /> Ходит
                        </div>
                      )}
                      {player.isBankrupt && (
                        <div className="text-xs text-red-600 font-medium">
                          Банкрот
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Деньги */}
                <td className="text-right py-2">
                  <div className="font-medium text-sm monopoly-price">
                    ${player.money}
                  </div>
                </td>

                {/* Имущество */}
                <td className="text-center py-2">
                  <div className="text-sm">
                    <div className="font-medium flex items-center justify-center gap-1">
                      {player.properties.length} <FontAwesomeIcon icon={faHouse} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlayersList;
