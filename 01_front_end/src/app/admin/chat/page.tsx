"use client";
import { useEffect, useState, useRef } from "react";

interface Message {
  sender_id: string;
  recipient_id: string;
  text: string;
  created_at?: string;
}

export default function AdminChatPage() {
  const [clientIds, setClientIds] = useState<string[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [notifications, setNotifications] = useState<{ [clientId: string]: boolean }>({});
  
  const ws = useRef<WebSocket | null>(null);
  
  // Використовуємо динамічний хост, щоб не було проблем через Docker/локальну мережу
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const BACKEND_URL = `http://${currentHost}:8000/api/v1/chat/ws`;
  const BACKEND_WS_URL = `ws://${currentHost}:8000/api/v1/chat/ws/admin`;

  // 1. Завантажуємо список із бази
  useEffect(() => {
    fetch(`${BACKEND_URL}/admin/active-chats`)
      .then((res) => res.json())
      .then((data: { client_id: string; has_new: boolean }[]) => {
        const ids = data
          .map(item => item?.client_id)
          .filter(id => id !== undefined && id !== null && id !== "undefined");
        
        setClientIds(ids);

        const initialNotifs: { [key: string]: boolean } = {};
        data.forEach(item => {
          if (item?.has_new && item.client_id) {
            initialNotifs[item.client_id] = true;
          }
        });
        setNotifications(initialNotifs);
      })
      .catch((err) => console.error("Помилка завантаження списку чатів:", err));

    ws.current = new WebSocket(BACKEND_WS_URL);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const sender = data?.sender_id;

        if (!sender || sender === "admin" || sender === "undefined") return;

        setClientIds((prev) => {
          const cleanPrev = prev.filter(id => id && id !== "undefined");
          return cleanPrev.includes(sender) ? cleanPrev : [sender, ...cleanPrev];
        });

        setActiveChat((currentActive) => {
          if (currentActive === sender) {
            const newMsg = { ...data, created_at: new Date().toISOString() };
            setMessages((prevMsgs) => [...prevMsgs, newMsg]);
            
            // Якщо менеджер вже сидить у цьому чаті і приходить нове повідомлення — 
            // одразу шлемо запит на бекенд, щоб воно миттєво ставало прочитаним
            fetch(`${BACKEND_URL}/read/${sender}`, { method: 'PUT' })
              .catch(err => console.error("Помилка автопрочитання:", err));

          } else {
            setNotifications((prevNotifs) => ({ ...prevNotifs, [sender]: true }));
          }
          return currentActive;
        });
      } catch (err) {
        console.error("Помилка обробки WebSocket повідомлення:", err);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [BACKEND_URL, BACKEND_WS_URL]);

  // 2. Коли змінюється активний чат (клік на користувача)
  useEffect(() => {
    if (!activeChat || activeChat === "undefined") return;

    // Смикаємо бекенд, щоб позначити всі повідомлення цього клієнта як прочитані
    fetch(`${BACKEND_URL}/read/${activeChat}`, { method: 'PUT' })
      .then((res) => {
        if (res.ok) {
          // Гасимо зелений індикатор у себе на екрані
          setNotifications((prev) => {
            const updated = { ...prev };
            delete updated[activeChat];
            return updated;
          });
        }
      })
      .catch((err) => console.error("Помилка оновлення статусу прочитання:", err));

    // Завантажуємо історію листування
    fetch(`${BACKEND_URL}/history/${activeChat}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Помилка завантаження історії:", err));
  }, [activeChat, BACKEND_URL]);

  const sendReply = () => {
    if (!input.trim() || !ws.current || !activeChat) return;

    const payload = {
      recipient_id: activeChat,
      text: input
    };

    ws.current.send(JSON.stringify(payload));
    
    setMessages((prev) => [
      ...prev, 
      { sender_id: "admin", recipient_id: activeChat, text: input, created_at: new Date().toISOString() }
    ]);
    setInput("");
  };

  return (
    <div className="flex h-[80vh] border rounded-[2.5rem] overflow-hidden bg-white m-6 shadow-sm border-gray-100 text-black">
      {/* Ліва панель: Список клієнтів */}
      <div className="w-1/3 border-r bg-gray-50/50 p-6 flex flex-col">
        <h2 className="text-xl font-black uppercase tracking-tighter mb-6">Діалоги</h2>
        {clientIds.length === 0 && <p className="text-gray-400 text-sm font-medium">Немає активних звернень</p>}
        
        <div className="space-y-2 flex-1 overflow-y-auto pr-2">
          {clientIds.map((id) => {
            if (!id || id === "undefined") return null;

            const hasNewMessage = notifications[id]; 
            const isSelected = activeChat === id;

            return (
              <button
                key={`client-${id}`} 
                onClick={() => setActiveChat(id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                  isSelected 
                    ? "bg-purple-600 text-white border-purple-600 font-black shadow-md shadow-purple-100" 
                    : "bg-white border-gray-100 hover:bg-gray-50 text-gray-900"
                }`}
              >
                <span className={`truncate text-sm ${isSelected ? "font-black" : "font-bold"}`}>
                  {id}
                </span>

                {hasNewMessage && !isSelected && (
                  <span className="relative flex h-3 w-3 ml-2 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Права панель: Вікно чату */}
      <div className="w-2/3 flex flex-col p-6 bg-white">
        {activeChat ? (
          <>
            <h3 className="text-lg font-black uppercase tracking-tight mb-4 border-b border-gray-100 pb-4">
              Чат: <span className="text-purple-600 font-mono text-sm">{activeChat}</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto bg-gray-50/50 border border-gray-100 rounded-[1.5rem] p-6 mb-4 space-y-3">
              {messages.map((msg, idx) => {
                const messageKey = msg.created_at 
                  ? `msg-${msg.sender_id}-${msg.created_at}-${idx}` 
                  : `msg-${msg.sender_id}-${idx}`;

                return (
                  <div
                    key={messageKey} 
                    className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender_id === "admin" 
                        ? "bg-purple-600 text-white font-bold ml-auto rounded-tr-none shadow-sm shadow-purple-50" 
                        : "bg-white text-gray-900 border border-gray-100 font-bold rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                className="border border-gray-200 bg-gray-50/50 p-4 flex-1 rounded-full text-sm font-bold text-black focus:outline-none focus:border-purple-600 focus:bg-white transition-all placeholder-gray-400"
                placeholder="Введіть повідомлення для клієнта..."
              />
              <button 
                onClick={sendReply} 
                className="bg-purple-600 text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-sm"
              >
                Відповісти
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 border border-dashed border-gray-200 rounded-[1.5rem]">
            <span className="font-black uppercase text-[10px] tracking-widest bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Увага</span>
            <p className="text-sm font-bold">Оберіть клієнта ліворуч для початку розмови</p>
          </div>
        )}
      </div>
    </div>
  );
}