import React, { useState, useEffect } from 'react';
import type { Player, DiceRoll } from '../types/game.types';
import PlayerCard from './PlayerCard';

interface PlayersSidebarProps {
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
  onOpenPropertyManagement?: () => void;
}

const PlayersSidebar: React.FC<PlayersSidebarProps> = ({
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
  onOpenPropertyManagement,
}) => {
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
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1 px-2">
        <span>👥</span>
        <span>Игроки</span>
      </h3>

      {players.map(player => (
        <PlayerCard
          key={player.id}
          player={player}
          isCurrentPlayer={player.id === currentPlayerId}
          isMyPlayer={player.id === myPlayerId}
          lastDiceRoll={player.id === currentPlayerId ? lastDiceRoll : undefined}
          canRoll={canRoll}
          onRollDice={player.id === myPlayerId ? onRollDice : undefined}
          onEndTurn={player.id === myPlayerId ? onEndTurn : undefined}
          onPayJailFine={player.id === myPlayerId ? onPayJailFine : undefined}
          onUseJailCard={player.id === myPlayerId ? onUseJailCard : undefined}
          onOpenTrade={player.id === myPlayerId ? onOpenTrade : undefined}
          onOpenPropertyManagement={player.id === myPlayerId ? onOpenPropertyManagement : undefined}
          moneyChange={moneyChanges[player.id]}
        />
      ))}
    </div>
  );
};

export default PlayersSidebar;
