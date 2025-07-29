import { useState } from "react";
import { useNavigate } from "react-router";

export default function CreatePost({ onPostCreated }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setError("Por favor, sube solo imágenes");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen es demasiado grande (máx. 5MB)");
        return;
      }

      setImage(file);
      setError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("El contenido no puede estar vacío");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let imageUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadResponse = await fetch(`${apiUrl}/api/upload-image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      const postResponse = await fetch(`${apiUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, image: imageUrl }),
      });

      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        throw new Error(errorData.error || "Error al crear el post");
      }

      const newPost = await postResponse.json();

      setContent("");
      setImage(null);
      setImagePreview(null);

      if (onPostCreated) {
        onPostCreated(newPost.post);
      }
      navigate("/me");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl w-full px-4 sm:px-6 mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">
        Crear Nueva Publicación
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-gray-800 to-gray-900 px-4 py-6 sm:p-8 rounded-xl shadow-lg border border-gray-700"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <textarea
          className="w-full p-3 sm:p-4 mb-6 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 text-sm sm:text-base"
          rows="5"
          placeholder="¿Qué estás pensando?..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Añadir imagen
          </label>

          {imagePreview ? (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-52 sm:h-64 object-cover rounded-lg mb-2"
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
            <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-xl cursor-pointer bg-gray-700 hover:bg-gray-700/50 transition">
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
              <p className="mt-2 text-sm text-gray-400 text-center px-2">
                Haz clic para subir una imagen (max. 5MB)
              </p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end sm:justify-between gap-4">
          <button
            className={`w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>
    </div>
  );
}
