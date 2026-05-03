import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandcuffs } from '@fortawesome/free-solid-svg-icons';

interface GoToJailModalProps {
  onConfirm: () => void;
}

const GoToJailModal: React.FC<GoToJailModalProps> = ({ onConfirm }) => {
  return (
    <div className="w-full">
      <div className="text-center">
        {/* Иконка */}
        <div className="text-6xl mb-4 text-red-600">
          <FontAwesomeIcon icon={faHandcuffs} />
        </div>

        {/* Заголовок */}
        <h2 className="text-2xl font-black text-red-600 mb-3 uppercase">
          Отправляйтесь в тюрьму!
        </h2>

        {/* Описание */}
        <p className="text-base text-gray-800 mb-6 font-medium">
          Вы попали на клетку "Идти в тюрьму".<br />
          Переместитесь в тюрьму без получения $200 за прохождение "Старт".
        </p>

        {/* Кнопка */}
        <button
          onClick={onConfirm}
          className="w-full py-3 px-6 text-white rounded-lg font-bold text-lg transition-all shadow-lg uppercase"
          style={{ backgroundColor: '#dc3545' }}
        >
          Далее
        </button>
      </div>
    </div>
  );
};

export default GoToJailModal;
