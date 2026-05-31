'use client'

import { useEffect, useState, useRef } from 'react';

// 1. Описуємо інтерфейс для пропсів, які компонент приймає ззовні (з page.tsx)
interface ChatWindowProps {
  roomId: string | number;
}

interface Message {
  sender_id: string;
  text?: string;
  message?: string;
}

// 2. Змінюємо назву функції на ChatWindow, щоб вона збігалася з page.tsx, 
// та приймаємо деструктуризований roomId
export default function ChatWindow({ roomId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const ws = useRef<WebSocket | null>(null);

  // Перетворюємо roomId на рядок, щоб уникнути конфліктів із типами
  const clientId = String(roomId);

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '192.168.0.107';
  
  // Маршрути відповідно до конфігурації твого FastAPI роутера
  const BACKEND_HISTORY_URL = `http://${currentHost}:8000/api/v1/chat/ws/history/${clientId}`;
  const BACKEND_WS_URL = `ws://${currentHost}:8000/api/v1/chat/ws/${clientId}`;

  const loadHistory = async () => {
    if (!clientId) return;
    try {
      const res = await fetch(BACKEND_HISTORY_URL);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error("Не вдалося завантажити історію чату:", err);
    }
  };

  useEffect(() => {
    if (!clientId || clientId === "undefined") return;

    loadHistory();

    ws.current = new WebSocket(BACKEND_WS_URL);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setMessages((prev) => [...prev, data]);
        }
      } catch (err) {
        console.error("Помилка обробки WebSocket повідомлення:", err);
      }
    };

    ws.current.onerror = (error) => {
      console.error("Помилка WebSocket з'єднання:", error);
    };

    return () => {
      ws.current?.close();
    };
  }, [clientId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.warn("З'єднання не встановлено. Спробуйте пізніше.");
      return;
    }

    const messageData = {
      recipient_id: "admin", // Бекенд чекає recipient_id
      text: inputValue.trim()
    };

    ws.current.send(JSON.stringify(messageData));
    
    // Відображаємо повідомлення у себе на екрані
    setMessages((prev) => [...prev, { sender_id: clientId, text: inputValue.trim() }]);
    setInputValue('');
  };

  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 p-4 z-50 text-black">
      <h3 className="font-black uppercase tracking-tight text-sm border-b pb-2 mb-2 text-gray-950">
        Чат з підтримкою
      </h3>
      
      <div className="h-48 overflow-y-auto mb-3 p-2 bg-gray-50/50 rounded-xl space-y-2 border border-gray-50">
        {safeMessages.length === 0 ? (
          <div className="text-center text-xs text-gray-400 font-bold pt-10">
            Немає повідомлень. Напишіть першим!
          </div>
        ) : (
          safeMessages.map((msg, idx) => {
            const isClient = msg.sender_id !== "admin";
            const messageText = msg.text || msg.message || ""; 

            return (
              <div 
                key={idx} 
                className={`p-3 text-xs font-bold rounded-xl max-w-[85%] shadow-sm ${
                  !isClient 
                    ? "bg-white text-gray-950 border border-gray-100 mr-auto text-left" 
                    : "bg-purple-600 text-white ml-auto text-right"
                }`}
              >
                {messageText}
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Напишіть повідомлення..."
          className="flex-1 bg-gray-50 border border-transparent rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-purple-500 focus:bg-white transition-all placeholder-gray-400"
        />
        <button 
          type="submit" 
          className="bg-gray-950 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-purple-600 transition-colors"
        >
          Гайда
        </button>
      </form>
    </div>
  );
}