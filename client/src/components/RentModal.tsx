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
          <FontAwesomeIcon icon={faMoneyBillWave} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-black uppercase mb-2 monopoly-title">
          Оплата аренды
        </h2>
        <p className="text-gray-700 mb-4">
          Вы попали на недвижимость игрока <span className="font-bold" style={{ color: owner.color }}>{owner.name}</span>
        </p>
      </div>

      <div className="bg-gray-100 border-2 border-gray-300 p-4 mb-4">
        <div className="text-center mb-2">
          <span className="text-lg font-bold text-gray-800">{property.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-bold uppercase">Аренда:</span>
          <span className="text-3xl font-bold text-red-600">${rent}</span>
        </div>
      </div>

      <div className="bg-gray-100 border-2 border-gray-300 p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-bold uppercase">Ваш баланс:</span>
          <span className={`text-2xl font-bold ${canPay ? 'text-gray-900' : 'text-red-600'}`}>
            ${playerMoney}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={onConfirm}
          disabled={!canPay}
          className="w-full py-3 px-6 rounded-lg font-bold text-lg text-white transition-all uppercase shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={canPay ? { backgroundColor: '#dc3545' } : { backgroundColor: '#999' }}
        >
          Оплатить
        </button>
        {!canPay && (
          <div className="text-center text-sm text-red-600 font-bold">
            ⚠️ Недостаточно средств
          </div>
        )}
        {!canPay && (
          <button
            onClick={onBankruptcy}
            className="w-full py-3 px-6 rounded-lg font-bold text-lg text-white transition-all uppercase shadow-lg"
            style={{ backgroundColor: '#000' }}
          >
            Объявить банкротство
          </button>
        )}
      </div>
    </div>
  );
};

export default RentModal;
