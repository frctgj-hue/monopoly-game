import React, { useState, useCallback, useEffect } from 'react';
import CardDeckAnimation from './CardDeckAnimation';

interface LobbyProps {
  onCreateGame: (playerName: string) => void;
  onJoinGame: (gameId: string, playerName: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onCreateGame, onJoinGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [animating, setAnimating] = useState(false);

  const switchMode = useCallback((newMode: 'menu' | 'create' | 'join') => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setMode(newMode);
      setAnimating(false);
    }, 300);
  }, [mode, animating]);

  const handleCreateGame = useCallback(() => {
    if (playerName.trim()) {
      onCreateGame(playerName.trim());
    }
  }, [playerName, onCreateGame]);

  const handleJoinGame = useCallback(() => {
    const name = playerName.trim();
    const code = gameId.trim();
    console.log('[Lobby] Join attempt:', { name, code, hasHandler: !!onJoinGame });
    if (name && code && onJoinGame) {
      onJoinGame(code, name);
    }
  }, [playerName, gameId, onJoinGame]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mode !== 'menu') {
        switchMode('menu');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mode, switchMode]);

  const animClass = animating ? 'lobby-anim-exit' : 'lobby-anim-enter';

  // Главное меню — матовое стекло с серым фоном
  if (mode === 'menu') {
    return (
      <div className={`flex flex-col items-center justify-center relative overflow-hidden min-h-screen ${animClass}`}
           style={{
             background: 'linear-gradient(135deg, rgba(75, 75, 80, 0.6) 0%, rgba(42, 42, 46, 0.7) 100%)',
             backdropFilter: 'blur(24px)',
             WebkitBackdropFilter: 'blur(24px)',
           }}>
        {/* Анимация раскладывающейся колоды карт-улиц (фоновая) */}
        <CardDeckAnimation />
        {/* Центрированный контент */}
        <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-4xl px-4">
          {/* Логотип */}
          <div className="mb-12 text-center lobby-logo">
            <h1 className="lobby-logo-main text-8xl sm:text-9xl font-extralight tracking-[0.25em]">
              MONOPOLY
            </h1>
            <div className="mt-3 h-px w-72 mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
          </div>

          {/* Кнопки — крупные, по центру */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center justify-center">
            <button
              onClick={() => switchMode('create')}
              className="lobby-btn-main lobby-btn-red w-[360px] h-[80px] lobby-btn-float-1"
            >
              <span>CREATE</span>
              <span>New Game</span>
            </button>

            <button
              onClick={() => switchMode('join')}
              className="lobby-btn-main lobby-btn-green-main w-[360px] h-[80px] lobby-btn-float-2"
            >
              <span>JOIN</span>
              <span>Lobby Code</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Создание игры — матовое стекло с серым фоном
  if (mode === 'create') {
    return (
      <div className={`flex items-center justify-center overflow-hidden relative min-h-screen ${animClass}`}
           style={{
             background: 'linear-gradient(135deg, rgba(75, 75, 80, 0.6) 0%, rgba(42, 42, 46, 0.7) 100%)',
             backdropFilter: 'blur(24px)',
             WebkitBackdropFilter: 'blur(24px)',
           }}>
        <div className="w-full max-w-xl px-6 relative z-10 flex flex-col items-center">
          <button
            onClick={() => switchMode('menu')}
            className="lobby-back-btn mb-8 group self-start"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span className="text-[#666] group-hover:text-gray-300 transition-colors ml-2">BACK</span>
          </button>

          <div className="lobby-form-panel w-full">
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-2 rounded-full bg-[#2a2a2c] border border-[#e53e3e]/30">
                <span className="text-[#e53e3e] text-xs tracking-widest uppercase">New Game</span>
              </div>
              <h2 className="text-3xl font-light tracking-[0.2em] text-[#e53e3e] mt-5">
                CREATE LOBBY
              </h2>
            </div>

            <div className="space-y-7">
              <div className="lobby-input-group">
                <label className="block text-xs tracking-[0.2em] text-[#a0a0a0] uppercase mb-3">
                  Player Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name..."
                  className="lobby-input-form"
                  maxLength={20}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateGame()}
                />
              </div>

              <button
                onClick={handleCreateGame}
                disabled={!playerName.trim()}
                className={`lobby-btn-form ${!playerName.trim() ? 'lobby-btn-disabled' : 'lobby-btn-red'}`}
              >
                <span className="tracking-[0.2em]">START GAME</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Присоединение к игре — матовое стекло с серым фоном
  return (
    <div className={`flex items-center justify-center overflow-hidden relative min-h-screen ${animClass}`}
         style={{
           background: 'linear-gradient(135deg, rgba(75, 75, 80, 0.6) 0%, rgba(42, 42, 46, 0.7) 100%)',
           backdropFilter: 'blur(24px)',
           WebkitBackdropFilter: 'blur(24px)',
         }}>
      <div className="w-full max-w-xl px-6 relative z-10 flex flex-col items-center">
        <button
          onClick={() => switchMode('menu')}
          className="lobby-back-btn mb-8 group self-start"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span className="text-[#666] group-hover:text-gray-300 transition-colors ml-2">BACK</span>
        </button>

        <div className="lobby-form-panel w-full">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 rounded-full bg-[#2a2a2c] border border-[#38a169]/30">
              <span className="text-[#38a169] text-xs tracking-widest uppercase">Join Game</span>
            </div>
            <h2 className="text-3xl font-light tracking-[0.2em] text-[#38a169] mt-5">
              JOIN LOBBY
            </h2>
          </div>

          <div className="space-y-7">
            <div className="lobby-input-group">
              <label className="block text-xs tracking-[0.2em] text-[#a0a0a0] uppercase mb-3">
                Player Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                className="lobby-input-form"
                maxLength={20}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
              />
            </div>

            <div className="lobby-input-group">
              <label className="block text-xs tracking-[0.2em] text-[#a0a0a0] uppercase mb-3">
                Lobby Code
              </label>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="ABC123"
                className="lobby-input-form lobby-input-code"
                maxLength={6}
                onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
              />
            </div>

            <button
              onClick={handleJoinGame}
              disabled={!playerName.trim() || !gameId.trim()}
              className={`lobby-btn-form ${(!playerName.trim() || !gameId.trim()) ? 'lobby-btn-disabled' : 'lobby-btn-green-main'}`}
            >
              <span className="tracking-[0.2em]">JOIN LOBBY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;