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
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#CDE6D0]">
        {/* Декоративный паттерн фона */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" patternUnits="userSpaceOnUse" width="40" height="40">
                <path d="M0,20 l40,0 M20,0 l0,40" stroke="#000" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Главная карточка меню */}
        <div className="bg-[#F5F0E8] rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)] border-4 border-black p-12 max-w-2xl w-full relative z-10 animate-scale-in">
          {/* Заголовок с зеленой полосой */}
          <div className="bg-[#2d8659] border-4 border-black rounded-lg p-6 mb-8 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-10"></div>
            <h1 className="font-black text-6xl text-white text-center uppercase tracking-wider relative z-10" style={{
              textShadow: '4px 4px 0px rgba(0,0,0,0.5)'
            }}>
              МОНОПОЛИЯ
            </h1>
            <div className="flex items-center justify-center gap-4 text-4xl mt-3 text-white relative z-10">
              <FontAwesomeIcon icon={faUserTie} />
              <FontAwesomeIcon icon={faDice} />
              <FontAwesomeIcon icon={faHouse} />
            </div>
          </div>

          {/* Подзаголовок */}
          <div className="text-center mb-8">
            <div className="inline-block bg-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <p className="text-gray-800 text-xl font-black uppercase tracking-wide">Онлайн игра</p>
            </div>
          </div>

          {/* Кнопки */}
          <div className="space-y-6 flex flex-col items-center">
            <button
              onClick={() => setMode('create')}
              className="max-w-md w-full bg-[#dc3545] text-white font-black px-8 py-5 rounded-lg border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all text-2xl uppercase tracking-wide hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px]"
            >
              <span className="flex items-center justify-center gap-3">
                <FontAwesomeIcon icon={faPlus} className="text-3xl" />
                <span>Создать игру</span>
              </span>
            </button>

            <button
              onClick={() => setMode('join')}
              className="max-w-md w-full bg-[#2d8659] text-white font-black px-8 py-5 rounded-lg border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all text-2xl uppercase tracking-wide hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px]"
            >
              <span className="flex items-center justify-center gap-3">
                <FontAwesomeIcon icon={faDoorOpen} className="text-3xl" />
                <span>Присоединиться</span>
              </span>
            </button>
          </div>

          {/* Информация о количестве игроков */}
          <div className="mt-10 text-center">
            <div className="inline-block bg-white border-4 border-black rounded-lg px-8 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <p className="text-lg text-gray-800 font-black uppercase flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} />
                <span>2-4 игрока</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#CDE6D0]">
        {/* Декоративный паттерн фона */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" patternUnits="userSpaceOnUse" width="40" height="40">
                <path d="M0,20 l40,0 M20,0 l0,40" stroke="#000" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="bg-[#F5F0E8] rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)] border-4 border-black p-12 max-w-2xl w-full relative z-10 animate-scale-in">
          {/* Кнопка назад */}
          <button
            onClick={() => setMode('menu')}
            className="mb-6 bg-white border-4 border-black px-6 py-3 rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all font-black uppercase text-gray-800"
          >
            <span className="flex items-center gap-2">
              <span className="text-2xl">←</span>
              <span>Назад</span>
            </span>
          </button>

          {/* Заголовок */}
          <div className="bg-[#2d8659] border-4 border-black rounded-lg p-6 mb-8 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <h2 className="font-black text-5xl text-white text-center uppercase tracking-wider" style={{
              textShadow: '3px 3px 0px rgba(0,0,0,0.5)'
            }}>
              Создать игру
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xl font-black text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-2xl" />
                <span>Ваше имя</span>
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="ВВЕДИТЕ ИМЯ"
                className="w-full px-6 py-5 border-4 border-black rounded-lg focus:outline-none text-xl font-black uppercase transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] bg-white"
                maxLength={20}
                autoFocus
              />
            </div>

            <button
              onClick={handleCreateGame}
              disabled={!playerName.trim()}
              className={`w-full font-black py-5 px-8 rounded-lg border-4 border-black transition-all text-2xl uppercase tracking-wide ${
                playerName.trim()
                  ? 'bg-[#dc3545] text-white shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-[4px_4px_0px_rgba(0,0,0,0.3)]'
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#CDE6D0]">
      {/* Декоративный паттерн фона */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" patternUnits="userSpaceOnUse" width="40" height="40">
              <path d="M0,20 l40,0 M20,0 l0,40" stroke="#000" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="bg-[#F5F0E8] rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)] border-4 border-black p-12 max-w-2xl w-full relative z-10 animate-scale-in">
        {/* Кнопка назад */}
        <button
          onClick={() => setMode('menu')}
          className="mb-6 bg-white border-4 border-black px-6 py-3 rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all font-black uppercase text-gray-800"
        >
          <span className="flex items-center gap-2">
            <span className="text-2xl">←</span>
            <span>Назад</span>
          </span>
        </button>

        {/* Заголовок */}
        <div className="bg-[#2d8659] border-4 border-black rounded-lg p-6 mb-8 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <h2 className="font-black text-5xl text-white text-center uppercase tracking-wider" style={{
            textShadow: '3px 3px 0px rgba(0,0,0,0.5)'
          }}>
            Присоединиться
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xl font-black text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-3">
              <FontAwesomeIcon icon={faUser} className="text-2xl" />
              <span>Ваше имя</span>
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="ВВЕДИТЕ ИМЯ"
              className="w-full px-6 py-5 border-4 border-black rounded-lg focus:outline-none text-xl font-black uppercase transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] bg-white"
              maxLength={20}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xl font-black text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-3">
              <FontAwesomeIcon icon={faKey} className="text-2xl" />
              <span>ID игры</span>
            </label>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="ВВЕДИТЕ ID"
              className="w-full px-6 py-5 border-4 border-black rounded-lg focus:outline-none text-xl font-black uppercase font-mono transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] bg-white"
            />
          </div>

          <button
            onClick={handleJoinGame}
            disabled={!playerName.trim() || !gameId.trim()}
            className={`w-full font-black py-5 px-8 rounded-lg border-4 border-black transition-all text-2xl uppercase tracking-wide ${
              playerName.trim() && gameId.trim()
                ? 'bg-[#2d8659] text-white shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-[4px_4px_0px_rgba(0,0,0,0.3)]'
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
