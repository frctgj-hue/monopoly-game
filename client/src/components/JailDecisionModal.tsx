import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandcuffs, faDice, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

interface JailDecisionModalProps {
  playerName: string;
  playerMoney: number;
  jailTurns: number;
  onPayFine: () => void;
  onTryLuck: () => void;
  canPay: boolean;
}

const JailDecisionModal: React.FC<JailDecisionModalProps> = ({
  playerName,
  playerMoney,
  jailTurns,
  onPayFine,
  onTryLuck,
  canPay,
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center">
        {/* Иконка */}
        <div className="text-6xl mb-4 text-[var(--color-accent-red)] animate-pulse">
          <FontAwesomeIcon icon={faHandcuffs} />
        </div>

        {/* Заголовок */}
        <h2 className="theme-title text-2xl mb-2">
          🚔 Тюрьма
        </h2>

        {/* Имя игрока */}
        <p className="text-lg text-[var(--color-text-primary)] mb-4 font-semibold">
          {playerName}, ваш ход пропущен!
        </p>

        {/* Статус */}
        <div className="theme-panel-inset p-4 mb-6 rounded-lg">
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">
            Попытка выйти: <span className="font-bold text-[var(--color-accent-gold)]">{jailTurns + 1} из 3</span>
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Ваш баланс: <span className="font-bold">${playerMoney}</span>
          </p>
        </div>

        {/* Кнопки */}
        <div className="space-y-3">
          {/* Кнопка: Заплатить 50 */}
          <button
            onClick={onPayFine}
            disabled={!canPay}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 uppercase ${
              canPay
                ? 'bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-green)] text-white hover:scale-105 active:scale-95 hover:shadow-xl'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            <FontAwesomeIcon icon={faMoneyBillWave} />
            <span>Заплатить $50 и пропустить ход</span>
          </button>

          {/* Кнопка: Попытать удачу */}
          <button
            onClick={onTryLuck}
            className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 uppercase bg-gradient-to-r from-[var(--color-accent-gold)] to-[var(--color-accent-orange)] text-[var(--color-text-dark)] hover:scale-105 active:scale-95 hover:shadow-xl"
          >
            <FontAwesomeIcon icon={faDice} />
            <span>Попытать удачу (бросить на дубль)</span>
          </button>
        </div>

        {/* Подсказка */}
        <p className="text-xs text-[var(--color-text-muted)] mt-4 italic">
          💡 Если выпадет дубль — вы свободны! Иначе $50 спишется автоматически.
        </p>
      </div>
    </div>
  );
};

export default JailDecisionModal;