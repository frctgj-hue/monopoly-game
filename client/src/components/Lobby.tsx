import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faHouse, faCar, faMoneyBill, faUserTie, faPlus, faDoorOpen, faUser, faKey } from '@fortawesome/free-solid-svg-icons';

interface LobbyProps {
  onCreateGame: (playerName: string) => void;
  onJoinGame: (gameId: string, playerName: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onCreateGame, onJoinGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');

  const handleCreateGame = () => {
    if (playerName.trim()) {
      onCreateGame(playerName.trim());
    }
  };

  const handleJoinGame = () => {
    if (playerName.trim() && gameId.trim()) {
      onJoinGame(gameId.trim(), playerName.trim());
    }
  };

  if (mode === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: '#2d8659' }}>
        {/* Анимированный фон */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float"><FontAwesomeIcon icon={faMoneyBill} /></div>
          <div className="absolute top-40 right-20 text-5xl opacity-20 animate-float-delayed"><FontAwesomeIcon icon={faHouse} /></div>
          <div className="absolute bottom-32 left-1/4 text-7xl opacity-20 animate-float"><FontAwesomeIcon icon={faUserTie} /></div>
          <div className="absolute bottom-20 right-1/3 text-6xl opacity-20 animate-float-delayed"><FontAwesomeIcon icon={faDice} /></div>
          <div className="absolute top-1/3 right-10 text-5xl opacity-20 animate-float"><FontAwesomeIcon icon={faCar} /></div>
        </div>

        <div className="backdrop-blur-glass rounded-3xl shadow-2xl p-10 max-w-lg w-full animate-scale-in relative z-10">
          {/* Логотип */}
          <div className="text-center mb-8 animate-slide-in">
            <h1 className="font-display text-6xl font-bold text-gray-800 mb-2 text-shadow-lg">
              МОНОПОЛИЯ
            </h1>
            <div className="flex items-center justify-center gap-2 text-3xl mb-3">
              <FontAwesomeIcon icon={faUserTie} />
              <FontAwesomeIcon icon={faDice} />
              <FontAwesomeIcon icon={faHouse} />
            </div>
            <p className="text-gray-600 text-lg font-medium">Онлайн игра</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full text-white font-bold py-5 px-8 rounded-xl transition-all text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 duration-200"
              style={{ backgroundColor: '#dc3545' }}
            >
              <span className="flex items-center justify-center gap-3">
                <FontAwesomeIcon icon={faPlus} className="text-2xl" />
                <span>Создать игру</span>
              </span>
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full text-white font-bold py-5 px-8 rounded-xl transition-all text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 duration-200"
              style={{ backgroundColor: '#dc3545' }}
            >
              <span className="flex items-center justify-center gap-3">
                <FontAwesomeIcon icon={faDoorOpen} className="text-2xl" />
                <span>Присоединиться к игре</span>
              </span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-white bg-opacity-50 rounded-full px-6 py-2">
              <p className="text-sm text-gray-700 font-semibold">👥 2-4 игрока</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: '#2d8659' }}>
        {/* Анимированный фон */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float"><FontAwesomeIcon icon={faMoneyBill} /></div>
          <div className="absolute bottom-20 right-20 text-5xl opacity-20 animate-float-delayed"><FontAwesomeIcon icon={faHouse} /></div>
        </div>

        <div className="backdrop-blur-glass rounded-3xl shadow-2xl p-10 max-w-lg w-full animate-scale-in relative z-10">
          <button
            onClick={() => setMode('menu')}
            className="mb-6 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 font-medium"
          >
            <span className="text-xl">←</span>
            <span>Назад</span>
          </button>

          <div className="text-center mb-8">
            <h2 className="font-display text-4xl font-bold text-gray-800 mb-2">Создать игру</h2>
            <p className="text-gray-600">Введите ваше имя для начала</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-xl" />
                <span>Ваше имя</span>
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Введите ваше имя"
                className="w-full px-6 py-4 border-3 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg font-medium transition-all focus:shadow-lg"
                maxLength={20}
                autoFocus
              />
            </div>

            <button
              onClick={handleCreateGame}
              disabled={!playerName.trim()}
              className={`w-full font-bold py-4 px-8 rounded-xl transition-all text-lg shadow-lg ${
                playerName.trim()
                  ? 'text-white hover:shadow-2xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={playerName.trim() ? { backgroundColor: '#dc3545' } : {}}
            >
              Создать игру
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: '#2d8659' }}>
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 text-6xl opacity-20 animate-float"><FontAwesomeIcon icon={faDice} /></div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-float-delayed"><FontAwesomeIcon icon={faCar} /></div>
      </div>

      <div className="backdrop-blur-glass rounded-3xl shadow-2xl p-10 max-w-lg w-full animate-scale-in relative z-10">
        <button
          onClick={() => setMode('menu')}
          className="mb-6 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 font-medium"
        >
          <span className="text-xl">←</span>
          <span>Назад</span>
        </button>

        <div className="text-center mb-8">
          <h2 className="font-display text-4xl font-bold text-gray-800 mb-2">Присоединиться</h2>
          <p className="text-gray-600">Введите данные для входа в игру</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-xl" />
              <span>Ваше имя</span>
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Введите ваше имя"
              className="w-full px-6 py-4 border-3 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg font-medium transition-all focus:shadow-lg"
              maxLength={20}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faKey} className="text-xl" />
              <span>ID игры</span>
            </label>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Введите ID игры"
              className="w-full px-6 py-4 border-3 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg font-medium font-mono transition-all focus:shadow-lg"
            />
          </div>

          <button
            onClick={handleJoinGame}
            disabled={!playerName.trim() || !gameId.trim()}
            className={`w-full font-bold py-4 px-8 rounded-xl transition-all text-lg shadow-lg ${
              playerName.trim() && gameId.trim()
                ? 'text-white hover:shadow-2xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={playerName.trim() && gameId.trim() ? { backgroundColor: '#dc3545' } : {}}
          >
            Присоединиться
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
