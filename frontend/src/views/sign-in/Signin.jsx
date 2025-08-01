import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/redes-sociales.jpg";

export default function Register() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signin = async () => {
    if (!username || !email || !password) {
      return alert("Por favor, rellena todos los campos");
    }

    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("Registro exitoso");
      navigate("/");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-900 p-6 md:p-10 rounded-2xl shadow-2xl">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Crear tu cuenta
          </h2>
          <img
            src={img}
            alt="Red social"
            className="h-28 md:h-32 mx-auto md:mx-0 rounded-xl"
          />
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full outline-none px-4 py-2 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-fuchsia-500 transition"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none px-4 py-2 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-fuchsia-500 transition"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full outline-none px-4 py-2 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-fuchsia-500 transition"
          />
          <button
            type="button"
            onClick={signin}
            className="w-full py-2 rounded-lg bg-fuchsia-600 text-white font-semibold hover:bg-fuchsia-700 hover:scale-105 transition"
          >
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  );
}
