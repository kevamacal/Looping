import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
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
        }
      } catch (err) {
        console.error("Error cargando post:", err.message);
      }
    };

    fetchPost();
  }, [id, token]);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-900 px-6 py-10 w-full max-w-5xl mx-auto ">
      <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">
        {post ? (
          <div className="flex flex-col items-center text-center relative">
            <div
              className="flex justify-start align-center w-1/1 mb-4 gap-4 cursor-pointer"
              onClick={() => navigate(`/profile/${post.author.id}`)}
            >
              <img
                src={post.author.avatar}
                alt="Avatar del autor"
                className="w-10 h-10 rounded-full"
              />
              <h1 className="text-3xl font-bold ">{post.author.username}</h1>
            </div>

            {post.image && (
              <img
                src={`http://localhost:3001${encodeURI(post.image)}`}
                alt="Imagen del post"
                className="object-cover rounded-2xl mb-4"
              />
            )}
            <div className="flex w-11/12 justify-between items-center ">
              <div className="flex flex-col items-start">
                <p className="text-md font-medium mb-4 italic text-gray-300 max-w-xs">
                  {post.content || "Este post no tiene contenido"}
                </p>
                <p className="text-sm text-gray-400">{post.createdAt}</p>
              </div>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(post.id, post.isLiked);
                }}
                className="cursor-pointer"
                whileHover={{ scale: 1.2 }}
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
        ) : (
          <p className="text-center text-gray-400 animate-pulse">
            Cargando post...
          </p>
        )}
      </div>
    </div>
  );
}
