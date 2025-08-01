import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaComment } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

export default function Post() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [viewComments, setViewComments] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();

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
      setPost((prevPost) => ({
        ...prevPost,
        isLiked: !isLiked,
      }));
    } else {
      alert("Error al cambiar estado de like");
    }
  };

  const toggleViewComments = () => {
    setViewComments(!viewComments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target[0].value.trim();
    if (!text) return;

    const res = await fetch(`${apiUrl}/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId: id, text }),
    });

    if (res.ok) {
      const updatedPost = await fetch(`${apiUrl}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (updatedPost.ok) {
        const data = await updatedPost.json();
        setPost(data.post);
      }

      e.target.reset();
    } else {
      alert("Error al enviar el comentario");
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        }
      } catch (err) {
        console.error("Error cargando post:", err.message);
      }
    };

    fetchPost();
  }, [id, token]);

  const loadUsersToSend = async () => {
    if (users.length > 0) {
      setUsers([]);
      return;
    }
    const res = await fetch(`${apiUrl}/api/users/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return alert("Error al obtener los usuarios");
    const data = await res.json();
    let usersTemp = data.users;

    if (usersTemp.length === 0) {
      const res = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return alert("Error al obtener los usuarios");
      const data = await res.json();
      usersTemp = data.following;
    }
    setUsers(usersTemp);
  };

  const sendMessage = async (recipientId) => {
    const message = `Mira esta publicación de ${post.author.username} y dime qué te parece: ${post.content} ==> la url es ${frontendUrl}${location.pathname}`;

    const res = await fetch(`${apiUrl}/api/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipientId, message }),
    });
    if (!res.ok) return alert("Error al enviar el mensaje");
    navigate(`/messages`, { state: { selectedUser: recipientId } });
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 w-full">
      <div className="bg-gray-900 text-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-3xl">
        {post ? (
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-4 w-full mb-6">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() =>
                  navigate(
                    post.author.isCurrentUser
                      ? `/me`
                      : `/profile/${post.author.id}`
                  )
                }
              >
                <img
                  src={post.author.avatar}
                  alt="Avatar del autor"
                  className="w-12 h-12 rounded-full border-2 border-fuchsia-600"
                />
                <h1 className="text-xl font-semibold">
                  {post.author.username}
                </h1>
              </div>
              {post.author.isCurrentUser && (
                <motion.button
                  className="ml-auto"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 1.3 }}
                  onClick={() => navigate(`/edit-post`, { state: { post } })}
                >
                  <MdEdit className="w-7 h-7" />
                </motion.button>
              )}
            </div>

            {post.image && (
              <img
                src={post.image}
                alt="Imagen del post"
                className="object-cover rounded-xl mb-6 w-full max-h-[300px] sm:max-h-[400px]"
              />
            )}

            <div className="flex w-full justify-between items-start mb-4 flex-col sm:flex-row gap-4 relative">
              <div className="text-left w-full sm:w-auto">
                <p className="text-sm sm:text-md text-gray-200 mb-2 italic break-words whitespace-pre-wrap">
                  {post.content}
                </p>
                <p className="text-xs text-gray-500">
                  {post.createdAtFormatted || post.createdAt}
                </p>
              </div>
              <div className="flex items-center gap-4 ">
                <motion.button
                  onClick={() => toggleLike(post.id, post.isLiked)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 1.3 }}
                  animate={{ scale: post.isLiked ? 1.2 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <FaHeart
                    className={`w-6 h-6 transition-colors duration-300 ${
                      post.isLiked ? "text-red-500" : "text-white"
                    }`}
                  />
                </motion.button>

                <motion.button
                  onClick={toggleViewComments}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 1.3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <FaComment className="w-6 h-6 text-white" />
                </motion.button>

                <motion.button
                  onClick={loadUsersToSend}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 1.3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <IoIosSend className="w-6 h-6 text-white" />
                </motion.button>

                <AnimatePresence>
                  {users.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="absolute right-[-20%] mt-2 w-64 bg-gray-800 rounded-lg shadow-lg py-5 px-4 flex flex-col gap-2 z-50"
                    >
                      <h2 className="text-lg font-semibold text-white mb-2">
                        Enviar a:
                      </h2>
                      {users.map((user, index) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4 items-center cursor-pointer hover:bg-gray-700 p-2 rounded"
                          onClick={() => sendMessage(user.id)}
                        >
                          <img
                            src={user.avatar}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                          <span>{user.username}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {viewComments && (
                <motion.div
                  key="comments"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full mt-6 border-t border-gray-700 pt-6"
                >
                  <h2 className="text-lg font-bold mb-4">Comentarios</h2>

                  <div className="flex flex-col gap-4 mb-6 max-h-[30vh] overflow-y-auto pr-1 sm:pr-2 scrollbar-custom">
                    {post?.comments?.length > 0 ? (
                      post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex gap-3 p-3 sm:p-4 bg-gray-800 rounded-xl shadow hover:shadow-md"
                        >
                          <img
                            src={comment.user.avatar}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full border border-fuchsia-600 cursor-pointer"
                            onClick={() =>
                              navigate(
                                comment.isCurrentUser
                                  ? `/me`
                                  : `/profile/${comment.user.id}`
                              )
                            }
                          />
                          <div className="flex-1 text-left">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-sm font-semibold">
                                {comment.user.username}
                              </p>
                              <p className="text-xs text-gray-500">
                                {comment.createdAt}
                              </p>
                            </div>
                            <p className="text-sm text-gray-300">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        No hay comentarios todavía
                      </p>
                    )}
                  </div>

                  <form
                    className="flex items-center gap-2"
                    onSubmit={handleSubmit}
                  >
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      className="flex-1 border-b-2 border-gray-600 focus:border-fuchsia-600 focus:outline-none px-3 py-2 bg-transparent text-white placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      className="p-2 hover:scale-110 transition"
                    >
                      <IoSend className="w-6 h-6 text-fuchsia-500" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-center text-gray-400 animate-pulse">
            Cargando post...
          </p>
        )}
      </div>
    </div>
  );
}
