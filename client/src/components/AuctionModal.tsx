import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faTimes, faClock } from '@fortawesome/free-solid-svg-icons';
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
    <div>
      <div className="bg-white rounded-lg shadow-2xl w-full border-4 border-black" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок с цветом недвижимости */}
        <div style={{ backgroundColor: getColorStyle(property.color) }} className="text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faGavel} className="text-3xl" />
              <div>
                <h2 className="text-xl font-bold uppercase">Аукцион</h2>
                <p className="text-sm opacity-90">{property.name}</p>
              </div>
            </div>
            {auction.initiatorId === myPlayerId && (
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-3xl" />
              </button>
            )}
          </div>
        </div>

        {/* Информация */}
        <div className="p-4 space-y-3">
          {/* Таймер и текущая ставка */}
          <div className="bg-gray-100 border-2 border-gray-300 p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-bold uppercase flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} /> Время:
              </span>
              <span className={`font-bold text-lg ${timeLeft < 10000 ? 'text-red-600' : 'text-gray-800'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-bold uppercase">Текущая ставка:</span>
              <span className="font-bold text-lg text-gray-900">
                ${auction.currentBid || 0}
              </span>
            </div>
            {currentBidder && (
              <div className="flex justify-between items-center mt-2 pt-2 border-t-2 border-gray-300">
                <span className="text-gray-700 font-bold uppercase">Лидер:</span>
                <span className="font-bold text-gray-900">{currentBidder.name}</span>
              </div>
            )}
          </div>

          {timeLeft > 0 ? (
            <>
              {/* Ваш баланс */}
              <div className="bg-gray-100 border-2 border-gray-400 p-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-bold uppercase">Ваш баланс:</span>
                  <span className={`text-lg font-bold ${myPlayer && myPlayer.money >= bidAmount ? 'text-gray-900' : 'text-red-600'}`}>
                    ${myPlayer?.money || 0}
                  </span>
                </div>
              </div>

              {/* Ввод ставки */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                  Ваша ставка
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={auction.currentBid + 1}
                    step={10}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent font-bold"
                  />
                  <button
                    onClick={handleBid}
                    disabled={!canBid}
                    className={`px-4 py-2 rounded-lg font-bold transition-all uppercase ${
                      canBid
                        ? 'text-white shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    style={canBid ? { backgroundColor: '#2d8659' } : {}}
                  >
                    Ставка
                  </button>
                </div>
                {myPlayer && bidAmount > myPlayer.money && (
                  <p className="text-red-600 text-sm mt-1 font-bold">Недостаточно денег</p>
                )}
              </div>

              {/* Быстрые кнопки */}
              <div className="flex gap-2">
                <button
                  onClick={() => setBidAmount(auction.currentBid + 10)}
                  className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 border-2 border-gray-300 text-sm font-bold transition-colors uppercase"
                >
                  +$10
                </button>
                <button
                  onClick={() => setBidAmount(auction.currentBid + 50)}
                  className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 border-2 border-gray-300 text-sm font-bold transition-colors uppercase"
                >
                  +$50
                </button>
                <button
                  onClick={() => setBidAmount(auction.currentBid + 100)}
                  className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 border-2 border-gray-300 text-sm font-bold transition-colors uppercase"
                >
                  +$100
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4 bg-gray-100 border-2 border-gray-300">
              <p className="text-lg font-bold text-gray-800 mb-2 uppercase">Аукцион завершен!</p>
              {currentBidder ? (
                <p className="text-gray-700 font-medium">
                  Победитель: <span className="font-bold text-gray-900">{currentBidder.name}</span>
                  <br />
                  Сумма: <span className="font-bold text-gray-900">${auction.currentBid}</span>
                </p>
              ) : (
                <p className="text-gray-700 font-medium">Ставок не было</p>
              )}
            </div>
          )}

          {/* История ставок */}
          {auction.bids.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase">История ставок:</h3>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {[...auction.bids].reverse().slice(0, 5).map((bid, index) => {
                  const bidder = players.find(p => p.id === bid.playerId);
                  return (
                    <div key={index} className="flex justify-between text-sm text-gray-700 bg-gray-100 border border-gray-300 px-2 py-1 font-medium">
                      <span>{bidder?.name || 'Игрок'}</span>
                      <span className="font-bold">${bid.amount}</span>
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
