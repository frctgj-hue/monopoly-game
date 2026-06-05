import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import type { Property, Player } from '../types/game.types';

interface RentModalProps {
  property: Property;
  rent: number;
  owner: Player;
  playerMoney: number;
  onConfirm: () => void;
  onBankruptcy: () => void;
}

const RentModal: React.FC<RentModalProps> = ({
  property,
  rent,
  owner,
  playerMoney,
  onConfirm,
  onBankruptcy,
}) => {
  const canPay = playerMoney >= rent;

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">
          <FontAwesomeIcon icon={faMoneyBillWave} className="text-[var(--color-accent-red)]" />
        </div>
        <p className="theme-text-muted mb-2">
          Вы попали на недвижимость игрока <span className="font-bold" style={{ color: owner.color }}>{owner.name}</span>
        </p>
      </div>

      <div className="theme-panel-inset p-4 mb-4">
        <div className="text-center mb-2">
          <span className="text-lg font-bold text-[var(--color-text-primary)]">{property.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="theme-text-label font-bold" style={{ color: 'var(--color-text-secondary)' }}>Аренда:</span>
          <span className="text-3xl font-bold text-[var(--color-accent-red)]">${rent}</span>
        </div>
      </div>

      <div className="theme-panel-inset p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="theme-text-label font-bold" style={{ color: 'var(--color-text-secondary)' }}>Ваш баланс:</span>
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
          Оплатить
        </button>
        {!canPay && (
          <div className="text-center text-sm font-bold theme-panel-inset p-2 mt-2 rounded-lg" style={{ color: 'var(--color-accent-red)' }}>
            ⚠️ Недостаточно средств
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
            Объявить банкротство
          </button>
        )}
      </div>
    </div>
  );
};

export default RentModal;