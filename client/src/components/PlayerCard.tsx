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
      className={`theme-panel p-4 transition-all relative ${
        player.isBankrupt ? 'opacity-60' : isCurrentPlayer ? 'animate-glow scale-105' : ''
      }`}
      style={{
        background: player.isBankrupt ? 'var(--color-bg-tertiary)' : isCurrentPlayer ? 'linear-gradient(135deg, var(--color-accent-gold) 0%, #f4d03f 100%)' : 'var(--color-bg-secondary)',
        boxShadow: isCurrentPlayer
          ? '0 8px 24px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.2)'
          : 'var(--shadow-md)',
      }}
    >
      {/* Анимация изменения денег */}
      {moneyChange && (
        <MoneyAnimation amount={moneyChange.amount} type={moneyChange.type} trigger={moneyChange.trigger} />
      )}

      {/* Заголовок карточки */}
      <div className="flex items-center gap-2 mb-3">
        <TokenPiece color={player.color} size="md" animate={isCurrentPlayer} />
        <div className="flex-1 min-w-0">
          <div className={`font-light text-sm flex items-center gap-2 flex-wrap tracking-wide ${isCurrentPlayer ? 'text-gray-900' : 'theme-text-primary'}`}>
            <span className="truncate font-medium">{player.name}</span>
            {isMyPlayer && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap tracking-wider ${isCurrentPlayer ? 'bg-gray-900 bg-opacity-20 text-gray-900' : 'theme-panel-inset theme-text-muted'}`}>
                ВЫ
              </span>
            )}
            {player.isBankrupt && (
              <span className="text-[10px] px-2 py-0.5 rounded-full theme-toast error whitespace-nowrap tracking-wider">
                БАНКРОТ
              </span>
            )}
            {player.inJail && !player.isBankrupt && (
              <span className="text-[10px] px-2 py-0.5 rounded-full theme-toast warning whitespace-nowrap">
                🔒
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Информация */}
      <div className={`flex items-center justify-between text-xs mb-3 font-light tracking-wide ${isCurrentPlayer ? 'text-gray-900' : 'theme-text-muted'}`}>
        <span className="font-medium">💰 ${player.money}</span>
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
              <div className="theme-panel-inset p-3 text-center mb-2">
                <div className="text-2xl mb-1">🔒</div>
                <div className="font-medium text-[var(--color-accent-red)] text-xs tracking-wider">В ТЮРЬМЕ</div>
                <div className="text-[10px] text-[var(--color-text-muted)] mt-1">Ход {player.jailTurns + 1} из 3</div>
              </div>
              {onPayJailFine && player.money >= 50 && (
                <button onClick={onPayJailFine} className="theme-btn theme-btn-secondary w-full py-2 px-3 rounded-xl font-light text-xs tracking-wider hover:scale-105">
                  💵 Заплатить $50
                </button>
              )}
              {onUseJailCard && player.getOutOfJailFreeCards > 0 && (
                <button onClick={onUseJailCard} className="theme-btn w-full py-2 px-3 rounded-xl font-light text-xs tracking-wider hover:scale-105" style={{ background: 'var(--color-accent-purple)', color: '#fff' }}>
                  🎫 Использовать карточку
                </button>
              )}
              {onRollDice && (
                <button onClick={onRollDice} disabled={!canRoll} className={`theme-btn w-full py-2 px-3 rounded-xl font-light text-xs tracking-wider transition-all ${canRoll ? 'hover:scale-105' : 'opacity-30 cursor-not-allowed theme-panel-inset'}`} style={canRoll ? { background: 'var(--color-bg-primary)', color: 'var(--color-text-gold)' } : {}}>
                  🎲 Попытка дубля
                </button>
              )}
            </>
          ) : (
            <>
              {onRollDice && (
                <button onClick={onRollDice} disabled={!canRoll} className={`theme-btn w-full py-3 px-4 rounded-xl font-light text-sm tracking-wider transition-all ${canRoll ? 'hover:scale-105' : 'opacity-30 cursor-not-allowed theme-panel-inset'}`} style={canRoll ? { background: 'var(--color-bg-primary)', color: 'var(--color-text-gold)', boxShadow: 'var(--shadow-lg)' } : {}}>
                  🎲 Бросить кубики
                </button>
              )}
              {onEndTurn && (
                <button onClick={onEndTurn} disabled={canRoll} className={`theme-btn theme-btn-secondary w-full py-3 px-4 rounded-xl font-light text-sm tracking-wider transition-all ${!canRoll ? 'hover:scale-105' : 'opacity-30 cursor-not-allowed'}`}>
                  ✓ Завершить ход
                </button>
              )}
            </>
          )}

          {/* Кнопка управления недвижимостью */}
          {onOpenPropertyManagement && player.properties.length > 0 && (
            <button onClick={onOpenPropertyManagement} className="theme-btn w-full py-2 px-3 rounded-xl font-light text-xs tracking-wider hover:scale-105" style={{ background: 'linear-gradient(135deg, var(--color-accent-green) 0%, #1e5631 100%)', color: '#fff' }}>
              🏠 Недвижимость ({player.properties.length})
            </button>
          )}

          {/* Кнопка торговли */}
          {onOpenTrade && (
            <button onClick={onOpenTrade} className="theme-btn w-full py-2 px-3 rounded-xl font-light text-xs tracking-wider hover:scale-105" style={{ background: 'linear-gradient(135deg, var(--color-accent-purple) 0%, #ec4899 100%)', color: '#fff' }}>
              🤝 Торговля
            </button>
          )}
        </div>
      )}

      {/* Индикатор ожидания для других игроков */}
      {isMyPlayer && !isCurrentPlayer && !player.isBankrupt && (
        <div className="text-center py-3">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 theme-panel-inset">
            <div className="animate-spin text-sm">⏳</div>
            <span className="theme-text-muted font-light text-xs tracking-wider">Ожидание...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;