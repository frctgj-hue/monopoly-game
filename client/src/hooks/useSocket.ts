import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { GameState, Player, DiceRoll, Card } from '../types/game.types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);

    socketInstance.on('connect', () => {
      console.log('Подключено к серверу');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Отключено от сервера');
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const createGame = (callback: (data: { success: boolean; gameId?: string; game?: GameState }) => void) => {
    socket?.emit('create-game', callback);
  };

  const joinGame = (
    gameId: string,
    playerName: string,
    callback: (data: { success: boolean; message?: string; player?: Player; game?: GameState }) => void
  ) => {
    socket?.emit('join-game', { gameId, playerName }, callback);
  };

  const startGame = (
    gameId: string,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('start-game', { gameId }, callback);
  };

  const rollDice = (
    gameId: string,
    callback: (data: { success: boolean; message?: string; diceRoll?: DiceRoll; newPosition?: number; game?: GameState }) => void
  ) => {
    socket?.emit('roll-dice', { gameId }, callback);
  };

  const buyProperty = (
    gameId: string,
    propertyId: number,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('buy-property', { gameId, propertyId }, callback);
  };

  const payRent = (
    gameId: string,
    propertyId: number,
    diceTotal: number,
    callback: (data: { success: boolean; rent?: number; game?: GameState }) => void
  ) => {
    socket?.emit('pay-rent', { gameId, propertyId, diceTotal }, callback);
  };

  const endTurn = (
    gameId: string,
    callback: (data: { success: boolean; game?: GameState; nextPlayer?: Player }) => void
  ) => {
    socket?.emit('end-turn', { gameId }, callback);
  };

  const payJailFine = (
    gameId: string,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('pay-jail-fine', { gameId }, callback);
  };

  const useJailCard = (
    gameId: string,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('use-jail-card', { gameId }, callback);
  };

  const declareBankruptcy = (
    gameId: string,
    creditorId?: string,
    callback?: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('declare-bankruptcy', { gameId, creditorId }, callback);
  };

  const drawCard = (
    gameId: string,
    type: 'chance' | 'community',
    callback: (data: { success: boolean; message?: string; card?: Card; game?: GameState }) => void
  ) => {
    socket?.emit('draw-card', { gameId, type }, callback);
  };

  const confirmCard = (
    gameId: string,
    card: Card,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('confirm-card', { gameId, card }, callback);
  };

  const confirmGoToJail = (
    gameId: string,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('confirm-go-to-jail', { gameId }, callback);
  };

  const confirmTax = (
    gameId: string,
    amount: number,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('confirm-tax', { gameId, amount }, callback);
  };

  const confirmRent = (
    gameId: string,
    propertyId: number,
    diceTotal: number,
    callback: (data: { success: boolean; rent?: number; game?: GameState }) => void
  ) => {
    socket?.emit('confirm-rent', { gameId, propertyId, diceTotal }, callback);
  };

  const buildHouse = (
    gameId: string,
    propertyId: number,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('build-house', { gameId, propertyId }, callback);
  };

  const sellHouse = (
    gameId: string,
    propertyId: number,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('sell-house', { gameId, propertyId }, callback);
  };

  const mortgageProperty = (
    gameId: string,
    propertyId: number,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('mortgage-property', { gameId, propertyId }, callback);
  };

  const unmortgageProperty = (
    gameId: string,
    propertyId: number,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('unmortgage-property', { gameId, propertyId }, callback);
  };

  const createTrade = (
    gameId: string,
    toPlayerId: string,
    offeredProperties: number[],
    offeredMoney: number,
    requestedProperties: number[],
    requestedMoney: number,
    callback: (data: { success: boolean; message?: string; tradeId?: string; game?: GameState }) => void
  ) => {
    socket?.emit('create-trade', {
      gameId,
      toPlayerId,
      offeredProperties,
      offeredMoney,
      requestedProperties,
      requestedMoney
    }, callback);
  };

  const acceptTrade = (
    gameId: string,
    tradeId: string,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('accept-trade', { gameId, tradeId }, callback);
  };

  const rejectTrade = (
    gameId: string,
    tradeId: string,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('reject-trade', { gameId, tradeId }, callback);
  };

  const cancelTrade = (
    gameId: string,
    tradeId: string,
    callback: (data: { success: boolean; message?: string; game?: GameState }) => void
  ) => {
    socket?.emit('cancel-trade', { gameId, tradeId }, callback);
  };

  const sendMessage = (
    gameId: string,
    message: string,
    callback?: (data: { success: boolean; message?: string }) => void
  ) => {
    socket?.emit('send-message', { gameId, message }, callback);
  };

  return {
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
    cancelTrade,
    sendMessage,
  };
};
