import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaComment } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import "./Post.css";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [viewComments, setViewComments] = useState(false);
  const [imageType, setImageType] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const toggleLike = async (postId, isLiked) => {
    const method = isLiked ? "DELETE" : "POST";
    const res = await fetch(`http://localhost:3001/api/likes`, {
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

    const res = await fetch(`http://localhost:3001/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId: id, text }),
    });

    if (res.ok) {
      const updatedPost = await fetch(`http://localhost:3001/api/posts/${id}`, {
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
        const res = await fetch(`http://localhost:3001/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();

          setPost(data.post);
          setImageType(data.post.author.avatar.startsWith("/uploads") ? 1 : 0);
        }
      } catch (err) {
        console.error("Error cargando post:", err.message);
      }
    };

    fetchPost();
  }, [id, token]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 w-full max-w-5xl mx-auto overflow-y-hidden">
      <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl">
        {post ? (
          <div className="flex flex-col items-center text-center">
            <div
              className="flex items-center gap-4 w-full cursor-pointer mb-6"
              onClick={() =>
                navigate(
                  `${
                    post.author.isCurrentUser
                      ? `/me`
                      : `/profile/${post.author.id}`
                  }`
                )
              }
            >
              <img
                src={`${
                  imageType == 0
                    ? post.author.avatar
                    : `http://localhost:3001${encodeURI(post.author.avatar)}`
                }`}
                alt="Avatar del autor"
                className="w-12 h-12 rounded-full border-2 border-fuchsia-600"
              />
              <h1 className="text-xl font-semibold text-left">
                {post.author.username}
              </h1>
            </div>

            {post.image && (
              <img
                src={`http://localhost:3001${encodeURI(post.image)}`}
                alt="Imagen del post"
                className="object-cover rounded-xl mb-6 max-h-[400px] w-full"
              />
            )}

            <div className="flex w-full justify-between items-start mb-4">
              <div className="text-left">
                <p className="text-md text-gray-200 mb-2 italic break-words max-w-xs">
                  {post.content || "Este post no tiene contenido"}
                </p>
                <p className="text-xs text-gray-500">
                  {post.createdAtFormatted || post.createdAt}
                </p>
              </div>
              <div className="flex items-center gap-4">
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
                  className="w-full mt-6 border-t border-gray-700 pt-6 "
                >
                  <h2 className="text-lg font-bold mb-4">Comentarios</h2>

                  <div className="flex flex-col gap-4 mb-6 max-h-[45vh] overflow-y-auto scrollbar-custom">
                    {post?.comments?.length > 0 ? (
                      post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex gap-3 p-4 bg-gray-800 rounded-xl shadow transition hover:shadow-md"
                        >
                          <img
                            src={`${
                              imageType == 0
                                ? comment.user.avatar
                                : `http://localhost:3001${encodeURI(
                                    comment.user.avatar
                                  )}`
                            }`}
                            alt="Avatar del autor"
                            className="w-10 h-10 rounded-full border border-fuchsia-600 cursor-pointer"
                            onClick={() =>
                              navigate(
                                `${
                                  comment.isCurrentUser
                                    ? `/me`
                                    : `/profile/${comment.user.id}`
                                }`
                              )
                            }
                          />
                          <div className="flex-1 text-left">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-sm font-semibold text-white">
                                {comment.user.username}
                              </p>
                              <p className="text-xs text-gray-500">
                                {comment.createdAt}
                              </p>
                            </div>
                            <p className="text-sm text-gray-300 leading-snug">
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
                      className="flex-1 border-b-2 border-gray-600 focus:border-fuchsia-600 focus:outline-none px-3 py-2 bg-transparent text-white placeholder-gray-400 transition-all duration-150"
                    />
                    <button
                      type="submit"
                      className="p-2 hover:scale-110 transition"
                    >
                      <IoIosSend className="w-6 h-6 text-fuchsia-500" />
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
