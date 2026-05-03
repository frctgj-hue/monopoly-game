import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandcuffs } from '@fortawesome/free-solid-svg-icons';

interface GoToJailModalProps {
  onConfirm: () => void;
}

const GoToJailModal: React.FC<GoToJailModalProps> = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 border-4 border-red-600">
        <div className="text-center">
          {/* Иконка */}
          <div className="text-8xl mb-6 text-red-600">
            <FontAwesomeIcon icon={faHandcuffs} />
          </div>

          {/* Заголовок */}
          <h2 className="text-3xl font-black text-red-600 mb-4 uppercase">
            Отправляйтесь в тюрьму!
          </h2>

          {/* Описание */}
          <p className="text-lg text-gray-800 mb-8 font-medium">
            Вы попали на клетку "Идти в тюрьму".<br />
            Переместитесь в тюрьму без получения $200 за прохождение "Старт".
          </p>

          {/* Кнопка */}
          <button
            onClick={onConfirm}
            className="w-full py-4 px-6 text-white rounded-lg font-bold text-lg transition-all shadow-lg uppercase"
            style={{ backgroundColor: '#dc3545' }}
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoToJailModal;
