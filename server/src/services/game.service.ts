import { GameState, Player, DiceRoll, Card } from '../types/game.types';
import { BOARD } from '../models/board';
import { CHANCE_CARDS, COMMUNITY_CARDS, shuffleCards } from '../models/cards';

export class GameService {
  private games: Map<string, GameState> = new Map();

  createGame(gameId: string): GameState {
    const game: GameState = {
      id: gameId,
      players: [],
      currentPlayerIndex: 0,
      board: JSON.parse(JSON.stringify(BOARD)), // Глубокое копирование
      started: false,
      finished: false,
      winner: null,
      chanceCards: shuffleCards(CHANCE_CARDS),
      communityCards: shuffleCards(COMMUNITY_CARDS),
      chanceIndex: 0,
      communityIndex: 0,
      tradeOffers: [],
    };
    this.games.set(gameId, game);
    return game;
  }

  getGame(gameId: string): GameState | undefined {
    return this.games.get(gameId);
  }

  addPlayer(gameId: string, playerId: string, playerName: string): Player | null {
    const game = this.games.get(gameId);
    if (!game || game.started || game.players.length >= 4) {
      return null;
    }

    const colors = ['red', 'blue', 'green', 'yellow'];
    const usedColors = game.players.map(p => p.color);
    const availableColor = colors.find(c => !usedColors.includes(c)) || 'red';

    const player: Player = {
      id: playerId,
      name: playerName,
      position: 0,
      money: 1500,
      properties: [],
      inJail: false,
      jailTurns: 0,
      color: availableColor,
      getOutOfJailFreeCards: 0,
      isBankrupt: false,
    };

    game.players.push(player);
    return player;
  }

  startGame(gameId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.players.length < 2) {
      return false;
    }
    game.started = true;
    return true;
  }

  rollDice(): DiceRoll {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    return {
      dice1,
      dice2,
      total: dice1 + dice2,
      isDouble: dice1 === dice2,
    };
  }

  movePlayer(gameId: string, playerId: string, steps: number): number {
    const game = this.games.get(gameId);
    if (!game) return -1;

    const player = game.players.find(p => p.id === playerId);
    if (!player) return -1;

    const oldPosition = player.position;
    player.position = (player.position + steps) % 40;

    // Если прошли через старт, получаем $200
    if (player.position < oldPosition) {
      player.money += 200;
    }

    // Обработка специальных клеток
    this.handleSpecialCell(gameId, playerId, player.position);

    return player.position;
  }

  handleSpecialCell(gameId: string, playerId: string, position: number): void {
    const game = this.games.get(gameId);
    if (!game) return;

    const player = game.players.find(p => p.id === playerId);
    if (!player) return;

    const cell = game.board[position];

    // Подоходный налог (клетка 4) - теперь обрабатывается через модальное окно
    // Налог на роскошь (клетка 38) - теперь обрабатывается через модальное окно

    // Идти в тюрьму (клетка 30)
    if (position === 30) {
      this.sendToJail(gameId, playerId);
    }
  }

  payTax(gameId: string, playerId: string, amount: number): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.id === playerId);
    if (!player) return false;

    player.money -= amount;
    return true;
  }

  calculateRailroadRent(gameId: string, ownerId: string): number {
    const game = this.games.get(gameId);
    if (!game) return 0;

    const owner = game.players.find(p => p.id === ownerId);
    if (!owner) return 0;

    const railroadCount = owner.properties.filter(propId => {
      const prop = game.board[propId];
      return prop && prop.type === 'railroad';
    }).length;

    const rentMap = [0, 50, 100, 200, 400];
    return rentMap[railroadCount] || 0;
  }

  calculateUtilityRent(gameId: string, ownerId: string, diceTotal: number): number {
    const game = this.games.get(gameId);
    if (!game) return 0;

    const owner = game.players.find(p => p.id === ownerId);
    if (!owner) return 0;

    const utilityCount = owner.properties.filter(propId => {
      const prop = game.board[propId];
      return prop && prop.type === 'utility';
    }).length;

    return utilityCount === 2 ? diceTotal * 10 : diceTotal * 4;
  }

  getCurrentPlayer(gameId: string): Player | null {
    const game = this.games.get(gameId);
    if (!game) return null;
    return game.players[game.currentPlayerIndex];
  }

  nextTurn(gameId: string): void {
    const game = this.games.get(gameId);
    if (!game) return;
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
  }

  buyProperty(gameId: string, playerId: string, propertyId: number): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.id === playerId);
    const property = game.board[propertyId];

    if (!player || !property || property.owner || player.money < property.price) {
      return false;
    }

    player.money -= property.price;
    player.properties.push(propertyId);
    property.owner = playerId;
    return true;
  }

  payRent(gameId: string, playerId: string, propertyId: number, diceTotal?: number): number {
    const game = this.games.get(gameId);
    if (!game) return 0;

    const player = game.players.find(p => p.id === playerId);
    const property = game.board[propertyId];

    if (!player || !property || !property.owner || property.owner === playerId) {
      return 0;
    }

    const owner = game.players.find(p => p.id === property.owner);
    if (!owner) return 0;

    let rent = 0;

    if (property.type === 'railroad') {
      rent = this.calculateRailroadRent(gameId, property.owner);
    } else if (property.type === 'utility') {
      rent = this.calculateUtilityRent(gameId, property.owner, diceTotal || 0);
    } else {
      rent = property.rent[property.houses] || property.rent[0] || 0;
    }

    const actualRent = Math.min(rent, player.money);

    player.money -= actualRent;
    owner.money += actualRent;

    return actualRent;
  }

  calculateRent(gameId: string, playerId: string, propertyId: number, diceTotal?: number): number {
    const game = this.games.get(gameId);
    if (!game) return 0;

    const player = game.players.find(p => p.id === playerId);
    const property = game.board[propertyId];

    if (!player || !property || !property.owner || property.owner === playerId) {
      return 0;
    }

    const owner = game.players.find(p => p.id === property.owner);
    if (!owner) return 0;

    let rent = 0;

    if (property.type === 'railroad') {
      rent = this.calculateRailroadRent(gameId, property.owner);
    } else if (property.type === 'utility') {
      rent = this.calculateUtilityRent(gameId, property.owner, diceTotal || 0);
    } else {
      rent = property.rent[property.houses] || property.rent[0] || 0;
    }

    return Math.min(rent, player.money);
  }

  removeGame(gameId: string): void {
    this.games.delete(gameId);
  }

  sendToJail(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.id === playerId);
    if (!player) return false;

    player.position = 10;
    player.inJail = true;
    player.jailTurns = 0;
    return true;
  }

  tryGetOutOfJail(gameId: string, playerId: string, method: 'pay' | 'card' | 'double'): { success: boolean; message?: string } {
    const game = this.games.get(gameId);
    if (!game) return { success: false, message: 'Игра не найдена' };

    const player = game.players.find(p => p.id === playerId);
    if (!player || !player.inJail) return { success: false, message: 'Игрок не в тюрьме' };

    if (method === 'pay') {
      if (player.money < 50) {
        return { success: false, message: 'Недостаточно денег' };
      }
      player.money -= 50;
      player.inJail = false;
      player.jailTurns = 0;
      return { success: true };
    }

    if (method === 'card') {
      if (player.getOutOfJailFreeCards < 1) {
        return { success: false, message: 'Нет карточки освобождения' };
      }
      player.getOutOfJailFreeCards -= 1;
      player.inJail = false;
      player.jailTurns = 0;
      return { success: true };
    }

    if (method === 'double') {
      player.inJail = false;
      player.jailTurns = 0;
      return { success: true };
    }

    return { success: false };
  }

  checkJailTurns(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.id === playerId);
    if (!player || !player.inJail) return false;

    player.jailTurns += 1;

    if (player.jailTurns >= 3) {
      if (player.money >= 50) {
        player.money -= 50;
        player.inJail = false;
        player.jailTurns = 0;
        return true;
      }
    }

    return false;
  }

  declareBankruptcy(gameId: string, playerId: string, creditorId?: string): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.id === playerId);
    if (!player) return false;

    player.isBankrupt = true;

    if (creditorId) {
      const creditor = game.players.find(p => p.id === creditorId);
      if (creditor) {
        creditor.money += player.money;
        player.properties.forEach(propId => {
          const property = game.board[propId];
          if (property) {
            property.owner = creditorId;
            creditor.properties.push(propId);
          }
        });
      }
    } else {
      player.properties.forEach(propId => {
        const property = game.board[propId];
        if (property) {
          property.owner = null;
          property.houses = 0;
        }
      });
    }

    player.money = 0;
    player.properties = [];

    const activePlayers = game.players.filter(p => !p.isBankrupt);
    if (activePlayers.length === 1) {
      game.finished = true;
      game.winner = activePlayers[0].id;
    }

    return true;
  }

  checkBankruptcy(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.id === playerId);
    if (!player) return false;

    return player.money < 0;
  }

  drawCard(gameId: string, type: 'chance' | 'community'): Card | null {
    const game = this.games.get(gameId);
    if (!game) return null;

    if (type === 'chance') {
      const card = game.chanceCards[game.chanceIndex];
      game.chanceIndex = (game.chanceIndex + 1) % game.chanceCards.length;
      return card;
    } else {
      const card = game.communityCards[game.communityIndex];
      game.communityIndex = (game.communityIndex + 1) % game.communityCards.length;
      return card;
    }
  }

  executeCard(gameId: string, playerId: string, card: Card): { success: boolean; message?: string } {
    const game = this.games.get(gameId);
    if (!game) return { success: false, message: 'Игра не найдена' };

    const player = game.players.find(p => p.id === playerId);
    if (!player) return { success: false, message: 'Игрок не найден' };

    switch (card.action) {
      case 'money':
        player.money += card.value || 0;
        break;

      case 'move':
        if (card.position !== undefined) {
          if (card.position === -1) {
            // Ближайшая коммунальная компания
            const utilities = [12, 28];
            const nearest = utilities.reduce((prev, curr) => {
              const prevDist = (prev - player.position + 40) % 40;
              const currDist = (curr - player.position + 40) % 40;
              return currDist < prevDist ? curr : prev;
            });
            player.position = nearest;
          } else {
            const oldPos = player.position;
            player.position = card.position;
            if (player.position < oldPos) {
              player.money += 200; // Прошли через старт
            }
          }
        } else if (card.value) {
          player.position = (player.position + card.value + 40) % 40;
        }
        this.handleSpecialCell(gameId, playerId, player.position);
        break;

      case 'jail':
        this.sendToJail(gameId, playerId);
        break;

      case 'jailFree':
        player.getOutOfJailFreeCards += 1;
        // Если игрок уже в тюрьме, автоматически используем карточку
        if (player.inJail) {
          player.getOutOfJailFreeCards -= 1;
          player.inJail = false;
          player.jailTurns = 0;
        }
        break;

      case 'repairs':
        let totalCost = 0;
        player.properties.forEach(propId => {
          const property = game.board[propId];
          if (property && property.houses > 0) {
            if (property.houses === 5) {
              totalCost += (card.value || 0) * 4; // Отель считается как 4 дома + доп. плата
            } else {
              totalCost += (card.value || 0) * property.houses;
            }
          }
        });
        player.money -= totalCost;
        break;

      case 'players':
        game.players.forEach(p => {
          if (p.id !== playerId) {
            const amount = card.value || 0;
            player.money -= amount;
            p.money += amount;
          }
        });
        break;
    }

    return { success: true };
  }

  canBuildHouse(gameId: string, playerId: string, propertyId: number): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.id === playerId);
    const property = game.board[propertyId];

    if (!player || !property || property.owner !== playerId || property.type !== 'property') {
      return false;
    }

    // Проверка на монополию (все свойства одного цвета)
    const colorGroup = game.board.filter(p => p.color === property.color && p.type === 'property');
    const ownsAll = colorGroup.every(p => p.owner === playerId);

    if (!ownsAll) return false;

    // Нельзя строить больше 5 домов (5-й это отель)
    if (property.houses >= 5) return false;

    // Проверка равномерности застройки
    const maxHouses = Math.max(...colorGroup.map(p => p.houses));
    if (property.houses < maxHouses) return true;

    return property.houses === maxHouses;
  }

  buildHouse(gameId: string, playerId: string, propertyId: number): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.id === playerId);
    const property = game.board[propertyId];

    if (!player || !property || !this.canBuildHouse(gameId, playerId, propertyId)) {
      return false;
    }

    const houseCost = this.getHouseCost(property.color);
    if (player.money < houseCost) return false;

    player.money -= houseCost;
    property.houses += 1;

    return true;
  }

  canSellHouse(gameId: string, playerId: string, propertyId: number): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const property = game.board[propertyId];
    if (!property || property.owner !== playerId || property.houses === 0) {
      return false;
    }

    // Проверка равномерности продажи
    const colorGroup = game.board.filter(p => p.color === property.color && p.type === 'property');
    const minHouses = Math.min(...colorGroup.map(p => p.houses));

    return property.houses === minHouses || property.houses > minHouses;
  }

  sellHouse(gameId: string, playerId: string, propertyId: number): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.id === playerId);
    const property = game.board[propertyId];

    if (!player || !property || !this.canSellHouse(gameId, playerId, propertyId)) {
      return false;
    }

    const houseCost = this.getHouseCost(property.color);
    player.money += houseCost / 2; // Продажа за половину стоимости
    property.houses -= 1;

    return true;
  }

  getHouseCost(color: string): number {
    const costs: { [key: string]: number } = {
      brown: 50,
      lightblue: 50,
      pink: 100,
      orange: 100,
      red: 150,
      yellow: 150,
      green: 200,
      darkblue: 200,
    };
    return costs[color] || 50;
  }

  mortgageProperty(gameId: string, playerId: string, propertyId: number): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.id === playerId);
    const property = game.board[propertyId];

    if (!player || !property || property.owner !== playerId || property.mortgaged) {
      return false;
    }

    // Нельзя заложить недвижимость с домами
    if (property.houses > 0) {
      return false;
    }

    const mortgageValue = Math.floor(property.price / 2);
    player.money += mortgageValue;
    property.mortgaged = true;

    return true;
  }

  unmortgageProperty(gameId: string, playerId: string, propertyId: number): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.id === playerId);
    const property = game.board[propertyId];

    if (!player || !property || property.owner !== playerId || !property.mortgaged) {
      return false;
    }

    // Стоимость выкупа = 110% от залоговой стоимости
    const unmortgageCost = Math.floor((property.price / 2) * 1.1);

    if (player.money < unmortgageCost) {
      return false;
    }

    player.money -= unmortgageCost;
    property.mortgaged = false;

    return true;
  }

  // Торговля
  createTradeOffer(
    gameId: string,
    fromPlayerId: string,
    toPlayerId: string,
    offeredProperties: number[],
    offeredMoney: number,
    requestedProperties: number[],
    requestedMoney: number
  ): { success: boolean; tradeId?: string; message?: string } {
    const game = this.games.get(gameId);
    if (!game) return { success: false, message: 'Игра не найдена' };

    const fromPlayer = game.players.find(p => p.id === fromPlayerId);
    const toPlayer = game.players.find(p => p.id === toPlayerId);

    if (!fromPlayer || !toPlayer) {
      return { success: false, message: 'Игрок не найден' };
    }

    // Валидация
    if (offeredMoney > fromPlayer.money) {
      return { success: false, message: 'Недостаточно денег для предложения' };
    }

    for (const propId of offeredProperties) {
      if (!fromPlayer.properties.includes(propId)) {
        return { success: false, message: 'Вы не владеете предложенной недвижимостью' };
      }
    }

    for (const propId of requestedProperties) {
      if (!toPlayer.properties.includes(propId)) {
        return { success: false, message: 'Игрок не владеет запрашиваемой недвижимостью' };
      }
    }

    const tradeId = Math.random().toString(36).substring(7);
    const trade = {
      id: tradeId,
      fromPlayerId,
      toPlayerId,
      offeredProperties,
      offeredMoney,
      requestedProperties,
      requestedMoney,
      status: 'pending' as const,
      createdAt: Date.now(),
    };

    game.tradeOffers.push(trade);
    return { success: true, tradeId };
  }

  acceptTrade(gameId: string, tradeId: string, playerId: string): { success: boolean; message?: string } {
    const game = this.games.get(gameId);
    if (!game) return { success: false, message: 'Игра не найдена' };

    const trade = game.tradeOffers.find(t => t.id === tradeId);
    if (!trade) return { success: false, message: 'Предложение не найдено' };

    if (trade.toPlayerId !== playerId) {
      return { success: false, message: 'Это не ваше предложение' };
    }

    if (trade.status !== 'pending') {
      return { success: false, message: 'Предложение уже обработано' };
    }

    const fromPlayer = game.players.find(p => p.id === trade.fromPlayerId);
    const toPlayer = game.players.find(p => p.id === trade.toPlayerId);

    if (!fromPlayer || !toPlayer) {
      return { success: false, message: 'Игрок не найден' };
    }

    // Финальная валидация
    if (fromPlayer.money < trade.offeredMoney || toPlayer.money < trade.requestedMoney) {
      return { success: false, message: 'Недостаточно денег' };
    }

    // Выполнение обмена
    fromPlayer.money -= trade.offeredMoney;
    fromPlayer.money += trade.requestedMoney;
    toPlayer.money -= trade.requestedMoney;
    toPlayer.money += trade.offeredMoney;

    // Обмен недвижимостью
    for (const propId of trade.offeredProperties) {
      const index = fromPlayer.properties.indexOf(propId);
      if (index > -1) {
        fromPlayer.properties.splice(index, 1);
        toPlayer.properties.push(propId);
        game.board[propId].owner = toPlayer.id;
      }
    }

    for (const propId of trade.requestedProperties) {
      const index = toPlayer.properties.indexOf(propId);
      if (index > -1) {
        toPlayer.properties.splice(index, 1);
        fromPlayer.properties.push(propId);
        game.board[propId].owner = fromPlayer.id;
      }
    }

    trade.status = 'accepted';
    return { success: true };
  }

  rejectTrade(gameId: string, tradeId: string, playerId: string): { success: boolean; message?: string } {
    const game = this.games.get(gameId);
    if (!game) return { success: false, message: 'Игра не найдена' };

    const trade = game.tradeOffers.find(t => t.id === tradeId);
    if (!trade) return { success: false, message: 'Предложение не найдено' };

    if (trade.toPlayerId !== playerId) {
      return { success: false, message: 'Это не ваше предложение' };
    }

    if (trade.status !== 'pending') {
      return { success: false, message: 'Предложение уже обработано' };
    }

    trade.status = 'rejected';
    return { success: true };
  }

  cancelTrade(gameId: string, tradeId: string, playerId: string): { success: boolean; message?: string } {
    const game = this.games.get(gameId);
    if (!game) return { success: false, message: 'Игра не найдена' };

    const trade = game.tradeOffers.find(t => t.id === tradeId);
    if (!trade) return { success: false, message: 'Предложение не найдено' };

    if (trade.fromPlayerId !== playerId) {
      return { success: false, message: 'Вы не создавали это предложение' };
    }

    if (trade.status !== 'pending') {
      return { success: false, message: 'Предложение уже обработано' };
    }

    trade.status = 'cancelled';
    return { success: true };
  }
}
