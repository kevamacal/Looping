import { useNavigate } from "react-router";

export default function PostsList({ posts }) {
  const navigate = useNavigate();

  return posts && posts.length > 0 ? (
    <div className="flex flex-wrap gap-4 w-full">
      {posts.map((post) => (
        <div
          key={post.id}
          className="w-full sm:basis-[calc(33.333%-1rem)] bg-gray-800 rounded-xl shadow-md hover:bg-gray-700 hover:scale-[1.02] transition cursor-pointer overflow-hidden"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          {post.image && (
            <img
              src={post.image}
              alt="Imagen del post"
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <p className="text-sm text-white font-medium line-clamp-3">
              {post.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-400 text-center">
      No hay publicaciones para mostrar.
    </p>
  );
}
