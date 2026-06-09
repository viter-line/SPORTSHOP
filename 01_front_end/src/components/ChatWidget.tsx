'use client'

import { useEffect, useState, useRef } from 'react';

// 1. Описуємо інтерфейс для пропсів, які компонент приймає ззовні
interface ChatWindowProps {
  roomId: string | number;
}

interface Message {
  sender_id: string;
  text?: string;
  message?: string;
}

export default function ChatWindow({ roomId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const ws = useRef<WebSocket | null>(null);

  // Перетворюємо roomId на рядок, щоб уникнути конфліктів із типами
  const clientId = String(roomId);

  useEffect(() => {
    if (!clientId || clientId === "undefined") return;

    // Динамічно визначаємо хост всередині ефекту, щоб уникнути зайвих рендерів
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : '192.168.0.107';
    
    // Якщо ти деплоїш бекенд на Render, заміни адресу на 'wss://твоя-адреса.onrender.com/api/v1/chat/ws'
    // Для локального тесту використовуємо поточний хост і ws://
    const BACKEND_HISTORY_URL = `http://${currentHost}:8000/api/v1/chat/ws/history/${clientId}`;
    const BACKEND_WS_URL = `ws://${currentHost}:8000/api/v1/chat/ws/${clientId}`;

    const loadHistory = async () => {
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

    // Спочатку завантажуємо історію
    loadHistory();

    // Створюємо WebSocket з'єднання
    const socket = new WebSocket(BACKEND_WS_URL);
    ws.current = socket;

    socket.onopen = () => {
      console.log(`Успішно підключено до чату. Клієнт: ${clientId}`);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Перевіряємо, що прийшов саме об'єкт повідомлення
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setMessages((prev) => {
            // Запобігаємо дублюванню (якщо таке повідомлення вже є в стейті)
            const isDuplicate = prev.some(
              (msg) => msg.sender_id === data.sender_id && (msg.text === data.text || msg.message === data.text)
            );
            return isDuplicate ? prev : [...prev, data];
          });
        }
      } catch (err) {
        console.error("Помилка обробки WebSocket повідомлення:", err);
      }
    };

    socket.onerror = (error) => {
      console.error("Помилка WebSocket з'єднання:", error);
    };

    // Cleanup функція: закриваємо сокет саме цього ефекту при розмонтуванні
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, [clientId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.warn("З'єднання не встановлено або розірвано. Спробуйте пізніше.");
      return;
    }

    const messageData = {
      recipient_id: "admin", // Кому відправляємо (адміністратору)
      text: inputValue.trim()
    };

    // Відправляємо на бекенд
    ws.current.send(JSON.stringify(messageData));
    
    // Оскільки бекенд тепер дзеркально повертає повідомлення автору, 
    // МИ НЕ додаємо його в стейт вручну тут, щоб уникнути дублів.
    // Воно прилетить в `onmessage` автоматично за мілісекунду!
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
            // Якщо sender_id збігається з clientId поточного користувача — це клієнт (пурпуровий колір)
            const isClient = msg.sender_id === clientId;
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