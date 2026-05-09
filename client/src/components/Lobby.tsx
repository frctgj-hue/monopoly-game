import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faHouse, faUserTie, faPlus, faDoorOpen, faUser, faKey } from '@fortawesome/free-solid-svg-icons';

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
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#4a9d7a] via-[#5aad8a] to-[#4a9d7a]">
        {/* Декоративные элементы фона */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-20 left-10 text-6xl animate-float"><FontAwesomeIcon icon={faHouse} /></div>
          <div className="absolute top-40 right-20 text-5xl animate-float-delayed"><FontAwesomeIcon icon={faDice} /></div>
          <div className="absolute bottom-32 left-1/4 text-7xl animate-float"><FontAwesomeIcon icon={faUserTie} /></div>
          <div className="absolute bottom-20 right-1/3 text-6xl animate-float-delayed"><FontAwesomeIcon icon={faHouse} /></div>
        </div>

        {/* Главная карточка меню */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-12 max-w-2xl w-full relative z-10 animate-scale-in">
          {/* Заголовок */}
          <div className="text-center mb-10">
            <h1 className="font-black text-7xl text-[#4a9d7a] mb-4 uppercase tracking-wider">
              МОНОПОЛИЯ
            </h1>
            <div className="flex items-center justify-center gap-4 text-5xl text-[#4a9d7a] mb-4">
              <FontAwesomeIcon icon={faUserTie} />
              <FontAwesomeIcon icon={faDice} />
              <FontAwesomeIcon icon={faHouse} />
            </div>
            <div className="inline-block bg-gradient-to-r from-[#4a9d7a] to-[#5aad8a] text-white px-8 py-3 rounded-lg">
              <p className="text-xl font-black uppercase tracking-wide">Онлайн игра</p>
            </div>
          </div>

          {/* Кнопки */}
          <div className="space-y-5 flex flex-col items-center mb-8">
            <button
              onClick={() => setMode('create')}
              className="max-w-md w-full bg-gradient-to-r from-[#e85d6b] to-[#d94d5c] text-white font-black px-10 py-6 rounded-lg transition-all text-2xl uppercase tracking-wide hover:from-[#d94d5c] hover:to-[#ca3d4d] hover:scale-105 active:scale-95 transform duration-200"
            >
              <span className="flex items-center justify-center gap-4">
                <FontAwesomeIcon icon={faPlus} className="text-3xl" />
                <span>Создать игру</span>
              </span>
            </button>

            <button
              onClick={() => setMode('join')}
              className="max-w-md w-full bg-gradient-to-r from-[#4a9d7a] to-[#5aad8a] text-white font-black px-10 py-6 rounded-lg transition-all text-2xl uppercase tracking-wide hover:from-[#5aad8a] hover:to-[#6abd9a] hover:scale-105 active:scale-95 transform duration-200"
            >
              <span className="flex items-center justify-center gap-4">
                <FontAwesomeIcon icon={faDoorOpen} className="text-3xl" />
                <span>Присоединиться</span>
              </span>
            </button>
          </div>

          {/* Информация о количестве игроков */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gray-100 rounded-lg px-8 py-4">
              <FontAwesomeIcon icon={faUser} className="text-2xl text-[#4a9d7a]" />
              <p className="text-lg text-gray-800 font-black uppercase">2-4 игрока</p>
            </div>
          </div>

          {/* Версия для проверки деплоя */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 font-mono">v3.1 - Soft Colors</p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#4a9d7a] via-[#5aad8a] to-[#4a9d7a]">
        {/* Декоративные элементы фона */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-20 left-10 text-6xl animate-float"><FontAwesomeIcon icon={faHouse} /></div>
          <div className="absolute bottom-20 right-20 text-5xl animate-float-delayed"><FontAwesomeIcon icon={faDice} /></div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-12 max-w-2xl w-full relative z-10 animate-scale-in">
          {/* Кнопка назад */}
          <button
            onClick={() => setMode('menu')}
            className="mb-8 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg transition-all font-black uppercase text-gray-700 hover:scale-105 active:scale-95"
          >
            <span className="flex items-center gap-2">
              <span className="text-2xl">←</span>
              <span>Назад</span>
            </span>
          </button>

          {/* Заголовок */}
          <div className="text-center mb-10">
            <h2 className="font-black text-6xl bg-gradient-to-r from-[#4a9d7a] to-[#5aad8a] bg-clip-text text-transparent mb-4 uppercase tracking-wider">
              Создать игру
            </h2>
            <p className="text-gray-600 text-lg">Введите ваше имя для начала</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xl font-black text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-2xl text-[#4a9d7a]" />
                <span>Ваше имя</span>
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Введите имя"
                className="w-full px-6 py-5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#4a9d7a] text-xl font-bold transition-all bg-white"
                maxLength={20}
                autoFocus
              />
            </div>

            <button
              onClick={handleCreateGame}
              disabled={!playerName.trim()}
              className={`w-full font-black py-6 px-10 rounded-lg transition-all text-2xl uppercase tracking-wide ${
                playerName.trim()
                  ? 'bg-gradient-to-r from-[#e85d6b] to-[#d94d5c] text-white hover:from-[#d94d5c] hover:to-[#ca3d4d] hover:scale-105 active:scale-95 transform'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Создать игру
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#4a9d7a] via-[#5aad8a] to-[#4a9d7a]">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 right-10 text-6xl animate-float"><FontAwesomeIcon icon={faDice} /></div>
        <div className="absolute bottom-20 left-20 text-5xl animate-float-delayed"><FontAwesomeIcon icon={faUserTie} /></div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-12 max-w-2xl w-full relative z-10 animate-scale-in">
        {/* Кнопка назад */}
        <button
          onClick={() => setMode('menu')}
          className="mb-8 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg transition-all font-black uppercase text-gray-700 hover:scale-105 active:scale-95"
        >
          <span className="flex items-center gap-2">
            <span className="text-2xl">←</span>
            <span>Назад</span>
          </span>
        </button>

        {/* Заголовок */}
        <div className="text-center mb-10">
          <h2 className="font-black text-6xl bg-gradient-to-r from-[#4a9d7a] to-[#5aad8a] bg-clip-text text-transparent mb-4 uppercase tracking-wider">
            Присоединиться
          </h2>
          <p className="text-gray-600 text-lg">Введите данные для входа в игру</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xl font-black text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-3">
              <FontAwesomeIcon icon={faUser} className="text-2xl text-[#4a9d7a]" />
              <span>Ваше имя</span>
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Введите имя"
              className="w-full px-6 py-5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#4a9d7a] text-xl font-bold transition-all bg-white"
              maxLength={20}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xl font-black text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-3">
              <FontAwesomeIcon icon={faKey} className="text-2xl text-[#4a9d7a]" />
              <span>ID игры</span>
            </label>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Введите ID"
              className="w-full px-6 py-5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#4a9d7a] text-xl font-bold font-mono transition-all bg-white"
            />
          </div>

          <button
            onClick={handleJoinGame}
            disabled={!playerName.trim() || !gameId.trim()}
            className={`w-full font-black py-6 px-10 rounded-lg transition-all text-2xl uppercase tracking-wide ${
              playerName.trim() && gameId.trim()
                ? 'bg-gradient-to-r from-[#4a9d7a] to-[#5aad8a] text-white hover:from-[#5aad8a] hover:to-[#6abd9a] hover:scale-105 active:scale-95 transform'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Присоединиться
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
