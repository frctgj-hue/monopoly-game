import React from 'react';
import type { Player, DiceRoll } from '../types/game.types';
import DiceAnimation from './DiceAnimation';
import TokenPiece from './TokenPiece';
import MoneyAnimation from './MoneyAnimation';

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  isMyPlayer: boolean;
  lastDiceRoll?: DiceRoll;
  canRoll: boolean;
  onRollDice?: () => void;
  onEndTurn?: () => void;
  onPayJailFine?: () => void;
  onUseJailCard?: () => void;
  onOpenTrade?: () => void;
  onOpenPropertyManagement?: () => void;
  moneyChange?: { amount: number; type: 'gain' | 'loss'; trigger: number };
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isCurrentPlayer,
  isMyPlayer,
  lastDiceRoll,
  canRoll,
  onRollDice,
  onEndTurn,
  onPayJailFine,
  onUseJailCard,
  onOpenTrade,
  onOpenPropertyManagement,
  moneyChange,
}) => {
  return (
    <div
      className={`rounded-xl shadow-lg p-3 transition-all relative ${
        player.isBankrupt
          ? 'bg-gray-300 opacity-60'
          : isCurrentPlayer
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl scale-105 animate-pulse-glow'
          : 'bg-white'
      }`}
    >
      {/* Анимация изменения денег */}
      {moneyChange && (
        <MoneyAnimation
          amount={moneyChange.amount}
          type={moneyChange.type}
          trigger={moneyChange.trigger}
        />
      )}

      {/* Заголовок карточки */}
      <div className="flex items-center gap-2 mb-2">
        <TokenPiece color={player.color} size="md" animate={isCurrentPlayer} />
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm flex items-center gap-1 flex-wrap ${isCurrentPlayer ? 'text-white' : 'text-gray-800'}`}>
            <span className="truncate">{player.name}</span>
            {isMyPlayer && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                isCurrentPlayer ? 'bg-white bg-opacity-20' : 'bg-blue-100 text-blue-700'
              }`}>
                Вы
              </span>
            )}
            {player.isBankrupt && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white whitespace-nowrap">
                Банкрот
              </span>
            )}
            {player.inJail && !player.isBankrupt && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500 text-white whitespace-nowrap">
                🔒
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Информация */}
      <div className={`flex items-center justify-between text-[10px] mb-2 ${
        isCurrentPlayer ? 'text-white text-opacity-90' : 'text-gray-600'
      }`}>
        <span className="font-semibold">💰 ${player.money}</span>
        <span>🏠 {player.properties.length}</span>
        {player.getOutOfJailFreeCards > 0 && (
          <span>🎫 {player.getOutOfJailFreeCards}</span>
        )}
      </div>

      {/* Кубики */}
      {isCurrentPlayer && lastDiceRoll && (
        <div className="mb-2 flex justify-center">
          <DiceAnimation diceRoll={lastDiceRoll} isRolling={false} />
        </div>
      )}

      {/* Кнопки управления (только для текущего игрока) */}
      {isMyPlayer && isCurrentPlayer && !player.isBankrupt && (
        <div className="space-y-2">
          {player.inJail ? (
            <>
              <div className="bg-red-100 border border-red-400 rounded-lg p-2 text-center mb-1">
                <div className="text-lg">🔒</div>
                <div className="font-bold text-red-700 text-[10px]">В тюрьме</div>
                <div className="text-[8px] text-red-600">Ход {player.jailTurns + 1} из 3</div>
              </div>
              {onPayJailFine && player.money >= 50 && (
                <button
                  onClick={onPayJailFine}
                  className="w-full py-1.5 px-2 rounded-lg font-bold text-[10px] bg-green-500 text-white hover:bg-green-600 transition-all"
                >
                  💵 Заплатить $50
                </button>
              )}
              {onUseJailCard && player.getOutOfJailFreeCards > 0 && (
                <button
                  onClick={onUseJailCard}
                  className="w-full py-1.5 px-2 rounded-lg font-bold text-[10px] bg-purple-500 text-white hover:bg-purple-600 transition-all"
                >
                  🎫 Карточка
                </button>
              )}
              {onRollDice && (
                <button
                  onClick={onRollDice}
                  disabled={!canRoll}
                  className={`w-full py-1.5 px-2 rounded-lg font-bold text-[10px] transition-all ${
                    canRoll
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🎲 Дубль
                </button>
              )}
            </>
          ) : (
            <>
              {onRollDice && (
                <button
                  onClick={onRollDice}
                  disabled={!canRoll}
                  className={`w-full py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                    canRoll
                      ? 'bg-white text-blue-600 hover:bg-gray-50 shadow-md'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🎲 Бросить кубики
                </button>
              )}
              {onEndTurn && (
                <button
                  onClick={onEndTurn}
                  disabled={canRoll}
                  className={`w-full py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                    !canRoll
                      ? 'bg-white text-green-600 hover:bg-gray-50 shadow-md'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  ✓ Завершить ход
                </button>
              )}
            </>
          )}

          {/* Кнопка управления недвижимостью */}
          {onOpenPropertyManagement && player.properties.length > 0 && (
            <button
              onClick={onOpenPropertyManagement}
              className="w-full py-1.5 px-2 rounded-lg font-bold text-[10px] bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              🏠 Недвижимость ({player.properties.length})
            </button>
          )}

          {/* Кнопка торговли */}
          {onOpenTrade && (
            <button
              onClick={onOpenTrade}
              className="w-full py-1.5 px-2 rounded-lg font-bold text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              🤝 Торговля
            </button>
          )}
        </div>
      )}

      {/* Индикатор ожидания для других игроков */}
      {isMyPlayer && !isCurrentPlayer && !player.isBankrupt && (
        <div className="text-center py-2">
          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
            <div className="animate-spin text-xs">⏳</div>
            <span className="text-gray-600 font-semibold text-[10px]">Ожидание...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
