export interface Player {
  id: string;
  name: string;
  position: number;
  money: number;
  properties: number[];
  inJail: boolean;
  jailTurns: number;
  color: string;
  getOutOfJailFreeCards: number;
  isBankrupt: boolean;
}

export interface Property {
  id: number;
  name: string;
  price: number;
  rent: number[];
  color: string;
  houses: number;
  owner: string | null;
  type: 'property' | 'railroad' | 'utility' | 'special';
}

export interface DiceRoll {
  dice1: number;
  dice2: number;
  total: number;
  isDouble: boolean;
}

export interface Card {
  id: number;
  type: 'chance' | 'community';
  text: string;
  action: 'money' | 'move' | 'jail' | 'jailFree' | 'repairs' | 'players';
  value?: number;
  position?: number;
}

export interface AuctionBid {
  playerId: string;
  amount: number;
  timestamp: number;
}

export interface Auction {
  propertyId: number;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  bids: AuctionBid[];
  startTime: number;
  endTime: number;
  active: boolean;
  initiatorId: string; // ID игрока, который начал аукцион
}

export interface TradeOffer {
  id: string;
  fromPlayerId: string;
  toPlayerId: string;
  offeredProperties: number[];
  offeredMoney: number;
  requestedProperties: number[];
  requestedMoney: number;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: number;
}

export interface GameState {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  board: Property[];
  started: boolean;
  finished: boolean;
  winner: string | null;
  auction: Auction | null;
  tradeOffers: TradeOffer[];
  chanceCards: Card[];
  communityCards: Card[];
  chanceIndex: number;
  communityIndex: number;
}
