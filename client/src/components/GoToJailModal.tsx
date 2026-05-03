import React from 'react';

interface GoToJailModalProps {
  onConfirm: () => void;
}

const GoToJailModal: React.FC<GoToJailModalProps> = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in border-4 border-red-600">
        <div className="text-center">
          {/* Иконка */}
          <div className="text-8xl mb-6 animate-bounce-soft">
            👮
          </div>

          {/* Заголовок */}
          <h2 className="text-3xl font-black text-red-600 mb-4 uppercase">
            Отправляйтесь в тюрьму!
          </h2>

          {/* Описание */}
          <p className="text-lg text-gray-700 mb-8">
            Вы попали на клетку "Идти в тюрьму".<br />
            Переместитесь в тюрьму без получения $200 за прохождение "Старт".
          </p>

          {/* Кнопка */}
          <button
            onClick={onConfirm}
            className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoToJailModal;
