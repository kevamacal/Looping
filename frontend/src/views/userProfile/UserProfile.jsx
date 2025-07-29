import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostsList from "../../components/PostsList";

export default function UserProfile() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Usuario no encontrado");
        const data = await res.json();

        setUser(data.user);

        setFollowing(data.isFollowing);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchUser();
  }, [id, token]);

  const toggleFollow = async () => {
    const res = await fetch(`${apiUrl}/api/follows/${id}`, {
      method: following ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.message) setFollowing(!following);
    } else {
      alert("Error al cambiar estado de seguimiento");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 px-6 py-12 rounded-2xl w-full max-w-3xl mx-auto mt-10">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full">
        {user ? (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold text-center mb-8">
              {user.username}
            </h1>

            <div className="relative w-32 h-32 mb-6 cursor-pointer group">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-all duration-200"
              />
            </div>

            <p className="text-md font-medium mb-2">
              <span className="text-gray-400">Correo:</span>{" "}
              {user.email || "No disponible"}
            </p>
            <p className="text-md font-medium mt-2 mb-6 max-w-md">
              <span className="text-gray-400">Biografía:</span>{" "}
              {user.bio || "Este usuario no ha agregado una biografía."}
            </p>

            <div className="flex gap-4 ">
              <button
                onClick={toggleFollow}
                className={`w-44 py-2 rounded-full text-lg cursor-pointer font-semibold transition duration-300 shadow-md ${
                  following
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-fuchsia-600 hover:bg-fuchsia-700"
                }`}
              >
                {following ? "Dejar de seguir" : "Seguir"}
              </button>
              <button
                className="w-44 py-2 rounded-full text-lg cursor-pointer font-semibold transition duration-300 shadow-md bg-gray-600 hover:bg-gray-700"
                onClick={() =>
                  navigate(`/messages`, { state: { selectedUser: user.id } })
                }
              >
                Enviar mensaje
              </button>
            </div>

            <div className="w-full h-1 bg-gray-600 rounded-full my-6"></div>

            <PostsList posts={user.posts} />
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
