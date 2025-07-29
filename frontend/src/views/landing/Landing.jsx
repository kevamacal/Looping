import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import isLoggedIn from "../../utils/isLoggedIn";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Landing() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loggedIn, setLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      const result = await isLoggedIn();
      setLoggedIn(result);
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${apiUrl}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts(data.posts);
    };

    if (loggedIn && token) {
      fetchPosts();
    }
  }, [loggedIn, token]);

  const toggleLike = async (postId, isLiked) => {
    const method = isLiked ? "DELETE" : "POST";
    const res = await fetch(`${apiUrl}/api/likes`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId }),
    });

    if (res.ok) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, isLiked: !isLiked } : post
        )
      );
    } else {
      alert("Error al cambiar estado de like");
    }
  };

  return (
    <div className="px-4 pb-10">
      {loggedIn ? (
        <div className="w-full max-w-6xl mx-auto mt-20">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-gray-800 rounded-xl shadow-lg">
              <CiCirclePlus className="text-white text-6xl mb-4" />
              <p className="text-white text-xl font-medium text-center">
                No hay publicaciones todavía
              </p>
              <p className="text-gray-400 text-sm mt-2 text-center">
                ¡Sé el primero en compartir algo!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group"
                >
                  <img
                    src={`${apiUrl}${encodeURI(post.image)}`}
                    onClick={() => navigate(`/post/${post.id}`)}
                    alt="Imagen del post"
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="flex absolute bottom-0 left-0 right-0 bg-black/60 text-white px-4 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col">
                      <p className="font-semibold">{post.author.username}</p>
                      {post.content && (
                        <p className="text-xs text-gray-300 truncate max-w-[80%]">
                          {post.content}
                        </p>
                      )}
                    </div>

                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(post.id, post.isLiked);
                      }}
                      className="absolute right-4 top-3 cursor-pointer"
                      whileTap={{ scale: 1.3 }}
                      animate={{ scale: post.isLiked ? 1.2 : 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <FaHeart
                        className={`w-7 h-7 transition-colors duration-300 ${
                          post.isLiked ? "text-red-500" : "text-white"
                        }`}
                      />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center mt-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 drop-shadow-md">
            Bienvenido a Looping
          </h1>
          <p className="text-lg text-gray-300 max-w-md mx-auto">
            Una plataforma interactiva donde puedes compartir momentos y
            conectar con tus amigos.
          </p>
        </div>
      )}
    </div>
  );
}
