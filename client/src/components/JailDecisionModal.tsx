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
    <div className="p-6">
      <div className="text-center mb-6">
        {/* Иконка */}
        <div className="text-6xl mb-4">
          <FontAwesomeIcon icon={faHandcuffs} className="text-[var(--color-accent-red)]" />
        </div>
        
        {/* Заголовок */}
        <h2 className="theme-title text-2xl mb-2">
          🚔 Тюрьма — ход пропущен!
        </h2>
        
        {/* Имя игрока */}
        <p className="theme-text-muted mb-4">
          <span className="font-bold" style={{ color: 'var(--color-accent-red)' }}>{playerName}</span>, выберите действие:
        </p>
      </div>

      {/* Статус */}
      <div className="theme-panel-inset p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="theme-text-label font-bold">Попытка выхода:</span>
          <span className="text-xl font-bold text-[var(--color-accent-gold)]">
            {jailTurns + 1} из 3
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="theme-text-label font-bold">Ваш баланс:</span>
          <span className={`text-xl font-bold ${canPay ? 'text-[var(--color-text-gold)]' : 'text-[var(--color-accent-red)]'}`}>
            ${playerMoney}
          </span>
        </div>
      </div>

      {/* Кнопки */}
      <div className="space-y-2">
        {/* Кнопка: Заплатить 50 */}
        <button
          onClick={onPayFine}
          disabled={!canPay}
          className={`theme-btn w-full py-3 px-6 rounded-lg font-bold text-lg uppercase transition-all shadow-lg ${
            canPay
              ? 'hover:scale-105 active:scale-95'
              : 'opacity-50 cursor-not-allowed theme-panel-inset'
          }`}
          style={canPay ? {
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(13, 148, 136, 0.3)'
          } : {}}
        >
          <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
          Заплатить $50 и пропустить ход
        </button>

        {/* Кнопка: Попытать удачу */}
        <button
          onClick={onTryLuck}
          className="theme-btn w-full py-3 px-6 rounded-lg font-bold text-lg text-white transition-all uppercase shadow-lg hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
          }}
        >
          <FontAwesomeIcon icon={faDice} className="mr-2" />
          Попытать удачу (бросить на дубль)
        </button>
      </div>

      {/* Подсказка */}
      <p className="theme-text-muted text-xs text-center mt-4 italic">
        💡 Если выпадет дубль — вы свободны! Иначе $50 спишется автоматически.
      </p>
    </div>
  );
};

export default JailDecisionModal;