import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faSkull } from '@fortawesome/free-solid-svg-icons';

interface TaxModalProps {
  taxType: 'income' | 'luxury';
  amount: number;
  playerMoney: number;
  onConfirm: () => void;
  onBankruptcy: () => void;
}

const TaxModal: React.FC<TaxModalProps> = ({ taxType, amount, playerMoney, onConfirm, onBankruptcy }) => {
  const isIncomeTax = taxType === 'income';
  const canAfford = playerMoney >= amount;

  return (
    <div className="w-full">
      <div className="text-center">
        {/* Иконка */}
        <div className="text-6xl mb-4 text-red-600">
          <FontAwesomeIcon icon={faMoneyBill} />
        </div>

        {/* Заголовок */}
        <h2 className="text-2xl font-black text-red-600 mb-3 uppercase">
          {isIncomeTax ? 'Подоходный налог' : 'Налог на роскошь'}
        </h2>

        {/* Описание */}
        <p className="text-base text-gray-800 mb-2 font-medium">
          Вы должны заплатить налог в размере ${amount}
        </p>

        {/* Информация о балансе */}
        <p className={`text-sm mb-6 font-bold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
          Ваш баланс: ${playerMoney}
        </p>

        {/* Предупреждение о недостатке средств */}
        {!canAfford && (
          <div className="bg-red-100 border-2 border-red-600 rounded-lg p-3 mb-4">
            <p className="text-red-800 font-black text-sm uppercase">
              ⚠️ Недостаточно средств!
            </p>
            <p className="text-red-700 text-xs mt-1">
              Вы должны объявить банкротство
            </p>
          </div>
        )}

        {/* Кнопки */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            disabled={!canAfford}
            className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all uppercase ${
              canAfford
                ? 'bg-[#2d6b4a] text-white hover:bg-[#357a55] hover:scale-105 active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Оплатить ${amount}
          </button>

          <button
            onClick={onBankruptcy}
            className="w-full py-3 px-6 bg-gradient-to-r from-[#c92a3a] to-[#b01f2e] text-white rounded-lg font-bold text-lg transition-all hover:from-[#b01f2e] hover:to-[#9a1a27] hover:scale-105 active:scale-95 uppercase flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faSkull} />
            <span>Объявить банкротство</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxModal;
