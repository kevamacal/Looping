import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import isLoggedIn from "../../utils/isLoggedIn";
import Browser from "../browser/Browser";

export default function Nav() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkLogin = async () => {
      const logged = await isLoggedIn();
      setLoggedIn(logged);
    };
    checkLogin();
  }, [token]);

  const logout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-between w-full h-16 px-4 py-2 bg-gray-800 shadow-md absolute top-0 left-0 z-50">
      <div className="flex items-center gap-4">
        <img
          src="https://logo.clearbit.com/looping.com"
          alt="Looping logo"
          className="cursor-pointer h-10"
          onClick={() => navigate("/")}
        />
        <div className="font-bold text-white">Looping</div>
      </div>

      <div className="flex items-center gap-4">
        {loggedIn ? (
          <>
            <Browser />
            <button
              className="font-bold text-white cursor-pointer"
              onClick={() => navigate("/me")}
            >
              Mi perfil
            </button>

            <button
              className="font-bold text-white cursor-pointer"
              onClick={() => logout()}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <button
              className="font-bold text-white cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>
            <button
              className="font-bold text-white cursor-pointer"
              onClick={() => navigate("/sign-in")}
            >
              Crear cuenta
            </button>
          </>
        )}
      </div>
    </div>
  );
}
