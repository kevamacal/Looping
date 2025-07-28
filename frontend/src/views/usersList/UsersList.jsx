import { useLocation, useNavigate } from "react-router-dom";

export default function UsersList() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { state } = useLocation();
  const users = state?.users || [];
  const type = state?.type || "usuarios";
  const imageType = state?.imageType || 0;
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center bg-gray-900 px-6 py-12 text-white w-full max-w-3xl mx-auto rounded-2xl">
      <h1 className="text-2xl font-bold mb-8">
        {type === "followers" ? "Seguidores" : "Siguiendo"}
      </h1>

      {users.length === 0 ? (
        <p className="text-gray-400">No hay usuarios para mostrar.</p>
      ) : (
        <div className="w-full space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center bg-gray-800 p-4 rounded-xl shadow hover:bg-gray-700 transition cursor-pointer"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              <img
                src={`${
                  imageType == 0
                    ? user.avatar
                    : `${apiUrl}${encodeURI(user.avatar)}`
                }`}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border border-white"
              />
              <div className="ml-4">
                <p className="text-lg font-semibold">{user.username}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
