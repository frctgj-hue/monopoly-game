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
        <div className="text-6xl mb-4 text-[var(--color-accent-red)]">
          <FontAwesomeIcon icon={faHandcuffs} />
        </div>

        {/* Заголовок */}
        <h2 className="theme-title text-2xl mb-3">
          Отправляйтесь в тюрьму!
        </h2>

        {/* Описание */}
        <p className="text-base text-[var(--color-text-primary)] mb-6 font-medium">
          Вы попали на клетку "Идти в тюрьму".<br />
          Переместитесь в тюрьму без получения $200 за прохождение "Старт".
        </p>

        {/* Кнопка */}
        <button
          onClick={onConfirm}
          className="theme-btn theme-btn-secondary w-full py-3 px-6 rounded-lg font-bold text-lg transition-all shadow-lg uppercase hover:scale-105 active:scale-95"
        >
          Далее
        </button>
      </div>
    </div>
  );
};

export default GoToJailModal;