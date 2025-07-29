import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

export default function EditProfile() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const state = useLocation().state;
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    if (state?.user) {
      setFormData({
        username: state.user.username || "",
        email: state.user.email || "",
        bio: state.user.bio || "",
      });
    }
  }, [state]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();

    const res = await fetch(`${apiUrl}/api/auth/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      navigate("/me");
    } else {
      alert("Error al actualizar el perfil");
    }
  };

  return (
    <div className="flex flex-center flex-col items-center justify-center bg-gray-900 text-white p-8 rounded-2xl shadow-lg w-9/10 md:w-1/2 lg:w-1/3">
      <h1 className="text-3xl font-bold text-white mb-6">Editar Perfil</h1>
      <form
        onSubmit={handleEditProfile}
        className="bg-gray-800 w-full p-6 rounded-lg shadow-md flex flex-col space-y-4"
      >
        <div className="flex flex-col">
          <label htmlFor="username" className="text-gray-400">
            Nombre de usuario
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="border-2 border-gray-600 rounded-lg p-2"
            placeholder={state?.user?.username || "Escribe tu nombre..."}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-gray-400">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="border-2 border-gray-600 rounded-lg p-2"
            placeholder={state?.user?.email || "Escribe tu correo..."}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="bio" className="text-gray-400">
            Biografía
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={handleChange}
            className="border-2 border-gray-600 rounded-lg p-2"
            placeholder={state?.user?.bio || "Escribe algo sobre ti..."}
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="w-48 py-2 rounded-full text-lg font-semibold bg-purple-600 hover:bg-purple-700 transition duration-300 shadow-md"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => navigate("/me")}
            className="w-48 py-2 rounded-full text-lg font-semibold bg-gray-600 hover:bg-gray-700 transition duration-300 shadow-md"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
