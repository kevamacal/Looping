import { useLocation, useNavigate } from "react-router";
import { useState } from "react";

export default function EditPost() {
  const post = useLocation().state?.post;
  const navigate = useNavigate();
  const [content, setContent] = useState(post?.content || "");
  const [image, setImage] = useState(null); // Nueva imagen
  const [imagePreview, setImagePreview] = useState(
    post?.image ? `http://localhost:3001${encodeURI(post.image)}` : null
  );
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona una imagen válida.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar los 5MB.");
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token") || "";

    setError("");

    try {
      let imageUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadResponse = await fetch(
          "http://localhost:3001/api/upload-image",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      } else if (imagePreview) {
        imageUrl = post.image;
      }

      const postResponse = await fetch(
        `http://localhost:3001/api/posts/${post.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content,
            image: imageUrl,
          }),
        }
      );

      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        throw new Error(errorData.error || "Error al editar el post");
      }

      const updatedPost = await postResponse.json();

      setContent("");
      setImage(null);
      setImagePreview(null);
      navigate(`/post/${updatedPost.post.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 px-6 py-12 rounded-2xl w-full max-w-4xl mx-auto mt-10">
      <div className="bg-gray-800 text-white p-10 rounded-xl shadow-lg w-full">
        <h1 className="text-4xl font-bold text-center mb-10">
          Editar publicación
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-6"
        >
          <textarea
            className="w-full h-40 border-2 border-gray-600 rounded-xl p-3 text-white placeholder-gray-400 focus:border-fuchsia-600 focus:outline-none"
            placeholder="Escribe el contenido de la publicación..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {imagePreview ? (
            <div className="relative group w-full">
              <img
                src={imagePreview}
                alt="Vista previa"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-600 hover:border-fuchsia-500 rounded-xl cursor-pointer bg-gray-700 hover:bg-gray-700/50 transition-all">
                <div className="flex flex-col items-center justify-center pt-6">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="pt-1 text-sm text-gray-400">
                    Haz clic para subir una imagen (máx. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="opacity-0"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-48 py-2 mt-4 rounded-full text-lg font-semibold bg-purple-600 hover:bg-purple-700 transition duration-300 shadow-md"
          >
            Guardar cambios
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && (
            <p className="text-green-500 mt-2">
              ¡Publicación actualizada con éxito!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
