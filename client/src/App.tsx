import { useEffect, useState } from 'react';
import { useSocket } from './hooks/useSocket';
import type { GameState, DiceRoll, Card, Player } from './types/game.types';
import Lobby from './components/Lobby';
import WaitingRoom from './components/WaitingRoom';
import Board from './components/Board';
import PlayersList from './components/PlayersList';
import CardModal from './components/CardModal';
import PropertyModal from './components/PropertyModal';
import PropertyManagement from './components/PropertyManagement';
import AuctionModal from './components/AuctionModal';
import TradeModal from './components/TradeModal';
import TradeNotification from './components/TradeNotification';
import VictoryAnimation from './components/VictoryAnimation';
import BankruptcyAnimation from './components/BankruptcyAnimation';
import { soundManager } from './utils/sounds';

type GamePhase = 'lobby' | 'waiting' | 'playing';

interface ToastMessage {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

function App() {
  const {
    socket,
    connected,
    createGame,
    joinGame,
    startGame,
    rollDice,
    buyProperty,
    payRent,
    endTurn,
    payJailFine,
    useJailCard,
    drawCard,
    buildHouse,
    sellHouse,
    startAuction,
    placeBid,
    cancelAuction,
    createTrade,
    acceptTrade,
    rejectTrade,
  } = useSocket();

  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [lastDiceRoll, setLastDiceRoll] = useState<DiceRoll | undefined>();
  const [canRoll, setCanRoll] = useState(true);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showPropertyManagement, setShowPropertyManagement] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

  // Состояния для новых анимаций
  const [winner, setWinner] = useState<Player | null>(null);
  const [bankruptPlayer, setBankruptPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Обработчики событий от сервера
    socket.on('player-joined', ({ game }) => {
      setGameState(game);
      showToast('Игрок присоединился!', 'info');
    });

    socket.on('game-started', ({ game }) => {
      setGameState(game);
      setPhase('playing');
      showToast('🎮 Игра началась!', 'success');
    });

    socket.on('dice-rolled', ({ diceRoll, game }) => {
      setLastDiceRoll(diceRoll);
      setGameState(game);
      setCanRoll(false);
      soundManager.playDiceRoll();
      showToast(`🎲 Выпало: ${diceRoll.dice1} + ${diceRoll.dice2} = ${diceRoll.total}`, 'info');
    });

    socket.on('property-bought', ({ game }) => {
      setGameState(game);
      soundManager.playPropertyBought();
      showToast('🏠 Недвижимость куплена!', 'success');
    });

    socket.on('rent-paid', ({ rent, game }) => {
      setGameState(game);
      soundManager.playRentPaid();
      showToast(`💰 Оплачена аренда: $${rent}`, 'warning');
    });

    socket.on('turn-ended', ({ game }) => {
      setGameState(game);
      setCanRoll(true);
      setLastDiceRoll(undefined);
      soundManager.playTurnEnd();
      showToast('✓ Ход завершен', 'info');
    });

    socket.on('sent-to-jail', ({ playerId, game }: { playerId: string; game: GameState }) => {
      setGameState(game);
      const player = game.players.find((p: Player) => p.id === playerId);
      showToast(`🚔 ${player?.name} отправлен в тюрьму!`, 'warning');
    });

    socket.on('jail-turn', ({ game }) => {
      setGameState(game);
      showToast('🔒 Остаетесь в тюрьме', 'warning');
    });

    socket.on('jail-paid', ({ game }) => {
      setGameState(game);
      showToast('💵 Штраф оплачен, вы свободны!', 'success');
    });

    socket.on('jail-card-used', ({ game }) => {
      setGameState(game);
      showToast('🎫 Карточка использована, вы свободны!', 'success');
    });

    socket.on('player-bankrupt', ({ playerId, game }: { playerId: string; game: GameState }) => {
      setGameState(game);
      const player = game.players.find((p: Player) => p.id === playerId);
      if (player) {
        setBankruptPlayer(player);
        soundManager.playBankruptcy();
      }
      showToast(`💔 ${player?.name} обанкротился!`, 'error');
    });

    socket.on('game-finished', ({ winner, game }: { winner: string; game: GameState }) => {
      setGameState(game);
      const winnerPlayer = game.players.find((p: Player) => p.id === winner);
      if (winnerPlayer) {
        setWinner(winnerPlayer);
        soundManager.playVictory();
      }
      showToast(`🏆 ${winnerPlayer?.name} победил!`, 'success');
    });

    socket.on('card-drawn', ({ card, game }) => {
      setGameState(game);
      setCurrentCard(card);
      soundManager.playCardDrawn();
    });

    // Аукционы
    socket.on('auction-started', ({ game }: { game: GameState }) => {
      setGameState(game);
      showToast('🔨 Аукцион начался!', 'info');
    });

    socket.on('bid-placed', ({ playerId, amount, game }: { playerId: string; amount: number; game: GameState }) => {
      setGameState(game);
      const player = game.players.find((p: Player) => p.id === playerId);
      showToast(`💰 ${player?.name} поставил $${amount}`, 'info');
    });

    socket.on('auction-ended', ({ winner, propertyId, amount, game }: { winner?: string; propertyId?: number; amount?: number; game: GameState }) => {
      setGameState(game);
      if (winner && propertyId !== undefined && amount) {
        const player = game.players.find((p: Player) => p.id === winner);
        const property = game.board[propertyId];
        showToast(`🔨 ${player?.name} выиграл ${property?.name} за $${amount}!`, 'success');
      } else {
        showToast('🔨 Аукцион завершен без ставок', 'info');
      }
    });

    socket.on('auction-cancelled', ({ game }: { game: GameState }) => {
      setGameState(game);
      showToast('🚫 Аукцион отменен', 'info');
    });

    // Торговля
    socket.on('trade-created', ({ game }) => {
      setGameState(game);
      showToast('🤝 Новое предложение обмена!', 'info');
    });

    socket.on('trade-accepted', ({ game }) => {
      setGameState(game);
      showToast('✅ Обмен принят!', 'success');
    });

    socket.on('trade-rejected', ({ game }) => {
      setGameState(game);
      showToast('❌ Обмен отклонен', 'warning');
    });

    socket.on('trade-cancelled', ({ game }) => {
      setGameState(game);
      showToast('🚫 Обмен отменен', 'info');
    });

    // Строительство
    socket.on('house-built', ({ playerId, propertyId, game }) => {
      setGameState(game);
      const player = game.players.find((p: Player) => p.id === playerId);
      const property = game.board[propertyId];
      soundManager.playHouseBuild();
      showToast(`🏠 ${player?.name} построил дом на ${property?.name}!`, 'success');
    });

    socket.on('house-sold', ({ playerId, propertyId, game }) => {
      setGameState(game);
      const player = game.players.find((p: Player) => p.id === playerId);
      const property = game.board[propertyId];
      showToast(`💰 ${player?.name} продал дом на ${property?.name}`, 'info');
    });

    return () => {
      socket.off('player-joined');
      socket.off('game-started');
      socket.off('dice-rolled');
      socket.off('property-bought');
      socket.off('rent-paid');
      socket.off('turn-ended');
      socket.off('sent-to-jail');
      socket.off('jail-turn');
      socket.off('jail-paid');
      socket.off('jail-card-used');
      socket.off('player-bankrupt');
      socket.off('game-finished');
      socket.off('card-drawn');
      socket.off('auction-started');
      socket.off('bid-placed');
      socket.off('auction-ended');
      socket.off('auction-cancelled');
      socket.off('trade-created');
      socket.off('trade-accepted');
      socket.off('trade-rejected');
      socket.off('trade-cancelled');
      socket.off('house-built');
      socket.off('house-sold');
      socket.off('chat-message');
    };
  }, [socket]);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    // Toast отключены, функция оставлена для совместимости
  };

  const handleCreateGame = (playerName: string) => {
    createGame((data) => {
      if (data.success && data.gameId) {
        // После создания игры сразу присоединяемся к ней
        joinGame(data.gameId, playerName, (joinData) => {
          if (joinData.success && joinData.game) {
            setGameState(joinData.game);
            setMyPlayerId(socket?.id || '');
            setPhase('waiting');
            showToast(`✓ Игра создана! ID: ${data.gameId}`, 'success');
          }
        });
      }
    });
  };

  const handleJoinGame = (gameId: string, playerName: string) => {
    joinGame(gameId, playerName, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        setMyPlayerId(socket?.id || '');
        setPhase('waiting');
        showToast('✓ Вы присоединились к игре!', 'success');
      } else {
        showToast(data.message || 'Ошибка присоединения', 'error');
      }
    });
  };

  const handleStartGame = () => {
    if (!gameState) return;
    startGame(gameState.id, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        setPhase('playing');
      } else {
        showToast(data.message || 'Ошибка запуска игры', 'error');
      }
    });
  };

  const handleRollDice = () => {
    if (!gameState || !canRoll) return;
    rollDice(gameState.id, (data) => {
      if (data.success && data.game && data.diceRoll) {
        setLastDiceRoll(data.diceRoll);
        setGameState(data.game);
        setCanRoll(false);
      } else {
        showToast(data.message || 'Ошибка броска кубиков', 'error');
      }
    });
  };

  const handlePayJailFine = () => {
    if (!gameState) return;
    payJailFine(gameState.id, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast('💵 Штраф оплачен!', 'success');
      } else {
        showToast(data.message || 'Не удалось оплатить штраф', 'error');
      }
    });
  };

  const handleUseJailCard = () => {
    if (!gameState) return;
    useJailCard(gameState.id, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast('🎫 Карточка использована!', 'success');
      } else {
        showToast(data.message || 'Не удалось использовать карточку', 'error');
      }
    });
  };

  const handleEndTurn = () => {
    if (!gameState || canRoll) return;
    endTurn(gameState.id, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        setCanRoll(true);
        setLastDiceRoll(undefined);
      }
    });
  };

  // Временно не используются, но нужны для будущего
  // Временно не используются, но нужны для будущего
  console.log(handleRollDice, handlePayJailFine, handleUseJailCard, handleEndTurn);

  const handleCellClick = (propertyId: number) => {
    if (!gameState) return;
    const property = gameState.board[propertyId];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    // Проверка на карточки "Шанс" или "Общественная казна"
    if (currentPlayer.id === myPlayerId && currentPlayer.position === propertyId) {
      if (property.name.includes('Шанс')) {
        drawCard(gameState.id, 'chance', (data) => {
          if (data.success && data.card && data.game) {
            setCurrentCard(data.card);
            setGameState(data.game);
          }
        });
        return;
      }

      if (property.name.includes('казна')) {
        drawCard(gameState.id, 'community', (data) => {
          if (data.success && data.card && data.game) {
            setCurrentCard(data.card);
            setGameState(data.game);
          }
        });
        return;
      }
    }

    // Если игрок на этой клетке и она доступна для покупки
    if (
      currentPlayer.id === myPlayerId &&
      currentPlayer.position === propertyId &&
      property.price > 0 &&
      !property.owner
    ) {
      setSelectedProperty(propertyId);
      return;
    }

    // Если игрок на клетке с чужой недвижимостью
    if (
      currentPlayer.id === myPlayerId &&
      currentPlayer.position === propertyId &&
      property.owner &&
      property.owner !== myPlayerId
    ) {
      const diceTotal = lastDiceRoll?.total || 0;
      payRent(gameState.id, propertyId, diceTotal, (data) => {
        if (data.success && data.game) {
          setGameState(data.game);
          showToast(`💸 Оплачена аренда: $${data.rent}`, 'warning');
        }
      });
    }
  };
  console.log(handleCellClick); // Временно не используется

  const handleBuyProperty = () => {
    if (!gameState || selectedProperty === null) return;
    buyProperty(gameState.id, selectedProperty, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        const property = gameState.board[selectedProperty];
        showToast(`✓ Куплено: ${property.name}`, 'success');
        setSelectedProperty(null);
      } else {
        showToast(data.message || 'Не удалось купить', 'error');
      }
    });
  };

  const handleStartAuction = (propertyId: number) => {
    if (!gameState) return;
    startAuction(gameState.id, propertyId, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast('🔨 Аукцион начался!', 'success');
      } else {
        showToast(data.message || 'Не удалось начать аукцион', 'error');
      }
    });
  };

  const handlePlaceBid = (amount: number) => {
    if (!gameState) return;
    placeBid(gameState.id, amount, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
      } else {
        showToast(data.message || 'Не удалось сделать ставку', 'error');
      }
    });
  };

  const handleCancelAuction = () => {
    if (!gameState) return;
    cancelAuction(gameState.id, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast('🚫 Аукцион отменен', 'info');
      } else {
        showToast(data.message || 'Не удалось отменить аукцион', 'error');
      }
    });
  };

  const handleCreateTrade = (
    toPlayerId: string,
    offeredProperties: number[],
    offeredMoney: number,
    requestedProperties: number[],
    requestedMoney: number
  ) => {
    if (!gameState) return;
    createTrade(gameState.id, toPlayerId, offeredProperties, offeredMoney, requestedProperties, requestedMoney, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast('🤝 Предложение отправлено!', 'success');
      } else {
        showToast(data.message || 'Не удалось создать предложение', 'error');
      }
    });
  };

  const handleAcceptTrade = (tradeId: string) => {
    if (!gameState) return;
    acceptTrade(gameState.id, tradeId, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast('✅ Обмен принят!', 'success');
      } else {
        showToast(data.message || 'Не удалось принять обмен', 'error');
      }
    });
  };

  const handleRejectTrade = (tradeId: string) => {
    if (!gameState) return;
    rejectTrade(gameState.id, tradeId, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast('❌ Обмен отклонен', 'info');
      } else {
        showToast(data.message || 'Не удалось отклонить обмен', 'error');
      }
    });
  };

  const handleBuildHouse = (propertyId: number) => {
    if (!gameState) return;
    buildHouse(gameState.id, propertyId, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast('🏠 Дом построен!', 'success');
      } else {
        showToast(data.message || 'Не удалось построить дом', 'error');
      }
    });
  };

  const handleSellHouse = (propertyId: number) => {
    if (!gameState) return;
    sellHouse(gameState.id, propertyId, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast('💰 Дом продан!', 'success');
      } else {
        showToast(data.message || 'Не удалось продать дом', 'error');
      }
    });
  };

  if (!connected) {
    return (
      <div className="min-h-screen gradient-monopoly flex items-center justify-center">
        <div className="backdrop-blur-glass rounded-3xl shadow-2xl p-10 animate-scale-in">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-spin">🎲</div>
            <div className="text-2xl font-bold text-gray-800">Подключение к серверу...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Модальное окно карточки */}
      <CardModal card={currentCard} onClose={() => setCurrentCard(null)} />

      {/* Модальное окно торговли - зеленое по центру */}
      {showTradeModal && gameState && (
        <div className="fixed inset-0 flex items-center justify-center p-8" style={{
          backgroundColor: '#CDE6D0',
          zIndex: 9999
        }}>
          <div className="bg-[#CDE6D0] rounded-lg shadow-2xl border-4 border-black p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black uppercase monopoly-title">
                🤝 Торговля
              </h2>
              <button
                onClick={() => setShowTradeModal(false)}
                className="text-gray-800 hover:text-black font-bold text-3xl leading-none"
              >
                ×
              </button>
            </div>
            <TradeModal
              players={gameState.players}
              board={gameState.board}
              myPlayerId={myPlayerId}
              onCreateTrade={handleCreateTrade}
              onClose={() => setShowTradeModal(false)}
            />
          </div>
        </div>
      )}

      {/* Модальное окно управления недвижимостью */}
      {showPropertyManagement && gameState && (
        <PropertyManagement
          properties={gameState.board}
          player={gameState.players.find(p => p.id === myPlayerId)!}
          onBuildHouse={handleBuildHouse}
          onSellHouse={handleSellHouse}
          onClose={() => setShowPropertyManagement(false)}
        />
      )}

      {/* Уведомления о торговле */}
      {gameState?.tradeOffers
        .filter(trade => trade.status === 'pending')
        .filter(trade => trade.toPlayerId === myPlayerId || trade.fromPlayerId === myPlayerId)
        .map(trade => (
          <TradeNotification
            key={trade.id}
            trade={trade}
            players={gameState.players}
            board={gameState.board}
            myPlayerId={myPlayerId}
            onAccept={handleAcceptTrade}
            onReject={handleRejectTrade}
          />
        ))}

      {/* Анимация победы */}
      {winner && (
        <VictoryAnimation
          winner={winner}
          onClose={() => {
            setWinner(null);
            setPhase('lobby');
            setGameState(null);
          }}
        />
      )}

      {/* Анимация банкротства */}
      {bankruptPlayer && (
        <BankruptcyAnimation
          player={bankruptPlayer}
          onComplete={() => setBankruptPlayer(null)}
        />
      )}

      {/* Чат убран */}

      {/* Фазы игры с анимацией */}
      <div className="animate-fade-in">
        {phase === 'lobby' && (
          <Lobby onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />
        )}

        {phase === 'waiting' && gameState && (
          <WaitingRoom
            gameId={gameState.id}
            players={gameState.players}
            myPlayerId={myPlayerId}
            onStartGame={handleStartGame}
            canStart={gameState.players.length >= 2}
          />
        )}

        {phase === 'playing' && gameState && (
          <div className="bg-[#CDE6D0] flex justify-center" style={{ paddingTop: '20px', paddingBottom: '20px', minHeight: '1250px' }}>
            <div className="flex items-start" style={{ gap: '350px' }}>
              {/* Доска - игровое поле (независимый блок) */}
              <div className="w-[1000px] h-[1000px] flex-shrink-0">
                <Board
                  board={gameState.board}
                  players={gameState.players}
                  onCellClick={(propertyId) => {
                    const property = gameState.board[propertyId];
                    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

                    // Показываем модальное окно покупки только если:
                    // 1. Это ход текущего игрока
                    // 2. Игрок стоит на этой клетке
                    // 3. Недвижимость не куплена
                    // 4. У недвижимости есть цена
                    if (
                      currentPlayer.id === myPlayerId &&
                      currentPlayer.position === propertyId &&
                      property.owner === null &&
                      property.price > 0
                    ) {
                      setSelectedProperty(propertyId);
                    }
                  }}
                />
              </div>

              {/* Список игроков - справа от доски (независимый блок) */}
              <div className="w-80 flex-shrink-0 space-y-4">
                {/* Таблица игроков */}
                <PlayersList
                  players={gameState.players}
                  currentPlayerId={gameState.players[gameState.currentPlayerIndex]?.id || ''}
                  myPlayerId={myPlayerId}
                />

                {/* Модальное окно покупки недвижимости - под таблицей игроков */}
                {selectedProperty !== null && (
                  <div className="bg-white rounded-lg shadow-lg border-2 border-black p-4">
                    <PropertyModal
                      property={gameState.board[selectedProperty]}
                      playerMoney={gameState.players.find(p => p.id === myPlayerId)?.money || 0}
                      onBuy={handleBuyProperty}
                      onAuction={() => {
                        handleStartAuction(selectedProperty);
                        setSelectedProperty(null);
                      }}
                      onClose={() => setSelectedProperty(null)}
                      canBuy={(gameState.players.find(p => p.id === myPlayerId)?.money || 0) >= gameState.board[selectedProperty].price}
                    />
                  </div>
                )}

                {/* Модальное окно аукциона - под таблицей игроков */}
                {gameState.auction && (
                  <AuctionModal
                    auction={gameState.auction}
                    property={gameState.board[gameState.auction.propertyId]}
                    players={gameState.players}
                    myPlayerId={myPlayerId}
                    onPlaceBid={handlePlaceBid}
                    onClose={handleCancelAuction}
                  />
                )}

                {/* Панель управления для текущего игрока */}
                {gameState.players[gameState.currentPlayerIndex]?.id === myPlayerId && (
                  <div className="bg-white rounded-lg shadow-lg border-2 border-black p-4">
                    <h3 className="text-sm font-black uppercase mb-3 text-center monopoly-title">
                      Ваш ход
                    </h3>

                    {/* Кубики */}
                    {lastDiceRoll && (
                      <div className="mb-3 flex justify-center">
                        <div className="text-2xl">
                          🎲 {lastDiceRoll.dice1} + {lastDiceRoll.dice2} = {lastDiceRoll.total}
                        </div>
                      </div>
                    )}

                    {/* Кнопки */}
                    <div className="space-y-2">
                      {canRoll && (
                        <button
                          onClick={handleRollDice}
                          className="w-full py-3 px-4 rounded-lg font-bold text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                        >
                          🎲 Бросить кубики
                        </button>
                      )}

                      {!canRoll && (
                        <button
                          onClick={handleEndTurn}
                          className="w-full py-3 px-4 rounded-lg font-bold text-sm bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                        >
                          ✓ Завершить ход
                        </button>
                      )}

                      <button
                        onClick={() => setShowTradeModal(true)}
                        className="w-full py-2 px-4 rounded-lg font-bold text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
                      >
                        🤝 Торговля
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
