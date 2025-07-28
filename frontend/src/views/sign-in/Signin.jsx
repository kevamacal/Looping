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
    <div className="w-3/4 flex items-center justify-center bg-gray-950 px-4 py-10 rounded-2xl">
      <div className="flex flex-col md:flex-row items-center gap-10 bg-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-4xl">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-white mb-4">
            Crear tu cuenta
          </h2>
          <img
            src={img}
            alt="Red social"
            className="h-32 mx-auto md:mx-0 rounded-xl"
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
            className="w-full outline-0 px-4 py-2 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-fuchsia-500 transition-all duration-200 ease-in-out"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-0 px-4 py-2 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-fuchsia-500 transition-all duration-200 ease-in-out"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full outline-0 px-4 py-2 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-fuchsia-500 transition-all duration-200 ease-in-out"
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
