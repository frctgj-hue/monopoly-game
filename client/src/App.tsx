import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faCheck, faHandshake } from '@fortawesome/free-solid-svg-icons';
import { useSocket } from './hooks/useSocket';
import type { GameState, DiceRoll, Card, Player } from './types/game.types';
import Lobby from './components/Lobby';
import WaitingRoom from './components/WaitingRoom';
import Board from './components/Board';
import PlayersList from './components/PlayersList';
import CardModal from './components/CardModal';
import PropertyModal from './components/PropertyModal';
import PropertyManagement from './components/PropertyManagement';
import TradeModal from './components/TradeModal';
import TradeNotification from './components/TradeNotification';
import VictoryAnimation from './components/VictoryAnimation';
import BankruptcyAnimation from './components/BankruptcyAnimation';
import RentModal from './components/RentModal';
import PropertyInfoModal from './components/PropertyInfoModal';
import GoToJailModal from './components/GoToJailModal';
import TaxModal from './components/TaxModal';
import JailDecisionModal from './components/JailDecisionModal';
import { soundManager } from './utils/sounds';

type GamePhase = 'lobby' | 'waiting' | 'playing';

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
    declareBankruptcy,
    drawCard,
    confirmCard,
    confirmGoToJail,
    confirmTax,
    confirmRent,
    buildHouse,
    sellHouse,
    mortgageProperty,
    unmortgageProperty,
    createTrade,
    acceptTrade,
    rejectTrade,
  } = useSocket();

  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [originalPlayerId, setOriginalPlayerId] = useState<string>(''); // Сохраняем оригинальный ID
  const [lastDiceRoll, setLastDiceRoll] = useState<DiceRoll | undefined>();
  const [canRoll, setCanRoll] = useState(true);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [showGoToJail, setShowGoToJail] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState<{ type: 'income' | 'luxury'; amount: number } | null>(null);
  const [showRentModal, setShowRentModal] = useState<{ propertyId: number; rent: number; diceTotal: number } | null>(null);
  const [currentCreditor, setCurrentCreditor] = useState<string | null>(null);
  const [showPropertyInfo, setShowPropertyInfo] = useState<number | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showPropertyManagement, setShowPropertyManagement] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

  // Состояния для новых анимаций и модальных окон
  const [winner, setWinner] = useState<Player | null>(null);
  const [bankruptPlayer, setBankruptPlayer] = useState<Player | null>(null);
  
  // 🔥 Состояние для модального окна тюрьмы (пропуск хода)
  const [showJailDecision, setShowJailDecision] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Обработчик переподключения - восстанавливаем состояние игры
    socket.on('connect', () => {
      console.log('✅ Подключено к серверу, socket.id:', socket.id);
      // Если у нас есть gameState и оригинальный ID игрока, пытаемся переподключиться
      if (gameState && gameState.id && originalPlayerId) {
        console.log('🔄 Восстанавливаем состояние игры:', gameState.id, 'для игрока:', originalPlayerId);
        // Запрашиваем актуальное состояние игры с сервера
        socket.emit('rejoin-game', { gameId: gameState.id, oldPlayerId: originalPlayerId }, (response: any) => {
          if (response.success && response.game) {
            console.log('✅ Состояние игры восстановлено, новый socket.id:', socket.id);
            setGameState(response.game);
            // ВАЖНО: используем новый socket.id после переподключения
            const newSocketId = socket.id || '';
            setMyPlayerId(newSocketId);
            // Обновляем originalPlayerId на новый socket.id для следующих переподключений
            setOriginalPlayerId(newSocketId);
            setPhase('playing');
          } else {
            console.error('❌ Не удалось восстановить игру:', response.message);
          }
        });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Отключено от сервера:', reason);
    });

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

    socket.on('show-tax', ({ playerId, taxType, amount, game }: { playerId: string; taxType: 'income' | 'luxury'; amount: number; game: GameState }) => {
      setGameState(game);
      if (playerId === socket.id) {
        setShowTaxModal({ type: taxType, amount });
      }
    });

    socket.on('show-rent', ({ playerId, propertyId, rent, game, diceTotal }: { playerId: string; propertyId: number; rent: number; game: GameState; diceTotal: number }) => {
      setGameState(game);
      if (playerId === socket.id) {
        const property = game.board[propertyId];
        setCurrentCreditor(property.owner); // Сохраняем владельца как кредитора
        setShowRentModal({ propertyId, rent, diceTotal: diceTotal || lastDiceRoll?.total || 0 });
      }
    });

    socket.on('show-go-to-jail', ({ game }: { game: GameState }) => {
      setGameState(game);
      setShowGoToJail(true);
    });

    socket.on('jail-turn', ({ game }) => {
      setGameState(game);
      // 🔥 Показываем модальное окно только если:
      // 1. Это мой игрок в тюрьме
      // 2. Он должен пропустить ход (jailTurns: 0, 1 или 2 — первые 3 хода в тюрьме)
      // 3. Ход ещё не завершён (canRoll === false)
      const currentPlayer = game.players[game.currentPlayerIndex];
      const myPlayer = game.players.find(p => p.id === myPlayerId);
      
      if (currentPlayer?.id === myPlayerId && 
          myPlayer?.inJail && 
          myPlayer.jailTurns < 3 && 
          !canRoll) {
        setShowJailDecision(true);
      }
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

    socket.on('card-executed', ({ game }) => {
      setGameState(game);
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

    socket.on('property-mortgaged', ({ playerId, propertyId, game }) => {
      console.log('🟣 property-mortgaged событие получено:', { playerId, propertyId, mortgaged: game.board[propertyId].mortgaged });
      setGameState(game);
      const player = game.players.find((p: Player) => p.id === playerId);
      const property = game.board[propertyId];
      showToast(`🏦 ${player?.name} заложил ${property?.name}`, 'info');
    });

    socket.on('property-unmortgaged', ({ playerId, propertyId, game }) => {
      setGameState(game);
      const player = game.players.find((p: Player) => p.id === playerId);
      const property = game.board[propertyId];
      showToast(`✅ ${player?.name} выкупил ${property?.name}`, 'success');
    });

    return () => {
      socket.off('player-joined');
      socket.off('game-started');
      socket.off('dice-rolled');
      socket.off('property-bought');
      socket.off('rent-paid');
      socket.off('turn-ended');
      socket.off('sent-to-jail');
      socket.off('show-go-to-jail');
      socket.off('show-tax');
      socket.off('show-rent');
      socket.off('jail-turn');
      socket.off('jail-paid');
      socket.off('jail-card-used');
      socket.off('player-bankrupt');
      socket.off('game-finished');
      socket.off('card-drawn');
      socket.off('card-executed');
      socket.off('trade-created');
      socket.off('trade-accepted');
      socket.off('trade-rejected');
      socket.off('trade-cancelled');
      socket.off('house-built');
      socket.off('house-sold');
      socket.off('property-mortgaged');
      socket.off('property-unmortgaged');
      socket.off('chat-message');
    };
  }, [socket]);

  const showToast = (_message: string, _type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    // Toast отключены, функция оставлена для совместимости
  };

  const handleCreateGame = (playerName: string) => {
    createGame((data) => {
      if (data.success && data.gameId) {
        // После создания игры сразу присоединяемся к ней
        joinGame(data.gameId, playerName, (joinData) => {
          if (joinData.success && joinData.game) {
            setGameState(joinData.game);
            const playerId = socket?.id || '';
            setMyPlayerId(playerId);
            setOriginalPlayerId(playerId); // Сохраняем оригинальный ID
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
        const playerId = socket?.id || '';
        setMyPlayerId(playerId);
        setOriginalPlayerId(playerId); // Сохраняем оригинальный ID
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

  // 🔥 Обработчики для модального окна тюрьмы (пропуск хода)
  
  const handleJailPayFine = () => {
    if (!gameState) return;
    // Игрок платит 50 и пропускает ход — сервер сам завершит ход после оплаты штрафа за пропуск
    payJailFine(gameState.id, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        setShowJailDecision(false);
        showToast('💵 Штраф $50 оплачен, ход пропущен', 'info');
        // ❗️ НЕ меняем canRoll — сервер сам завершит ход и передаст ход следующему игроку,
        // после чего canRoll станет true для нового игрока. Если мы установим true сейчас,
        // текущий игрок сможет снова бросить кубики и пропустит ещё один ход.
      } else {
        showToast(data.message || 'Не удалось оплатить штраф', 'error');
      }
    });
  };

  const handleJailTryLuck = () => {
    if (!gameState) return;
    setShowJailDecision(false);
    // Автоматически бросаем кубики для попытки выйти на дубле
    rollDice(gameState.id, (data) => {
      if (data.success && data.game && data.diceRoll) {
        setGameState(data.game);
        const { die1, die2 } = data.diceRoll;
        
        if (die1 === die2) {
          // 🎉 Дубль! Игрок вышел из тюрьмы — сервер должен дать возможность бросить кубики для хода,
          // но пропущенный ход уже учтён. Не меняем canRoll, ждём обновления от сервера.
          showToast(`🎲 ${die1}+${die2} = дубль! Вы свободны!`, 'success');
        } else {
          // ❌ Не дубль — штраф $50 списывается и ход завершается автоматически сервером.
          // Не меняем canRoll, сервер сам передаст ход следующему.
          showToast(`🎲 ${die1}+${die2} — не дубль. $50 списано, ход завершён`, 'warning');
          setLastDiceRoll(undefined);
        }
      } else {
        showToast(data.message || 'Ошибка броска кубиков', 'error');
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

  const handleConfirmTax = () => {
    if (!gameState || !showTaxModal) return;
    confirmTax(gameState.id, showTaxModal.amount, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
      }
    });
    setShowTaxModal(null);
  };

  const handleBankruptcy = () => {
    if (!gameState) return;
    // При банкротстве из-за налога или карточки, кредитор - банк (undefined)
    declareBankruptcy(gameState.id, undefined, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast('💀 Вы объявили банкротство', 'error');
      }
    });
    // Закрываем все модальные окна
    setShowTaxModal(null);
    setCurrentCard(null);
  };

  const handleConfirmRent = () => {
    if (!gameState || !showRentModal) return;
    confirmRent(gameState.id, showRentModal.propertyId, showRentModal.diceTotal, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast(`💸 Оплачена аренда: $${data.rent}`, 'warning');
        setCurrentCreditor(null); // Очищаем кредитора
      }
    });
    setShowRentModal(null);
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

  const handleMortgageProperty = (propertyId: number) => {
    if (!gameState) return;
    mortgageProperty(gameState.id, propertyId, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast('🏦 Недвижимость заложена!', 'success');
      } else {
        showToast(data.message || 'Не удалось заложить недвижимость', 'error');
      }
    });
  };

  const handleUnmortgageProperty = (propertyId: number) => {
    if (!gameState) return;
    unmortgageProperty(gameState.id, propertyId, (data) => {
      if (data.success && data.game) {
        setGameState(data.game);
        showToast('✅ Недвижимость выкуплена!', 'success');
      } else {
        showToast(data.message || 'Не удалось выкупить недвижимость', 'error');
      }
    });
  };

  const canBuildHouseOnProperty = (propertyId: number): boolean => {
    if (!gameState) return false;
    const property = gameState.board[propertyId];
    const player = gameState.players.find(p => p.id === myPlayerId);

    if (!player || !property || property.owner !== myPlayerId || property.type !== 'property') {
      return false;
    }

    // Проверка на монополию
    const colorGroup = gameState.board.filter(p => p.color === property.color && p.type === 'property');
    const ownsAll = colorGroup.every(p => p.owner === myPlayerId);

    if (!ownsAll) return false;

    // Нельзя строить больше 5 домов
    if (property.houses >= 5) return false;

    // Нельзя строить на заложенной недвижимости
    if (property.mortgaged) return false;

    // Проверка равномерности застройки
    const maxHouses = Math.max(...colorGroup.map(p => p.houses));
    if (property.houses < maxHouses) return true;

    return property.houses === maxHouses;
  };

  const canSellHouseOnProperty = (propertyId: number): boolean => {
    if (!gameState) return false;
    const property = gameState.board[propertyId];

    if (!property || property.owner !== myPlayerId || property.houses === 0) {
      return false;
    }

    // Проверка равномерности продажи
    const colorGroup = gameState.board.filter(p => p.color === property.color && p.type === 'property');
    const minHouses = Math.min(...colorGroup.map(p => p.houses));

    return property.houses === minHouses || property.houses > minHouses;
  };

  const hasMonopolyOnProperty = (propertyId: number): boolean => {
    if (!gameState) return false;
    const property = gameState.board[propertyId];

    if (!property || property.type !== 'property') {
      return false;
    }

    // Проверка на монополию
    const colorGroup = gameState.board.filter(p => p.color === property.color && p.type === 'property');
    const ownsAll = colorGroup.every(p => p.owner === myPlayerId);

    return ownsAll;
  };

  // Показываем блокирующий экран ТОЛЬКО при первичном подключении (нет gameState)
  if (!connected && !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1c1c1e' }}>
        <div className="rounded-2xl p-10 animate-scale-in" style={{ background: '#252528', boxShadow: '12px 12px 24px rgba(0,0,0,0.4), -12px -12px 24px rgba(60,60,60,0.1)' }}>
          <div className="text-center">
            <div className="text-2xl font-light tracking-widest mb-2" style={{ color: '#d4af37' }}>CONNECTING</div>
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#d4af37', animationDelay: '0s' }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#d4af37', animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#d4af37', animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // НЕБЛОКИРУЮЩИЙ индикатор переподключения В ПРОЦЕССЕ игры (Render sleep recovery)
  if (!connected && gameState) {
    return (
      <>
        {/* Плашка сверху — не перекрывает игру */}
        <div className="fixed top-0 left-0 right-0 z-[1000] bg-[#dc3545]/95 text-white text-center py-2.5 text-sm font-semibold backdrop-blur-sm shadow-lg">
          🔌 Переподключение... <span className="opacity-80">(сервер просыпается)</span>
        </div>
        {/* Игра видна, но интерактив временно отключён */}
        <div className="min-h-screen pt-10" style={{ background: 'var(--color-bg-primary)', pointerEvents: 'none', filter: 'blur(1px)', transition: 'filter 0.3s' }}>
          {phase === 'lobby' && <Lobby onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />}
          {phase === 'waiting' && gameState && <WaitingRoom gameId={gameState.id} players={gameState.players} myPlayerId={myPlayerId} onStartGame={handleStartGame} canStart={gameState.players.length >= 2} />}
          {phase === 'playing' && gameState && (
            <div className="flex justify-center" style={{ paddingTop: '20px', paddingBottom: '20px', minHeight: '1250px' }}>
              <Board board={gameState.board} players={gameState.players} onCellClick={handleCellClick} />
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
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
          <div className="flex justify-center" style={{
            paddingTop: '20px',
            paddingBottom: '20px',
            minHeight: '1250px',
            background: 'linear-gradient(135deg, rgba(75, 75, 80, 0.6) 0%, rgba(42, 42, 46, 0.7) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}>
            <div className="flex items-start" style={{ gap: '20px' }}>
              {/* Доска - игровое поле (независимый блок) */}
              <div className="w-[1000px] h-[1000px] flex-shrink-0">
                <Board
                  board={gameState.board}
                  players={gameState.players}
                  onCellClick={(propertyId) => {
                    const property = gameState.board[propertyId];
                    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

                    // Если клик на свою недвижимость - показываем информацию
                    if (property.owner === myPlayerId && property.price > 0) {
                      setShowPropertyInfo(propertyId);
                      return;
                    }

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

              {/* Центральная область для модальных окон */}
              <div className="w-[300px] flex-shrink-0 space-y-4">
                {/* Модальное окно отправки в тюрьму */}
                {showGoToJail && (
                  <div className="bg-white rounded-lg shadow-2xl border-4 border-red-600 p-6">
                    <GoToJailModal
                      onConfirm={() => {
                        if (gameState) {
                          confirmGoToJail(gameState.id, (data) => {
                            if (data.success && data.game) {
                              setGameState(data.game);
                            }
                          });
                        }
                        setShowGoToJail(false);
                      }}
                    />
                  </div>
                )}

                {/* Модальное окно налога */}
                {showTaxModal && gameState && (
                  <div className="game-modal-fixed p-6">
                    <h2 className="game-modal-title">Налог</h2>
                    <TaxModal
                      taxType={showTaxModal.type}
                      amount={showTaxModal.amount}
                      playerMoney={gameState.players.find(p => p.id === myPlayerId)?.money || 0}
                      onConfirm={handleConfirmTax}
                      onBankruptcy={handleBankruptcy}
                    />
                  </div>
                )}

                {/* 🔥 Модальное окно тюрьмы (пропуск хода) */}
                {showJailDecision && gameState && (
                  <div className="game-modal-fixed">
                    <JailDecisionModal
                      playerName={gameState.players.find(p => p.id === myPlayerId)?.name || 'Игрок'}
                      playerMoney={gameState.players.find(p => p.id === myPlayerId)?.money || 0}
                      jailTurns={gameState.players.find(p => p.id === myPlayerId)?.jailTurns || 0}
                      onPayFine={handleJailPayFine}
                      onTryLuck={handleJailTryLuck}
                      canPay={(gameState.players.find(p => p.id === myPlayerId)?.money || 0) >= 50}
                    />
                  </div>
                )}

                {/* Модальное окно ренты */}
                {showRentModal && gameState && (
                  <div className="game-modal-fixed">
                    <h2 className="game-modal-title">Оплата аренды</h2>
                    <RentModal
                      property={gameState.board[showRentModal.propertyId]}
                      rent={showRentModal.rent}
                      owner={gameState.players.find(p => p.id === gameState.board[showRentModal.propertyId].owner)!}
                      playerMoney={gameState.players.find(p => p.id === myPlayerId)?.money || 0}
                      onConfirm={handleConfirmRent}
                      onBankruptcy={() => {
                        if (currentCreditor) {
                          declareBankruptcy(gameState.id, currentCreditor, (data) => {
                            if (data.success && data.game) {
                              setGameState(data.game);
                              setShowRentModal(null);
                              setCurrentCreditor(null);
                              // Автоматически завершаем ход после банкротства
                              endTurn(gameState.id, (turnData) => {
                                if (turnData.success && turnData.game) {
                                  setGameState(turnData.game);
                                  setCanRoll(true);
                                  setLastDiceRoll(undefined);
                                }
                              });
                            }
                          });
                        }
                      }}
                    />
                  </div>
                )}

                {/* Модальное окно карточки */}
                {currentCard && gameState && (
                  <div className="game-modal-fixed">
                    <CardModal
                      card={currentCard}
                      playerMoney={gameState.players.find(p => p.id === myPlayerId)?.money || 0}
                      onClose={() => {
                        if (currentCard && gameState) {
                          confirmCard(gameState.id, currentCard, (data) => {
                            if (data.success && data.game) {
                              setGameState(data.game);
                            }
                          });
                        }
                        setCurrentCard(null);
                      }}
                      onBankruptcy={handleBankruptcy}
                    />
                  </div>
                )}

                {/* Модальное окно торговли */}
                {showTradeModal && (
                  <div className="game-modal-fixed p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-black uppercase monopoly-title" style={{ color: 'var(--color-accent-gold)' }}>
                        Торговля
                      </h2>
                      <button
                        onClick={() => setShowTradeModal(false)}
                        className="hover:text-[var(--color-accent-gold)] font-bold text-2xl leading-none transition-colors"
                        style={{ color: 'var(--color-text-secondary)' }}
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
                )}

                {/* Модальное окно управления недвижимостью */}
                {showPropertyManagement && (
                  <div className="game-modal-fixed p-4">
                    <PropertyManagement
                      properties={gameState.board}
                      player={gameState.players.find(p => p.id === myPlayerId)!}
                      onClose={() => setShowPropertyManagement(false)}
                      onMortgage={(propertyId) => {
                        if (!gameState) return;
                        mortgageProperty(gameState.id, propertyId, (data) => {
                          if (data.success && data.game) {
                            setGameState(data.game);
                            showToast('💰 Недвижимость заложена!', 'success');
                          } else {
                            showToast(data.message || 'Не удалось заложить недвижимость', 'error');
                          }
                        });
                      }}
                      onUnmortgage={(propertyId) => {
                        if (!gameState) return;
                        unmortgageProperty(gameState.id, propertyId, (data) => {
                          if (data.success && data.game) {
                            setGameState(data.game);
                            showToast('🏦 Недвижимость выкуплена!', 'success');
                          } else {
                            showToast(data.message || 'Не удалось выкупить недвижимость', 'error');
                          }
                        });
                      }}
                    />
                  </div>
                )}

                {/* Анимация победы */}
                {winner && (
                  <div className="game-modal-fixed p-6 border-2 border-[var(--color-accent-gold)]">
                    <VictoryAnimation
                      winner={winner}
                      onClose={() => {
                        setWinner(null);
                        setPhase('lobby');
                        setGameState(null);
                      }}
                    />
                  </div>
                )}

                {/* Анимация банкротства */}
                {bankruptPlayer && (
                  <div className="game-modal-fixed p-6 border-2 border-[var(--color-accent-red)]">
                    <BankruptcyAnimation
                      player={bankruptPlayer}
                      onComplete={() => setBankruptPlayer(null)}
                    />
                  </div>
                )}

                {/* Модальное окно покупки недвижимости */}
                {selectedProperty !== null && (
                  <div className="game-modal-fixed p-4">
                    <PropertyModal
                      property={gameState.board[selectedProperty]}
                      playerMoney={gameState.players.find(p => p.id === myPlayerId)?.money || 0}
                      onBuy={handleBuyProperty}
                      onClose={() => setSelectedProperty(null)}
                      canBuy={(gameState.players.find(p => p.id === myPlayerId)?.money || 0) >= gameState.board[selectedProperty].price}
                    />
                  </div>
                )}
              </div>

              {/* Список игроков - справа от центральной области (независимый блок) */}
              <div className="w-80 flex-shrink-0 space-y-4">
                {/* Таблица игроков */}
                <div className="game-panel-fixed">
                  <PlayersList
                    players={gameState.players}
                    currentPlayerId={gameState.players[gameState.currentPlayerIndex]?.id || ''}
                    myPlayerId={myPlayerId}
                  />
                </div>

                {/* Модальное окно информации о недвижимости */}
                {showPropertyInfo !== null && (
                  <div className="game-modal-fixed p-4">
                    <PropertyInfoModal
                      property={gameState.board[showPropertyInfo]}
                      onMortgage={() => {
                        handleMortgageProperty(showPropertyInfo);
                        setShowPropertyInfo(null);
                      }}
                      onUnmortgage={() => {
                        handleUnmortgageProperty(showPropertyInfo);
                        setShowPropertyInfo(null);
                      }}
                      onBuildHouse={() => {
                        handleBuildHouse(showPropertyInfo);
                      }}
                      onSellHouse={() => {
                        handleSellHouse(showPropertyInfo);
                      }}
                      canBuildHouse={canBuildHouseOnProperty(showPropertyInfo)}
                      canSellHouse={canSellHouseOnProperty(showPropertyInfo)}
                      hasMonopoly={hasMonopolyOnProperty(showPropertyInfo)}
                      onClose={() => setShowPropertyInfo(null)}
                    />
                  </div>
                )}

                {/* Панель управления для текущего игрока */}
                {gameState.players[gameState.currentPlayerIndex]?.id === myPlayerId && (
                  <div className="game-panel-fixed">
                    <h3 className="game-modal-title mb-3">
                      Ваш ход
                    </h3>

                    {/* Кубики */}
                    {lastDiceRoll && (
                      <div className="mb-3 flex justify-center">
                        <div className="text-xl font-bold flex items-center gap-2">
                          <FontAwesomeIcon icon={faDice} /> {lastDiceRoll.dice1} + {lastDiceRoll.dice2} = {lastDiceRoll.total}
                        </div>
                      </div>
                    )}

                    {/* Кнопки */}
                    <div className="space-y-2">
                      {canRoll && (
                        <button
                          onClick={handleRollDice}
                          className="w-full py-3 px-4 rounded-lg font-bold text-sm text-white transition-all shadow-md uppercase"
                          style={{ backgroundColor: '#2d8659' }}
                        >
                          <FontAwesomeIcon icon={faDice} className="mr-2" />
                          Бросить кубики
                        </button>
                      )}

                      {!canRoll && (
                        <button
                          onClick={handleEndTurn}
                          disabled={currentCard !== null || showGoToJail || showTaxModal !== null || showRentModal !== null || showJailDecision}
                          className="w-full py-3 px-4 rounded-lg font-bold text-sm text-white transition-all shadow-md uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: '#2d8659' }}
                        >
                          <FontAwesomeIcon icon={faCheck} className="mr-2" />
                          Завершить ход
                        </button>
                      )}

                      <button
                        onClick={() => setShowTradeModal(true)}
                        disabled={showJailDecision}
                        className="w-full py-2 px-4 rounded-lg font-bold text-xs text-white transition-all shadow-md uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#dc3545' }}
                      >
                        <FontAwesomeIcon icon={faHandshake} className="mr-2" />
                        Торговля
                      </button>

                      <button
                        onClick={() => setShowPropertyManagement(true)}
                        disabled={showJailDecision}
                        className="w-full py-2 px-4 rounded-lg font-bold text-xs text-white transition-all shadow-md uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#dc3545' }}
                      >
                        🏠 Недвижимость
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
