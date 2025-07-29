import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import isLoggedIn from "../../utils/isLoggedIn";
import { FaMessage, FaUser } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";
import { HiMenu, HiX } from "react-icons/hi";
import Browser from "../browser/Browser";
import { motion, AnimatePresence } from "framer-motion";

export default function Nav() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      setMobileMenuOpen(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between w-full h-16 px-4 py-2 bg-gray-800 shadow-md absolute top-0 left-0 z-50">
      <div className="flex items-center gap-4">
        <img
          src="https://logo.clearbit.com/looping.com"
          alt="Looping logo"
          className="cursor-pointer h-10"
          onClick={() => handleNavigation("/")}
        />
        <div className="font-bold text-white">Looping</div>
      </div>

      {/* Desktop navigation - exactly as original */}
      <div className="sm:flex max-sm:hidden items-center gap-4">
        {loggedIn ? (
          <>
            <Browser />
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 1.3 }}
              className="font-bold text-white cursor-pointer"
              onClick={() => navigate("/create-post")}
            >
              <CiCirclePlus className="text-white w-7 h-7" />
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

      {/* Mobile menu button */}
      <button
        className="sm:hidden text-white p-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <HiX className="w-6 h-6" />
        ) : (
          <HiMenu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile navigation menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg sm:hidden z-40"
          >
            <div className="flex flex-col p-4 space-y-4">
              {loggedIn ? (
                <>
                  {/* Mobile Browser */}
                  <div className="border-b border-gray-700 pb-4">
                    <Browser />
                  </div>

                  {/* Mobile navigation buttons */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 text-white font-bold p-3 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => handleNavigation("/create-post")}
                  >
                    <CiCirclePlus className="w-6 h-6" />
                    <span>Crear publicación</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 text-white font-bold p-3 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => handleNavigation("/messages")}
                  >
                    <FaMessage className="w-5 h-5" />
                    <span>Mensajes</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 text-white font-bold p-3 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => handleNavigation("/me")}
                  >
                    <FaUser className="w-5 h-5" />
                    <span>Mi perfil</span>
                  </motion.button>

                  <button
                    className="flex items-center gap-3 text-white font-bold p-3 rounded-lg hover:bg-red-600 transition-colors border-t border-gray-700 pt-4 mt-4"
                    onClick={() => logout()}
                  >
                    <span>Cerrar sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-white font-bold p-3 rounded-lg hover:bg-gray-700 transition-colors text-left"
                    onClick={() => handleNavigation("/login")}
                  >
                    Iniciar sesión
                  </button>
                  <button
                    className="text-white font-bold p-3 rounded-lg hover:bg-gray-700 transition-colors text-left"
                    onClick={() => handleNavigation("/sign-in")}
                  >
                    Crear cuenta
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
