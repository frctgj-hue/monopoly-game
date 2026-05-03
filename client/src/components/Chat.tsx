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
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',
  };

  return (
    <div className={`fixed bottom-4 right-4 z-40 transition-all duration-300 ${isExpanded ? 'w-80 h-96' : 'w-80 h-14'}`}>
      {/* Заголовок чата */}
      <div
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-t-lg cursor-pointer flex items-center justify-between shadow-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <span className="font-bold">Чат</span>
          {messages.length > 0 && !isExpanded && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-pulse">
              {messages.length}
            </span>
          )}
        </div>
        <span className="text-sm">{isExpanded ? '▼' : '▲'}</span>
      </div>

      {/* Тело чата */}
      {isExpanded && (
        <div className="bg-white rounded-b-lg shadow-xl flex flex-col h-[calc(100%-3rem)]">
          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm mt-8">
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
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {!isMyMessage && (
                        <div className="flex items-center gap-1 mb-1">
                          <div
                            className={`w-2 h-2 rounded-full ${colorClasses[msg.playerColor]}`}
                          ></div>
                          <span className="text-xs font-bold">{msg.playerName}</span>
                        </div>
                      )}
                      <div className="text-sm break-words">{msg.message}</div>
                      <div className={`text-[10px] mt-1 ${isMyMessage ? 'text-blue-100' : 'text-gray-400'}`}>
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
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold text-sm hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
