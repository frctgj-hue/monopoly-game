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
        <label className="theme-text-label block mb-2">
          Торговать с:
        </label>
        <select
          value={selectedPlayer}
          onChange={(e) => {
            setSelectedPlayer(e.target.value);
            setRequestedProperties([]);
          }}
          className="theme-input"
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
          <div className="theme-panel-inset p-4 border-l-4 border-[var(--color-accent-blue)]">
            <h3 className="text-lg font-bold text-[var(--color-accent-blue)] mb-4">Вы предлагаете</h3>

            {/* Ваши деньги */}
            <div className="mb-4">
              <label className="theme-text-label block mb-2">
                Деньги (у вас: ${myPlayer?.money || 0})
              </label>
              <input
                type="number"
                value={offeredMoney}
                onChange={(e) => setOfferedMoney(Math.max(0, Math.min(myPlayer?.money || 0, Number(e.target.value))))}
                min={0}
                max={myPlayer?.money || 0}
                className="theme-input"
              />
            </div>

            {/* Ваша недвижимость */}
            <div>
              <label className="theme-text-label block mb-2">
                Недвижимость
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {myProperties.length === 0 ? (
                  <p className="theme-text-muted text-sm">Нет недвижимости</p>
                ) : (
                  myProperties.map(prop => (
                    <label
                      key={prop.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        offeredProperties.includes(prop.id)
                          ? 'theme-panel border-2 border-[var(--color-accent-blue)]'
                          : 'theme-panel-inset border-2 border-transparent hover:border-[var(--color-accent-blue)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={offeredProperties.includes(prop.id)}
                        onChange={() => toggleOfferedProperty(prop.id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-[var(--color-text-primary)]">{prop.name}</div>
                        <div className="text-xs theme-text-muted">
                          ${prop.price} • {prop.houses > 0 ? `${prop.houses} ${prop.houses === 5 ? 'отель' : 'дом(а)'}` : 'Без построек'}
                        </div>
                      </div>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: prop.color === 'special' ? '#888' : prop.color }}
                      />
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Вы запрашиваете */}
          <div className="theme-panel-inset p-4 border-l-4 border-[var(--color-accent-green)]">
            <h3 className="text-lg font-bold text-[var(--color-accent-green)] mb-4">Вы запрашиваете</h3>

            {/* Их деньги */}
            <div className="mb-4">
              <label className="theme-text-label block mb-2">
                Деньги (у них: ${otherPlayer?.money || 0})
              </label>
              <input
                type="number"
                value={requestedMoney}
                onChange={(e) => setRequestedMoney(Math.max(0, Math.min(otherPlayer?.money || 0, Number(e.target.value))))}
                min={0}
                max={otherPlayer?.money || 0}
                className="theme-input"
              />
            </div>

            {/* Их недвижимость */}
            <div>
              <label className="theme-text-label block mb-2">
                Недвижимость
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {theirProperties.length === 0 ? (
                  <p className="theme-text-muted text-sm">Нет недвижимости</p>
                ) : (
                  theirProperties.map(prop => (
                    <label
                      key={prop.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        requestedProperties.includes(prop.id)
                          ? 'theme-panel border-2 border-[var(--color-accent-green)]'
                          : 'theme-panel-inset border-2 border-transparent hover:border-[var(--color-accent-green)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={requestedProperties.includes(prop.id)}
                        onChange={() => toggleRequestedProperty(prop.id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-[var(--color-text-primary)]">{prop.name}</div>
                        <div className="text-xs theme-text-muted">
                          ${prop.price} • {prop.houses > 0 ? `${prop.houses} ${prop.houses === 5 ? 'отель' : 'дом(а)'}` : 'Без построек'}
                        </div>
                      </div>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: prop.color === 'special' ? '#888' : prop.color }}
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
          className="flex-1 px-6 py-3 theme-btn theme-btn-ghost transition-all transform hover:scale-105 active:scale-95"
        >
          Отмена
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all transform ${
            canSubmit
              ? 'theme-btn theme-btn-primary hover:scale-105 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-30'
          }`}
        >
          Предложить обмен
        </button>
      </div>
    </div>
  );
}