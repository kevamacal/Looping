import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import isLoggedIn from "../../utils/isLoggedIn";
import { FaMessage, FaUser } from "react-icons/fa6";
import Browser from "../browser/Browser";
import { motion } from "framer-motion";

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
      navigate("/login");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("storage"));
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
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 1.3 }}
              className="font-bold text-white cursor-pointer"
              onClick={() => navigate("/create-post")}
            >
              <CiCirclePlus className="text-white text-8xl mb-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 1.3 }}
              className="font-bold text-white cursor-pointer"
              onClick={() => navigate("/messages")}
            >
              <FaMessage className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 1.3 }}
              className="font-bold text-white cursor-pointer"
              onClick={() => navigate("/me")}
            >
              <FaUser className="w-5 h-5" />
            </motion.button>

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
