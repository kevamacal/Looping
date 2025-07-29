import { useNavigate } from "react-router";

export default function PostsList({ posts }) {
  const navigate = useNavigate();
  return posts && posts.length > 0 ? (
    <div className="w-full space-y-4 grid grid-cols-3 gap-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex flex-col justify-center items-center bg-gray-800 p-6 rounded-xl shadow-xl hover:bg-gray-700 hover:scale-105 transition duration-100 cursor-pointer"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          <img
            src={post.image}
            alt="Avatar del autor"
            className="w-18 h-18 rounded-full border border-fuchsia-600"
          />
          <p className="text-lg font-semibold">{post.content}</p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-400">No hay publicaciones para mostrar.</p>
  );
}
