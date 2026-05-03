import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';

interface TaxModalProps {
  taxType: 'income' | 'luxury';
  amount: number;
  onConfirm: () => void;
}

const TaxModal: React.FC<TaxModalProps> = ({ taxType, amount, onConfirm }) => {
  const isIncomeTax = taxType === 'income';

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
        <p className="text-base text-gray-800 mb-6 font-medium">
          Вы должны заплатить налог в размере ${amount}
        </p>

        {/* Кнопка */}
        <button
          onClick={onConfirm}
          className="w-full py-3 px-6 text-white rounded-lg font-bold text-lg transition-all shadow-lg uppercase"
          style={{ backgroundColor: '#dc3545' }}
        >
          Оплатить
        </button>
      </div>
    </div>
  );
};

export default TaxModal;
