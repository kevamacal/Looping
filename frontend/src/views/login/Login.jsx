import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/redes-sociales.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email || !password) {
      return alert("Por favor, rellena todos los campos");
    }

    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    localStorage.setItem("token", data.token);

    if (data.error) {
      alert(data.error);
    } else {
      alert("Login exitoso");
      navigate("/");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center w">
      <div className="bg-gradient-to-r from-[#19fdeacf] to-[#9354ff] p-8 rounded-lg shadow-lg text-center flex items-center">
        <div className="flex flex-col justify-center items-center mr-20">
          <h2 className="text-[#0c122b] mb-5">Bienvenido a Looping</h2>
          <img src={img} alt="Red social" className="h-32 mb-4" />
        </div>

        <form
          className="flex flex-col items-center mt-4 gap-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Correo electrónico"
            className="input-animado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="input-animado"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button type="submit" onClick={login} className="button-animado">
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
