import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [hover, setHover] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3001/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setFollowing(data.isFollowing);
      } else {
        alert("Usuario no encontrado");
      }
    };

    fetchUser();
  }, [id, token]);

  const toggleFollow = async () => {
    const res = await fetch(`http://localhost:3001/api/follows/${id}`, {
      method: following ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.message) {
        setFollowing(!following);
      }
    } else {
      alert("Error al cambiar estado de seguimiento");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-900 px-6 py-10">
      <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        {user ? (
          <div className="flex flex-col items-center text-center">
            <div
              className="relative w-32 h-32 mb-6 cursor-pointer group"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={() => alert("Avatar del usuario")}
            >
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="Avatar de usuario"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md transition-transform duration-200 group-hover:scale-105"
              />
              {hover && (
                <img
                  src="https://images.icon-icons.com/685/PNG/512/user_icon-icons.com_57997.png"
                  alt="Ver perfil"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white p-1 rounded-full shadow-md"
                />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{user.username}</h1>

            <p className="text-sm text-gray-400 mb-4">
              {user.email || "Correo no disponible"}
            </p>

            <p className="text-md font-medium mb-4 italic text-gray-300 max-w-xs">
              {user.bio || "Este usuario no ha agregado una biografía."}
            </p>

            <button
              onClick={toggleFollow}
              className={`w-44 py-2 rounded-full text-lg font-semibold transition duration-300 shadow-md 
                ${
                  following
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
            >
              {following ? "Dejar de seguir" : "Seguir"}
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-400 animate-pulse">
            Cargando perfil...
          </p>
        )}
      </div>
    </div>
  );
}
