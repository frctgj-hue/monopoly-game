import React, { useState, useEffect } from 'react';
import type { Player, DiceRoll } from '../types/game.types';
import DiceAnimation from './DiceAnimation';
import TokenPiece from './TokenPiece';
import MoneyAnimation from './MoneyAnimation';

interface PlayerPanelProps {
  players: Player[];
  currentPlayerId: string;
  myPlayerId: string;
  lastDiceRoll?: DiceRoll;
  onRollDice: () => void;
  onEndTurn: () => void;
  canRoll: boolean;
  onPayJailFine?: () => void;
  onUseJailCard?: () => void;
  onOpenTrade?: () => void;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({
  players,
  currentPlayerId,
  myPlayerId,
  lastDiceRoll,
  onRollDice,
  onEndTurn,
  canRoll,
  onPayJailFine,
  onUseJailCard,
  onOpenTrade,
}) => {
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const isMyTurn = currentPlayerId === myPlayerId;
  const myPlayer = players.find(p => p.id === myPlayerId);

  const [previousMoney, setPreviousMoney] = useState<{ [key: string]: number }>({});
  const [moneyChanges, setMoneyChanges] = useState<{ [key: string]: { amount: number; type: 'gain' | 'loss'; trigger: number } }>({});

  useEffect(() => {
    // Отслеживаем изменения денег у игроков
    const newChanges: { [key: string]: { amount: number; type: 'gain' | 'loss'; trigger: number } } = {};

    players.forEach(player => {
      const prevMoney = previousMoney[player.id];
      if (prevMoney !== undefined && prevMoney !== player.money) {
        const diff = player.money - prevMoney;
        newChanges[player.id] = {
          amount: Math.abs(diff),
          type: diff > 0 ? 'gain' : 'loss',
          trigger: Date.now()
        };
      }
    });

    if (Object.keys(newChanges).length > 0) {
      setMoneyChanges(newChanges);
    }

    // Обновляем предыдущие значения
    const newPreviousMoney: { [key: string]: number } = {};
    players.forEach(player => {
      newPreviousMoney[player.id] = player.money;
    });
    setPreviousMoney(newPreviousMoney);
  }, [players]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {/* Панель текущего хода */}
        <div>
          <div className={`rounded-xl shadow-lg p-3 ${
            isMyTurn ? 'gradient-blue animate-pulse-glow' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TokenPiece color={currentPlayer?.color || 'gray'} size="md" animate={isMyTurn} />
                <div>
                  <h3 className={`text-lg font-bold ${isMyTurn ? 'text-white' : 'text-gray-800'}`}>
                    {isMyTurn ? '🎮 Ваш ход!' : `Ход: ${currentPlayer?.name}`}
                  </h3>
                  <p className={`text-sm font-semibold ${isMyTurn ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                    💰 ${currentPlayer?.money || 0}
                  </p>
                </div>
              </div>

              {/* Кубики */}
              {lastDiceRoll && (
                <DiceAnimation diceRoll={lastDiceRoll} isRolling={false} />
              )}
            </div>

            {/* Кнопки управления */}
            {isMyTurn && (
              <div className="flex gap-2">
                {currentPlayer?.inJail ? (
                  <>
                    <div className="flex-1 bg-red-100 border-2 border-red-400 rounded-lg p-2 text-center">
                      <div className="text-xl mb-1">🔒</div>
                      <div className="font-bold text-red-700 text-xs">В тюрьме</div>
                      <div className="text-[10px] text-red-600">Ход {currentPlayer.jailTurns + 1} из 3</div>
                    </div>
                    <div className="flex-1 space-y-1">
                      {onPayJailFine && currentPlayer.money >= 50 && (
                        <button
                          onClick={onPayJailFine}
                          className="w-full py-2 px-3 rounded-lg font-bold text-xs bg-green-500 text-white hover:bg-green-600 transition-all shadow-md"
                        >
                          💵 Заплатить $50
                        </button>
                      )}
                      {onUseJailCard && currentPlayer.getOutOfJailFreeCards > 0 && (
                        <button
                          onClick={onUseJailCard}
                          className="w-full py-2 px-3 rounded-lg font-bold text-xs bg-purple-500 text-white hover:bg-purple-600 transition-all shadow-md"
                        >
                          🎫 Использовать карточку
                        </button>
                      )}
                      <button
                        onClick={onRollDice}
                        disabled={!canRoll}
                        className={`w-full py-2 px-3 rounded-lg font-bold text-xs transition-all shadow-md ${
                          canRoll
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        🎲 Бросить (дубль)
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={onRollDice}
                      disabled={!canRoll}
                      className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all shadow-md ${
                        canRoll
                          ? 'bg-white text-blue-600 hover:bg-gray-50 hover:shadow-lg transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      🎲 Бросить кубики
                    </button>
                    <button
                      onClick={onEndTurn}
                      disabled={canRoll}
                      className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all shadow-md ${
                        !canRoll
                          ? 'bg-white text-green-600 hover:bg-gray-50 hover:shadow-lg transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      ✓ Завершить ход
                    </button>
                  </>
                )}
              </div>
            )}

            {!isMyTurn && (
              <div className="text-center py-2">
                <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1">
                  <div className="animate-spin text-sm">⏳</div>
                  <span className="text-gray-600 font-semibold text-xs">Ожидание...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Список игроков */}
        <div>
          <div className="bg-white rounded-xl shadow-lg p-3">
            <h3 className="text-sm font-bold mb-2 text-gray-800 flex items-center gap-1">
              <span>👥</span>
              <span>Игроки</span>
            </h3>

            {/* Кнопка торговли */}
            {onOpenTrade && myPlayer && !myPlayer.isBankrupt && (
              <button
                onClick={onOpenTrade}
                className="w-full mb-2 py-2 px-3 rounded-lg font-bold text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-md transform hover:scale-105 active:scale-95"
              >
                🤝 Торговля
              </button>
            )}

            <div className="space-y-2">
              {players.map(player => (
                <div
                  key={player.id}
                  className={`rounded-lg p-2 transition-all relative ${
                    player.isBankrupt
                      ? 'bg-gray-300 opacity-60'
                      : player.id === currentPlayerId
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md scale-105'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {/* Анимация изменения денег */}
                  {moneyChanges[player.id] && (
                    <MoneyAnimation
                      amount={moneyChanges[player.id].amount}
                      type={moneyChanges[player.id].type}
                      trigger={moneyChanges[player.id].trigger}
                    />
                  )}

                  <div className="flex items-center gap-2 mb-1">
                    <TokenPiece color={player.color} size="sm" />
                    <div className="flex-1">
                      <div className={`font-bold text-xs ${player.id === currentPlayerId ? 'text-white' : 'text-gray-800'}`}>
                        {player.name}
                        {player.id === myPlayerId && (
                          <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                            player.id === currentPlayerId ? 'bg-white bg-opacity-20' : 'bg-blue-100 text-blue-700'
                          }`}>
                            Вы
                          </span>
                        )}
                        {player.isBankrupt && (
                          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                            Банкрот
                          </span>
                        )}
                        {player.inJail && !player.isBankrupt && (
                          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500 text-white">
                            🔒
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center justify-between text-[10px] ${
                    player.id === currentPlayerId ? 'text-white text-opacity-90' : 'text-gray-600'
                  }`}>
                    <span className="font-semibold">💰 ${player.money}</span>
                    <span>🏠 {player.properties.length}</span>
                    {player.getOutOfJailFreeCards > 0 && (
                      <span>🎫 {player.getOutOfJailFreeCards}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPanel;
