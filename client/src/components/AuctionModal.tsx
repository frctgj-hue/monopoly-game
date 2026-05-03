import { useState, useEffect } from 'react';
import type { Auction, Property, Player } from '../types/game.types';

interface AuctionModalProps {
  auction: Auction | null;
  property: Property | null;
  players: Player[];
  myPlayerId: string;
  onPlaceBid: (amount: number) => void;
  onClose: () => void;
}

export default function AuctionModal({
  auction,
  property,
  players,
  myPlayerId,
  onPlaceBid,
  onClose,
}: AuctionModalProps) {
  const [bidAmount, setBidAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!auction || !auction.active) return;

    setBidAmount(auction.currentBid + 10);

    const interval = setInterval(() => {
      const remaining = Math.max(0, auction.endTime - Date.now());
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [auction]);

  if (!auction || !property) return null;

  const currentBidder = players.find(p => p.id === auction.currentBidder);
  const myPlayer = players.find(p => p.id === myPlayerId);
  const canBid = myPlayer && myPlayer.money >= bidAmount && timeLeft > 0;

  const handleBid = () => {
    if (canBid) {
      onPlaceBid(bidAmount);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}с`;
  };

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      brown: '#8B4513',
      lightblue: '#87CEEB',
      pink: '#FF1493',
      orange: '#FF8C00',
      red: '#DC143C',
      yellow: '#FFD700',
      green: '#228B22',
      darkblue: '#00008B',
    };
    return colorMap[color] || '#E5E7EB';
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full animate-scale-in border-2 border-black" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок с цветом недвижимости */}
        <div style={{ backgroundColor: getColorStyle(property.color) }} className="text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl animate-hammer">🔨</span>
              <div>
                <h2 className="text-xl font-bold">Аукцион</h2>
                <p className="text-sm opacity-90">{property.name}</p>
              </div>
            </div>
            {auction.initiatorId === myPlayerId && (
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-3xl font-bold transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Информация */}
        <div className="p-4 space-y-3">
          {/* Таймер и текущая ставка */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">Время:</span>
              <span className={`font-bold text-lg ${timeLeft < 10000 ? 'text-red-600' : 'text-gray-800'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Текущая ставка:</span>
              <span className="font-bold text-lg text-green-600">
                ${auction.currentBid || 0}
              </span>
            </div>
            {currentBidder && (
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <span className="text-gray-600 font-medium">Лидер:</span>
                <span className="font-bold text-blue-600">{currentBidder.name}</span>
              </div>
            )}
          </div>

          {timeLeft > 0 ? (
            <>
              {/* Ваш баланс */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Ваш баланс:</span>
                  <span className={`text-lg font-bold ${myPlayer && myPlayer.money >= bidAmount ? 'text-green-600' : 'text-red-600'}`}>
                    ${myPlayer?.money || 0}
                  </span>
                </div>
              </div>

              {/* Ввод ставки */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ваша ставка
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={auction.currentBid + 1}
                    step={10}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleBid}
                    disabled={!canBid}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      canBid
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Ставка
                  </button>
                </div>
                {myPlayer && bidAmount > myPlayer.money && (
                  <p className="text-red-500 text-sm mt-1">Недостаточно денег</p>
                )}
              </div>

              {/* Быстрые кнопки */}
              <div className="flex gap-2">
                <button
                  onClick={() => setBidAmount(auction.currentBid + 10)}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  +$10
                </button>
                <button
                  onClick={() => setBidAmount(auction.currentBid + 50)}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  +$50
                </button>
                <button
                  onClick={() => setBidAmount(auction.currentBid + 100)}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  +$100
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-800 mb-2">Аукцион завершен!</p>
              {currentBidder ? (
                <p className="text-gray-600">
                  Победитель: <span className="font-bold text-blue-600">{currentBidder.name}</span>
                  <br />
                  Сумма: <span className="font-bold text-green-600">${auction.currentBid}</span>
                </p>
              ) : (
                <p className="text-gray-600">Ставок не было</p>
              )}
            </div>
          )}

          {/* История ставок */}
          {auction.bids.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">История ставок:</h3>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {[...auction.bids].reverse().slice(0, 5).map((bid, index) => {
                  const bidder = players.find(p => p.id === bid.playerId);
                  return (
                    <div key={index} className="flex justify-between text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      <span>{bidder?.name || 'Игрок'}</span>
                      <span className="font-semibold">${bid.amount}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
