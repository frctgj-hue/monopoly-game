import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameService } from './services/game.service';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Разрешить все источники для локальной сети
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const gameService = new GameService();

io.on('connection', (socket) => {
  console.log('Игрок подключился:', socket.id);

  // Создание новой игры
  socket.on('create-game', (callback) => {
    const gameId = Math.random().toString(36).substring(7);
    const game = gameService.createGame(gameId);
    socket.join(gameId);
    callback({ success: true, gameId, game });
    console.log(`Игра создана: ${gameId}`);
  });

  // Присоединение к игре
  socket.on('join-game', ({ gameId, playerName }, callback) => {
    const game = gameService.getGame(gameId);
    if (!game) {
      callback({ success: false, message: 'Игра не найдена' });
      return;
    }

    if (game.started) {
      callback({ success: false, message: 'Игра уже началась' });
      return;
    }

    const player = gameService.addPlayer(gameId, socket.id, playerName);
    if (!player) {
      callback({ success: false, message: 'Не удалось присоединиться' });
      return;
    }

    socket.join(gameId);
    const updatedGame = gameService.getGame(gameId);
    io.to(gameId).emit('player-joined', { player, game: updatedGame });
    callback({ success: true, player, game: updatedGame });
    console.log(`${playerName} присоединился к игре ${gameId}`);
  });

  // Начало игры
  socket.on('start-game', ({ gameId }, callback) => {
    const success = gameService.startGame(gameId);
    if (!success) {
      callback({ success: false, message: 'Недостаточно игроков (минимум 2)' });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('game-started', { game });
    callback({ success: true, game });
    console.log(`Игра ${gameId} началась`);
  });

  // Бросок кубиков
  socket.on('roll-dice', ({ gameId }, callback) => {
    const game = gameService.getGame(gameId);
    if (!game) {
      callback({ success: false, message: 'Игра не найдена' });
      return;
    }

    const currentPlayer = gameService.getCurrentPlayer(gameId);
    if (!currentPlayer || currentPlayer.id !== socket.id) {
      callback({ success: false, message: 'Не ваш ход' });
      return;
    }

    const diceRoll = gameService.rollDice();

    // Проверка на тюрьму
    if (currentPlayer.inJail) {
      if (diceRoll.isDouble) {
        gameService.tryGetOutOfJail(gameId, socket.id, 'double');
        const newPosition = gameService.movePlayer(gameId, socket.id, diceRoll.total);
        const updatedGame = gameService.getGame(gameId);
        io.to(gameId).emit('dice-rolled', {
          playerId: socket.id,
          diceRoll,
          newPosition,
          game: updatedGame,
          jailEscape: true
        });
        callback({ success: true, diceRoll, newPosition, game: updatedGame, jailEscape: true });
      } else {
        const forced = gameService.checkJailTurns(gameId, socket.id);
        const updatedGame = gameService.getGame(gameId);
        io.to(gameId).emit('jail-turn', {
          playerId: socket.id,
          diceRoll,
          game: updatedGame,
          forcedOut: forced
        });
        callback({ success: true, diceRoll, game: updatedGame, stayInJail: true, forcedOut: forced });
      }
      return;
    }

    const newPosition = gameService.movePlayer(gameId, socket.id, diceRoll.total);

    // Проверка на клетку "Идти в тюрьму"
    if (newPosition === 30) {
      // НЕ отправляем в тюрьму сразу, только показываем окно
      const updatedGame = gameService.getGame(gameId);
      io.to(gameId).emit('show-go-to-jail', { playerId: socket.id, game: updatedGame });
      callback({ success: true, diceRoll, newPosition, game: updatedGame, showGoToJail: true });
      return;
    }

    // Проверка на налоговые клетки
    if (newPosition === 4) {
      // Подоходный налог
      const updatedGame = gameService.getGame(gameId);
      socket.emit('show-tax', { playerId: socket.id, taxType: 'income', amount: 200, game: updatedGame });
      callback({ success: true, diceRoll, newPosition, game: updatedGame, showTax: true });
      return;
    }

    if (newPosition === 38) {
      // Налог на роскошь
      const updatedGame = gameService.getGame(gameId);
      socket.emit('show-tax', { playerId: socket.id, taxType: 'luxury', amount: 100, game: updatedGame });
      callback({ success: true, diceRoll, newPosition, game: updatedGame, showTax: true });
      return;
    }

    // Проверка на клетки "Шанс" (7, 22, 36) и "Казна Зеона" (2, 17, 33)
    const chancePositions = [7, 22, 36];
    const communityPositions = [2, 17, 33];

    if (chancePositions.includes(newPosition)) {
      const card = gameService.drawCard(gameId, 'chance');
      if (card) {
        // Показываем карточку только игроку, который её вытянул
        const updatedGame = gameService.getGame(gameId);
        socket.emit('card-drawn', { playerId: socket.id, card, game: updatedGame });
        callback({ success: true, diceRoll, newPosition, game: updatedGame, card });
        return;
      }
    }

    if (communityPositions.includes(newPosition)) {
      const card = gameService.drawCard(gameId, 'community');
      if (card) {
        // Показываем карточку только игроку, который её вытянул
        const updatedGame = gameService.getGame(gameId);
        socket.emit('card-drawn', { playerId: socket.id, card, game: updatedGame });
        callback({ success: true, diceRoll, newPosition, game: updatedGame, card });
        return;
      }
    }

    // Проверка на аренду при попадании на чужую недвижимость
    let updatedGame = gameService.getGame(gameId);
    if (updatedGame) {
      const property = updatedGame.board[newPosition];
      if (property && property.owner && property.owner !== socket.id && property.price > 0) {
        // Вычисляем аренду, но НЕ списываем её
        const rent = gameService.calculateRent(gameId, socket.id, newPosition, diceRoll.total);
        if (rent > 0) {
          // Показываем модальное окно только игроку, который должен платить
          socket.emit('show-rent', {
            playerId: socket.id,
            propertyId: newPosition,
            rent,
            diceTotal: diceRoll.total,
            game: updatedGame
          });
          callback({ success: true, diceRoll, newPosition, game: updatedGame, showRent: true });
          return;
        }
      }
    }

    io.to(gameId).emit('dice-rolled', {
      playerId: socket.id,
      diceRoll,
      newPosition,
      game: updatedGame
    });

    callback({ success: true, diceRoll, newPosition, game: updatedGame });
  });

  // Покупка недвижимости
  socket.on('buy-property', ({ gameId, propertyId }, callback) => {
    const success = gameService.buyProperty(gameId, socket.id, propertyId);
    if (!success) {
      callback({ success: false, message: 'Не удалось купить недвижимость' });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('property-bought', { playerId: socket.id, propertyId, game });
    callback({ success: true, game });
  });

  // Оплата аренды
  socket.on('pay-rent', ({ gameId, propertyId, diceTotal }, callback) => {
    const rent = gameService.payRent(gameId, socket.id, propertyId, diceTotal);
    const game = gameService.getGame(gameId);

    io.to(gameId).emit('rent-paid', { playerId: socket.id, propertyId, rent, game });
    callback({ success: true, rent, game });
  });

  // Подтверждение оплаты ренты
  socket.on('confirm-rent', ({ gameId, propertyId, diceTotal }, callback) => {
    const rent = gameService.payRent(gameId, socket.id, propertyId, diceTotal);
    const game = gameService.getGame(gameId);

    io.to(gameId).emit('rent-paid', { playerId: socket.id, propertyId, rent, game });
    callback({ success: true, rent, game });
  });

  // Завершение хода
  socket.on('end-turn', ({ gameId }, callback) => {
    gameService.nextTurn(gameId);
    const game = gameService.getGame(gameId);
    const nextPlayer = gameService.getCurrentPlayer(gameId);

    io.to(gameId).emit('turn-ended', { game, nextPlayer });
    callback({ success: true, game, nextPlayer });
  });

  // Выход из тюрьмы
  socket.on('pay-jail-fine', ({ gameId }, callback) => {
    const result = gameService.tryGetOutOfJail(gameId, socket.id, 'pay');
    if (!result.success) {
      callback({ success: false, message: result.message });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('jail-paid', { playerId: socket.id, game });
    callback({ success: true, game });
  });

  socket.on('use-jail-card', ({ gameId }, callback) => {
    const result = gameService.tryGetOutOfJail(gameId, socket.id, 'card');
    if (!result.success) {
      callback({ success: false, message: result.message });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('jail-card-used', { playerId: socket.id, game });
    callback({ success: true, game });
  });

  // Банкротство
  socket.on('declare-bankruptcy', ({ gameId, creditorId }, callback) => {
    const success = gameService.declareBankruptcy(gameId, socket.id, creditorId);
    if (!success) {
      callback({ success: false, message: 'Не удалось объявить банкротство' });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('player-bankrupt', { playerId: socket.id, creditorId, game });

    if (game?.finished && game.winner) {
      io.to(gameId).emit('game-finished', { winner: game.winner, game });
    }

    callback({ success: true, game });
  });

  // Вытягивание карточки
  socket.on('draw-card', ({ gameId, type }, callback) => {
    const card = gameService.drawCard(gameId, type);
    if (!card) {
      callback({ success: false, message: 'Не удалось вытянуть карточку' });
      return;
    }

    const result = gameService.executeCard(gameId, socket.id, card);
    const game = gameService.getGame(gameId);

    io.to(gameId).emit('card-drawn', { playerId: socket.id, card, game });
    callback({ success: true, card, game });
  });

  // Подтверждение карточки - применить эффект
  socket.on('confirm-card', ({ gameId, card }, callback) => {
    const result = gameService.executeCard(gameId, socket.id, card);
    const game = gameService.getGame(gameId);

    io.to(gameId).emit('card-executed', { playerId: socket.id, card, game });
    callback({ success: true, game });
  });

  // Подтверждение отправки в тюрьму
  socket.on('confirm-go-to-jail', ({ gameId }, callback) => {
    gameService.sendToJail(gameId, socket.id);
    const game = gameService.getGame(gameId);

    io.to(gameId).emit('sent-to-jail', { playerId: socket.id, game });
    callback({ success: true, game });
  });

  // Подтверждение оплаты налога
  socket.on('confirm-tax', ({ gameId, amount }, callback) => {
    const success = gameService.payTax(gameId, socket.id, amount);
    if (!success) {
      callback({ success: false, message: 'Не удалось оплатить налог' });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('tax-paid', { playerId: socket.id, amount, game });
    callback({ success: true, game });
  });

  // Строительство дома
  socket.on('build-house', ({ gameId, propertyId }, callback) => {
    const success = gameService.buildHouse(gameId, socket.id, propertyId);
    if (!success) {
      callback({ success: false, message: 'Не удалось построить дом' });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('house-built', { playerId: socket.id, propertyId, game });
    callback({ success: true, game });
  });

  // Продажа дома
  socket.on('sell-house', ({ gameId, propertyId }, callback) => {
    const success = gameService.sellHouse(gameId, socket.id, propertyId);
    if (!success) {
      callback({ success: false, message: 'Не удалось продать дом' });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('house-sold', { playerId: socket.id, propertyId, game });
    callback({ success: true, game });
  });

  // Залог недвижимости
  socket.on('mortgage-property', ({ gameId, propertyId }, callback) => {
    const success = gameService.mortgageProperty(gameId, socket.id, propertyId);
    if (!success) {
      callback({ success: false, message: 'Не удалось заложить недвижимость' });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('property-mortgaged', { playerId: socket.id, propertyId, game });
    callback({ success: true, game });
  });

  // Выкуп недвижимости
  socket.on('unmortgage-property', ({ gameId, propertyId }, callback) => {
    const success = gameService.unmortgageProperty(gameId, socket.id, propertyId);
    if (!success) {
      callback({ success: false, message: 'Не удалось выкупить недвижимость' });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('property-unmortgaged', { playerId: socket.id, propertyId, game });
    callback({ success: true, game });
  });

  // Строительство дома
  socket.on('build-house', ({ gameId, propertyId }, callback) => {
    const result = gameService.createTradeOffer(
      gameId,
      socket.id,
      toPlayerId,
      offeredProperties,
      offeredMoney,
      requestedProperties,
      requestedMoney
    );

    if (!result.success) {
      callback({ success: false, message: result.message });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('trade-created', { tradeId: result.tradeId, game });
    callback({ success: true, tradeId: result.tradeId, game });
  });

  socket.on('accept-trade', ({ gameId, tradeId }, callback) => {
    const result = gameService.acceptTrade(gameId, tradeId, socket.id);
    if (!result.success) {
      callback({ success: false, message: result.message });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('trade-accepted', { tradeId, game });
    callback({ success: true, game });
  });

  socket.on('reject-trade', ({ gameId, tradeId }, callback) => {
    const result = gameService.rejectTrade(gameId, tradeId, socket.id);
    if (!result.success) {
      callback({ success: false, message: result.message });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('trade-rejected', { tradeId, game });
    callback({ success: true, game });
  });

  socket.on('cancel-trade', ({ gameId, tradeId }, callback) => {
    const result = gameService.cancelTrade(gameId, tradeId, socket.id);
    if (!result.success) {
      callback({ success: false, message: result.message });
      return;
    }

    const game = gameService.getGame(gameId);
    io.to(gameId).emit('trade-cancelled', { tradeId, game });
    callback({ success: true, game });
  });

  // Чат
  socket.on('send-message', ({ gameId, message }, callback) => {
    const game = gameService.getGame(gameId);
    if (!game) {
      callback?.({ success: false, message: 'Игра не найдена' });
      return;
    }

    const player = game.players.find(p => p.id === socket.id);
    if (!player) {
      callback?.({ success: false, message: 'Игрок не найден' });
      return;
    }

    const chatMessage = {
      id: `${Date.now()}-${socket.id}`,
      playerId: socket.id,
      playerName: player.name,
      playerColor: player.color,
      message: message,
      timestamp: Date.now(),
    };

    io.to(gameId).emit('chat-message', { message: chatMessage });
    callback?.({ success: true });
  });

  socket.on('disconnect', () => {
    console.log('Игрок отключился:', socket.id);
  });
});

httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Локальный доступ: http://localhost:${PORT}`);
  console.log(`Сетевой доступ: http://192.168.0.107:${PORT}`);
});
