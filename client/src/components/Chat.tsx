import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  playerColor: string;
  message: string;
  timestamp: number;
}

interface ChatProps {
  messages: ChatMessage[];
  myPlayerId: string;
  onSendMessage: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({ messages, myPlayerId, onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const colorClasses: { [key: string]: string } = {
    red: 'bg-[#DC143C]',
    blue: 'bg-[#0078D7]',
    green: 'bg-[#1FB25A]',
    yellow: 'bg-[#FEF200]',
    gray: 'bg-gray-500',
  };

  return (
    <div className={`fixed bottom-4 right-4 z-40 transition-all duration-300 ${isExpanded ? 'w-80 h-96' : 'w-80 h-14'}`}>
      {/* Заголовок чата */}
      <div
        className="theme-panel-inset px-4 py-3 rounded-t-lg cursor-pointer flex items-center justify-between border-b-0"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <span className="font-bold text-[var(--color-text-primary)]">Чат</span>
          {messages.length > 0 && !isExpanded && (
            <span className="theme-toast error text-xs rounded-full px-2 py-0.5 animate-pulse">
              {messages.length}
            </span>
          )}
        </div>
        <span className="text-sm text-[var(--color-text-gold)]">{isExpanded ? '▼' : '▲'}</span>
      </div>

      {/* Тело чата */}
      {isExpanded && (
        <div className="theme-panel rounded-b-lg shadow-xl flex flex-col h-[calc(100%-3rem)]">
          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ background: 'var(--color-bg-tertiary)' }}>
            {messages.length === 0 ? (
              <div className="text-center theme-text-muted text-sm mt-8">
                Пока нет сообщений
              </div>
            ) : (
              messages.map((msg) => {
                const isMyMessage = msg.playerId === myPlayerId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        isMyMessage
                          ? 'theme-btn theme-btn-secondary'
                          : 'theme-panel-inset'
                      }`}
                    >
                      {!isMyMessage && (
                        <div className="flex items-center gap-1 mb-1">
                          <div
                            className={`w-2 h-2 rounded-full ${colorClasses[msg.playerColor]}`}
                          ></div>
                          <span className="text-xs font-bold text-[var(--color-text-primary)]">{msg.playerName}</span>
                        </div>
                      )}
                      <div className="text-sm break-words text-[var(--color-text-primary)]">{msg.message}</div>
                      <div className={`text-[10px] mt-1 ${isMyMessage ? 'opacity-80' : 'theme-text-muted'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Форма ввода */}
          <form onSubmit={handleSubmit} className="border-t border-[var(--color-border-primary)] p-3" style={{ background: 'var(--color-bg-secondary)' }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="flex-1 px-3 py-2 theme-input text-sm"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="theme-btn theme-btn-primary px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;