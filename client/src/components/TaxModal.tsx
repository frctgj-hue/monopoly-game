import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faSkull } from '@fortawesome/free-solid-svg-icons';

interface TaxModalProps {
  taxType: 'income' | 'luxury';
  amount: number;
  playerMoney: number;
  onConfirm: () => void;
  onBankruptcy: () => void;
}

const TaxModal: React.FC<TaxModalProps> = ({
  taxType,
  amount,
  playerMoney,
  onConfirm,
  onBankruptcy,
}) => {
  const canPay = playerMoney >= amount;
  const title = taxType === 'income' ? 'Подоходный налог' : 'Налог на роскошь';
  const description = taxType === 'income'
    ? 'Оплатите 10% от вашего капитала или $200'
    : 'Оплатите налог на роскошь';

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">
          <FontAwesomeIcon icon={faMoneyBillWave} className="text-[var(--color-accent-red)]" />
        </div>
        <h2 className="theme-title text-2xl mb-2">
          {title}
        </h2>
        <p className="theme-text-muted mb-4">
          {description}
        </p>
      </div>

      <div className="theme-panel-inset p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="theme-text-label font-bold">Сумма налога:</span>
          <span className="text-3xl font-bold text-[var(--color-accent-red)]">${amount}</span>
        </div>
      </div>

      <div className="theme-panel-inset p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="theme-text-label font-bold">Ваш баланс:</span>
          <span className={`text-2xl font-bold ${canPay ? 'text-[var(--color-text-gold)]' : 'text-[var(--color-accent-red)]'}`}>
            ${playerMoney}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={onConfirm}
          disabled={!canPay}
          className={`theme-btn w-full py-3 px-6 rounded-lg font-bold text-lg uppercase transition-all shadow-lg ${
            canPay
              ? 'hover:scale-105 active:scale-95'
              : 'opacity-50 cursor-not-allowed theme-panel-inset'
          }`}
          style={canPay ? {
            background: 'linear-gradient(135deg, #dc3545 0%, #b02a37 100%)',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(220, 53, 69, 0.3)'
          } : {}}
        >
          Оплатить налог
        </button>
        {!canPay && (
          <div className="theme-toast error p-2 mt-2 text-center text-sm font-bold">
            ⚠️ Недостаточно средств для оплаты налога
          </div>
        )}
        {!canPay && (
          <button
            onClick={onBankruptcy}
            className="theme-btn w-full py-3 px-6 rounded-lg font-bold text-lg text-white transition-all uppercase shadow-lg hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #333 0%, #000 100%)',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            <FontAwesomeIcon icon={faSkull} className="mr-2" />
            Объявить банкротство
          </button>
        )}
      </div>
    </div>
  );
};

export default TaxModal;