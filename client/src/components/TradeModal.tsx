import { useState } from 'react';
import type { Player, Property } from '../types/game.types';

interface TradeModalProps {
  players: Player[];
  board: Property[];
  myPlayerId: string;
  onCreateTrade: (
    toPlayerId: string,
    offeredProperties: number[],
    offeredMoney: number,
    requestedProperties: number[],
    requestedMoney: number
  ) => void;
  onClose: () => void;
}

export default function TradeModal({
  players,
  board,
  myPlayerId,
  onCreateTrade,
  onClose,
}: TradeModalProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [offeredProperties, setOfferedProperties] = useState<number[]>([]);
  const [offeredMoney, setOfferedMoney] = useState(0);
  const [requestedProperties, setRequestedProperties] = useState<number[]>([]);
  const [requestedMoney, setRequestedMoney] = useState(0);

  const myPlayer = players.find(p => p.id === myPlayerId);
  const otherPlayer = players.find(p => p.id === selectedPlayer);
  const otherPlayers = players.filter(p => p.id !== myPlayerId && !p.isBankrupt);

  const myProperties = myPlayer?.properties.map(id => board[id]).filter(p => p.type !== 'special') || [];
  const theirProperties = otherPlayer?.properties.map(id => board[id]).filter(p => p.type !== 'special') || [];

  const toggleOfferedProperty = (propId: number) => {
    setOfferedProperties(prev =>
      prev.includes(propId) ? prev.filter(id => id !== propId) : [...prev, propId]
    );
  };

  const toggleRequestedProperty = (propId: number) => {
    setRequestedProperties(prev =>
      prev.includes(propId) ? prev.filter(id => id !== propId) : [...prev, propId]
    );
  };

  const handleSubmit = () => {
    if (!selectedPlayer) return;
    if (offeredProperties.length === 0 && offeredMoney === 0 && requestedProperties.length === 0 && requestedMoney === 0) {
      return;
    }

    onCreateTrade(selectedPlayer, offeredProperties, offeredMoney, requestedProperties, requestedMoney);
    onClose();
  };

  const canSubmit = selectedPlayer && (offeredProperties.length > 0 || offeredMoney > 0 || requestedProperties.length > 0 || requestedMoney > 0);

  return (
    <div className="space-y-6">
      {/* Выбор игрока */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Торговать с:
        </label>
        <select
          value={selectedPlayer}
          onChange={(e) => {
            setSelectedPlayer(e.target.value);
            setRequestedProperties([]);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Выберите игрока</option>
          {otherPlayers.map(player => (
            <option key={player.id} value={player.id}>
              {player.name} (${player.money})
            </option>
          ))}
        </select>
      </div>

      {selectedPlayer && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Ваше предложение */}
          <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50">
            <h3 className="text-lg font-bold text-blue-800 mb-4">Вы предлагаете</h3>

            {/* Ваши деньги */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Деньги (у вас: ${myPlayer?.money || 0})
              </label>
              <input
                type="number"
                value={offeredMoney}
                onChange={(e) => setOfferedMoney(Math.max(0, Math.min(myPlayer?.money || 0, Number(e.target.value))))}
                min={0}
                max={myPlayer?.money || 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Ваша недвижимость */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Недвижимость
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {myProperties.length === 0 ? (
                  <p className="text-gray-500 text-sm">Нет недвижимости</p>
                ) : (
                  myProperties.map(prop => (
                    <label
                      key={prop.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                        offeredProperties.includes(prop.id)
                          ? 'bg-blue-200 border-2 border-blue-400 animate-trade-shake'
                          : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={offeredProperties.includes(prop.id)}
                        onChange={() => toggleOfferedProperty(prop.id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{prop.name}</div>
                        <div className="text-xs text-gray-600">
                          ${prop.price} • {prop.houses > 0 ? `${prop.houses} ${prop.houses === 5 ? 'отель' : 'дом(а)'}` : 'Без построек'}
                        </div>
                      </div>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: prop.color === 'special' ? '#gray' : prop.color }}
                      />
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Вы запрашиваете */}
          <div className="border-2 border-green-200 rounded-xl p-4 bg-green-50">
            <h3 className="text-lg font-bold text-green-800 mb-4">Вы запрашиваете</h3>

            {/* Их деньги */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Деньги (у них: ${otherPlayer?.money || 0})
              </label>
              <input
                type="number"
                value={requestedMoney}
                onChange={(e) => setRequestedMoney(Math.max(0, Math.min(otherPlayer?.money || 0, Number(e.target.value))))}
                min={0}
                max={otherPlayer?.money || 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Их недвижимость */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Недвижимость
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {theirProperties.length === 0 ? (
                  <p className="text-gray-500 text-sm">Нет недвижимости</p>
                ) : (
                  theirProperties.map(prop => (
                    <label
                      key={prop.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                        requestedProperties.includes(prop.id)
                          ? 'bg-green-200 border-2 border-green-400 animate-trade-shake'
                          : 'bg-white border-2 border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={requestedProperties.includes(prop.id)}
                        onChange={() => toggleRequestedProperty(prop.id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{prop.name}</div>
                        <div className="text-xs text-gray-600">
                          ${prop.price} • {prop.houses > 0 ? `${prop.houses} ${prop.houses === 5 ? 'отель' : 'дом(а)'}` : 'Без построек'}
                        </div>
                      </div>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: prop.color === 'special' ? '#gray' : prop.color }}
                      />
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95"
        >
          Отмена
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all transform ${
            canSubmit
              ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Предложить обмен
        </button>
      </div>
    </div>
  );
}
