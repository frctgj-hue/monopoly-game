import type { TradeOffer, Player, Property } from '../types/game.types';

interface TradeNotificationProps {
  trade: TradeOffer;
  players: Player[];
  board: Property[];
  myPlayerId: string;
  onAccept: (tradeId: string) => void;
  onReject: (tradeId: string) => void;
}

export default function TradeNotification({
  trade,
  players,
  board,
  myPlayerId,
  onAccept,
  onReject,
}: TradeNotificationProps) {
  const fromPlayer = players.find(p => p.id === trade.fromPlayerId);
  const toPlayer = players.find(p => p.id === trade.toPlayerId);

  const isForMe = trade.toPlayerId === myPlayerId;
  const isFromMe = trade.fromPlayerId === myPlayerId;

  if (trade.status !== 'pending') return null;
  if (!isForMe && !isFromMe) return null;

  const offeredProps = trade.offeredProperties.map(id => board[id]);
  const requestedProps = trade.requestedProperties.map(id => board[id]);

  return (
    <div className="fixed top-20 right-4 z-40 theme-panel p-4 max-w-md animate-slide-in-right">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-bounce">🤝</span>
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)]">
              {isForMe ? 'Предложение обмена' : 'Ваше предложение'}
            </h3>
            <p className="text-sm theme-text-muted">
              {isForMe ? `От: ${fromPlayer?.name}` : `Для: ${toPlayer?.name}`}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {/* Что предлагают */}
        <div className="theme-panel-inset p-3 border-l-4 border-[var(--color-accent-blue)]">
          <p className="text-xs font-semibold text-[var(--color-accent-blue)] mb-2">
            {isForMe ? 'Вам предлагают:' : 'Вы предлагаете:'}
          </p>
          {trade.offeredMoney > 0 && (
            <div className="text-sm text-[var(--color-text-primary)] mb-1">💰 ${trade.offeredMoney}</div>
          )}
          {offeredProps.length > 0 && (
            <div className="space-y-1">
              {offeredProps.map(prop => (
                <div key={prop.id} className="text-sm text-[var(--color-text-primary)] flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: prop.color === 'special' ? '#888' : prop.color }}
                  />
                  {prop.name}
                </div>
              ))}
            </div>
          )}
          {trade.offeredMoney === 0 && offeredProps.length === 0 && (
            <p className="text-sm theme-text-muted">Ничего</p>
          )}
        </div>

        {/* Что запрашивают */}
        <div className="theme-panel-inset p-3 border-l-4 border-[var(--color-accent-green)]">
          <p className="text-xs font-semibold text-[var(--color-accent-green)] mb-2">
            {isForMe ? 'За:' : 'Вы запрашиваете:'}
          </p>
          {trade.requestedMoney > 0 && (
            <div className="text-sm text-[var(--color-text-primary)] mb-1">💰 ${trade.requestedMoney}</div>
          )}
          {requestedProps.length > 0 && (
            <div className="space-y-1">
              {requestedProps.map(prop => (
                <div key={prop.id} className="text-sm text-[var(--color-text-primary)] flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: prop.color === 'special' ? '#888' : prop.color }}
                  />
                  {prop.name}
                </div>
              ))}
            </div>
          )}
          {trade.requestedMoney === 0 && requestedProps.length === 0 && (
            <p className="text-sm theme-text-muted">Ничего</p>
          )}
        </div>
      </div>

      {isForMe && (
        <div className="flex gap-2">
          <button
            onClick={() => onReject(trade.id)}
            className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 text-white"
            style={{ background: 'var(--color-accent-red)' }}
          >
            Отклонить
          </button>
          <button
            onClick={() => onAccept(trade.id)}
            className="flex-1 px-4 py-2 theme-btn theme-btn-secondary rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95"
          >
            Принять
          </button>
        </div>
      )}

      {isFromMe && (
        <div className="text-center">
          <p className="text-sm theme-text-muted mb-2 animate-pulse">Ожидание ответа...</p>
        </div>
      )}
    </div>
  );
}