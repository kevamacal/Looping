import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [previousMessagesLength, setPreviousMessagesLength] = useState(0);
  const state = useLocation().state || {};
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  const checkIfAtBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const threshold = 100;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      threshold;

    return isNearBottom;
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const nearBottom = checkIfAtBottom();
      setIsAtBottom(nearBottom);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);

  useEffect(() => {
    if (messages.length > previousMessagesLength && isAtBottom) {
      setTimeout(() => {
        scrollToBottom();
      }, 10);
    }
    setPreviousMessagesLength(messages.length);
  }, [messages]);

  useEffect(() => {
    if (selectedUser && messages.length > 0 && isFirstLoad) {
      setTimeout(() => {
        scrollToBottom("auto");
        setIsFirstLoad(false);
      }, 100);
    }
  }, [selectedUser, messages, isFirstLoad]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://localhost:3001/api/users/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return alert("Error al obtener los usuarios");
      const data = await res.json();
      let usersTemp = data.users;

      if (usersTemp.length === 0) {
        const res = await fetch("http://localhost:3001/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return alert("Error al obtener los usuarios");
        const data = await res.json();
        usersTemp = data.following;
      }
      setUsers(usersTemp);
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (!selectedUser) return;

    const loadMessages = async () => {
      const res = await fetch(
        `http://localhost:3001/api/messages/${selectedUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Error al obtener los mensajes");
        return;
      }

      const data = await res.json();
      setMessages(data.messages);
    };

    loadMessages();
    setIsFirstLoad(true);
    setPreviousMessagesLength(0);

    const interval = setInterval(loadMessages, 500);
    return () => clearInterval(interval);
  }, [token, selectedUser]);

  useEffect(() => {
    const selected = state.selectedUser;
    if (!selected || users.length === 0) return;

    const exists = users.find((u) => u.id === selected);
    if (!exists) {
      const fetchUser = async () => {
        try {
          const res = await fetch(
            `http://localhost:3001/api/users/${selected}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) {
            alert("Usuario no encontrado");
            return;
          }

          const data = await res.json();

          setUsers((prevUsers) => {
            const alreadyExists = prevUsers.some((u) => u.id === data.user.id);
            if (alreadyExists) return prevUsers;
            return [...prevUsers, data.user];
          });

          setSelectedUser(data.user.id);
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
        }
      };

      fetchUser();
    } else {
      setSelectedUser(selected);
    }
  }, [state.selectedUser, users, token]);

  const sendMessage = async (message) => {
    const res = await fetch("http://localhost:3001/api/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipientId: selectedUser,
        message,
      }),
    });

    if (!res.ok) return alert("Error al enviar el mensaje");
    const data = await res.json();

    setMessages((prev) => [...prev, data.message]);
    setTimeout(() => {
      scrollToBottom();
      setIsAtBottom(true);
    }, 10);
  };

  return (
    <div className="w-full h-[80vh] grid grid-cols-12 rounded-2xl bg-gray-900 overflow-hidden">
      <div className="col-span-3 flex flex-col border-r border-gray-700 text-white overflow-y-auto">
        <h1 className="text-2xl font-bold p-4 border-b border-gray-700 text-center">
          Chats
        </h1>
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-800 transition ${
              selectedUser === user.id ? "bg-gray-800" : ""
            }`}
            onClick={() => setSelectedUser(user.id)}
          >
            <img
              src={
                user.avatar.startsWith("/uploads")
                  ? `http://localhost:3001${encodeURI(user.avatar)}`
                  : user.avatar
              }
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <span className="text-md font-medium">{user.username}</span>
          </div>
        ))}
      </div>

      <div className="col-span-9 flex flex-col h-[80vh] relative">
        {selectedUser == null ? (
          <div className="flex items-center justify-center h-[80vh] text-gray-400 text-xl">
            Selecciona un usuario para comenzar una conversación 💬
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 p-4 border-b border-gray-700 bg-gray-900">
              <img
                src={
                  users
                    .find((u) => u.id === selectedUser)
                    ?.avatar?.startsWith("/uploads")
                    ? `http://localhost:3001${encodeURI(
                        users.find((u) => u.id === selectedUser)?.avatar
                      )}`
                    : users.find((u) => u.id === selectedUser)?.avatar
                }
                alt={users.find((u) => u.id === selectedUser)?.username}
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                onClick={() => navigate(`/profile/${selectedUser}`)}
              />
              <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold text-lg inline-block">
                  {users.find((u) => u.id === selectedUser)?.username}
                </h2>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto p-6 space-y-4"
              ref={messagesContainerRef}
              style={{ maxHeight: "calc(80vh - 160px)" }}
            >
              {messages.length === 0 ? (
                <div className="text-gray-400 text-center">
                  No hay mensajes aún
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId !== selectedUser;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                          isOwn
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-gray-800 text-white rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs text-gray-300 mt-1">
                          {msg.createdAtFormatted}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {!isAtBottom && (
              <button
                onClick={() => {
                  scrollToBottom();
                  setIsAtBottom(true);
                }}
                className="absolute bottom-[15%] right-[50%] bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <span>↓</span>
                <span className="text-sm">Ir al final</span>
              </button>
            )}

            <div className="p-4 border-t border-gray-700 bg-gray-900">
              <input
                type="text"
                className="w-full p-3 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Escribe un mensaje..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim() !== "") {
                    sendMessage(e.target.value.trim());
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
