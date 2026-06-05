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
          <div className={`theme-panel p-3 ${isMyTurn ? 'animate-glow border-[var(--color-accent-gold)]' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TokenPiece color={currentPlayer?.color || 'gray'} size="md" animate={isMyTurn} />
                <div>
                  <h3 className={`text-lg font-bold ${isMyTurn ? 'text-[var(--color-text-gold)]' : 'text-[var(--color-text-primary)]'}`}>
                    {isMyTurn ? '🎮 Ваш ход!' : `Ход: ${currentPlayer?.name}`}
                  </h3>
                  <p className={`text-sm font-semibold ${isMyTurn ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-muted)]'}`}>
                    💰 ${currentPlayer?.money || 0}
                  </p>
                </div>
              </div>
              {lastDiceRoll && <DiceAnimation diceRoll={lastDiceRoll} isRolling={false} />}
            </div>

            {/* Кнопки управления */}
            {isMyTurn && (
              <div className="flex gap-2">
                {currentPlayer?.inJail ? (
                  <>
                    <div className="flex-1 theme-panel-inset p-2 text-center border-l-4 border-[var(--color-accent-red)]">
                      <div className="text-xl mb-1">🔒</div>
                      <div className="font-bold text-[var(--color-accent-red)] text-xs">В тюрьме</div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">Ход {currentPlayer.jailTurns + 1} из 3</div>
                    </div>
                    <div className="flex-1 space-y-1">
                      {onPayJailFine && currentPlayer.money >= 50 && (
                        <button
                          onClick={onPayJailFine}
                          className="w-full py-2 px-3 rounded-lg font-bold text-xs theme-btn theme-btn-secondary"
                        >
                          💵 Заплатить $50
                        </button>
                      )}
                      {onUseJailCard && currentPlayer.getOutOfJailFreeCards > 0 && (
                        <button
                          onClick={onUseJailCard}
                          className="w-full py-2 px-3 rounded-lg font-bold text-xs theme-btn" style={{ background: '#8b5cf6', color: '#fff' }}
                        >
                          🎫 Карточка
                        </button>
                      )}
                      <button
                        onClick={onRollDice}
                        disabled={!canRoll}
                        className={`w-full py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                          canRoll ? 'theme-btn theme-btn-primary' : 'opacity-30 cursor-not-allowed theme-panel-inset'
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
                      className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
                        canRoll
                          ? 'theme-btn theme-btn-ghost hover:scale-105'
                          : 'opacity-30 cursor-not-allowed theme-panel-inset'
                      }`}
                    >
                      🎲 Бросить кубики
                    </button>
                    <button
                      onClick={onEndTurn}
                      disabled={canRoll}
                      className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
                        !canRoll
                          ? 'theme-btn theme-btn-secondary hover:scale-105'
                          : 'opacity-30 cursor-not-allowed theme-panel-inset'
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
                <div className="theme-panel-inset inline-flex items-center gap-2 rounded-full px-4 py-1">
                  <div className="animate-spin text-sm">⏳</div>
                  <span className="theme-text-muted font-semibold">Ожидание...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Список игроков */}
        <div>
          <div className="theme-panel p-3">
            <h3 className="theme-text-label mb-2 flex items-center gap-1">
              <span>👥</span>
              <span>Игроки</span>
            </h3>

            {onOpenTrade && myPlayer && !myPlayer.isBankrupt && (
              <button
                onClick={onOpenTrade}
                className="w-full mb-2 py-2 px-3 rounded-lg font-bold text-xs theme-btn hover:scale-105"
                style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', color: '#fff' }}
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
                      ? 'theme-panel-inset opacity-60'
                      : player.id === currentPlayerId
                      ? 'theme-panel border-l-4 border-[var(--color-accent-blue)] scale-105'
                      : 'theme-panel-inset hover:brightness-110'
                  }`}
                >
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
                      <div className={`font-bold text-xs ${player.id === currentPlayerId ? 'text-[var(--color-text-gold)]' : 'text-[var(--color-text-primary)]'}`}>
                        {player.name}
                        {player.id === myPlayerId && (
                          <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                            player.id === currentPlayerId ? 'bg-[var(--color-accent-gold)] bg-opacity-20' : 'theme-btn-primary'
                          }`}>
                            Вы
                          </span>
                        )}
                        {player.isBankrupt && (
                          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full theme-btn" style={{ background: 'var(--color-accent-red)', color: '#fff' }}>
                            Банкрот
                          </span>
                        )}
                        {player.inJail && !player.isBankrupt && (
                          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full theme-btn" style={{ background: '#f97316', color: '#fff' }}>
                            🔒
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center justify-between text-[10px] ${
                    player.id === currentPlayerId ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-muted)]'
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