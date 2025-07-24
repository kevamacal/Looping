import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [hover, setHover] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:3001/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return alert("Error al obtener el perfil");

      const data = await res.json();
      setUser(data.user);
      setFollowers(data.followers);
      setFollowing(data.following);
    };

    fetchUser();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 px-6 py-12 rounded-2xl w-full max-w-3xl mx-auto">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Mi perfil</h1>
        {user ? (
          <div className="flex flex-col items-center text-center">
            <div
              className="relative w-32 h-32 mb-6 cursor-pointer group"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <img
                src={user.avatar}
                alt="Foto de perfil"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-all duration-200"
              />
              {hover && (
                <img
                  src="https://images.icon-icons.com/685/PNG/512/edit_icon-icons.com_61193.png"
                  alt="Editar"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white p-1 rounded-full shadow-md"
                />
              )}
            </div>
            <p className="text-lg font-semibold mb-2">
              <span className="text-gray-400">Usuario:</span> {user.username}
            </p>
            <div className="flex items-center gap-6 mb-2">
              <p
                className="text-md font-medium cursor-pointer"
                onClick={() =>
                  navigate(`/followers/${user.id}`, {
                    state: { users: followers, type: "followers" },
                  })
                }
              >
                <span className="text-gray-400">Seguidores:</span>{" "}
                {followers.length}
              </p>
              <p
                className="text-md font-medium cursor-pointer"
                onClick={() =>
                  navigate(`/following/${user.id}`, {
                    state: { users: following, type: "following" },
                  })
                }
              >
                <span className="text-gray-400">Seguidos:</span>{" "}
                {following.length}
              </p>
            </div>
            <p className="text-md font-medium">
              <span className="text-gray-400">Correo:</span> {user.email}
            </p>
            <p className="text-md font-medium mt-4">
              <span className="text-gray-400">Biografía:</span> {user.bio}
            </p>
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
