import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Browser() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const randomUsers = async () => {
    const response = await fetch("http://localhost:3001/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      setUsers(data.users.slice(0, 10));
    } catch (error) {
      console.error("Error al parsear JSON:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <div className="flex items-center bg-gray-700 rounded-lg p-2 w-80">
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-full"
          onFocus={randomUsers}
          onBlur={() => setTimeout(() => setUsers([]), 200)}
          onChange={(e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 0) {
              const filteredUsers = users.filter((user) =>
                user.username.toLowerCase().includes(query)
              );
              setUsers(filteredUsers);
            } else {
              randomUsers();
            }
          }}
        />
        <button className="ml-2 text-white hover:text-gray-300 transition-colors">
          <FaSearch className="w-4 h-4" />
        </button>
      </div>

      {users.length > 0 && (
        <div className="absolute top-full mt-1 w-80 max-h-60 overflow-auto bg-gray-800 rounded-md shadow-lg z-10">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center px-2 py-1 hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              <img
                src={`${
                  !user.avatar.startsWith("/uploads")
                    ? user.avatar
                    : `http://localhost:3001${encodeURI(user.avatar)}`
                }`}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-2 text-white">{user.username}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
