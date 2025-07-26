import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [hover, setHover] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [imageType, setImageType] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError("Por favor, sube solo imágenes");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen es demasiado grande (máx. 5MB)");
      return;
    }

    setError("");
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("image", file);

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
      const newImageUrl = uploadData.imageUrl;

      const updateResponse = await fetch(
        "http://localhost:3001/api/users/myProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: newImageUrl }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      const updatedUserData = await updateResponse.json();

      setUser(updatedUserData.user);
      setImageType(updatedUserData.user.avatar.startsWith("/uploads") ? 1 : 0);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (imagePreview) {
      setUser((prev) => ({ ...prev, avatar: imagePreview }));
    }
  }, [imagePreview]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:3001/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return alert("Error al obtener el perfil");

      const data = await res.json();
      setUser(data.user);
      setFollowers(data.followers);
      setFollowing(data.following);
      setImageType(data.user.avatar.startsWith("/uploads") ? 1 : 0);
    };

    fetchUser();
  }, [token, imageType]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 px-6 py-12 rounded-2xl w-full max-w-3xl mx-auto">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Mi perfil</h1>
        {user ? (
          <div className="flex flex-col items-center text-center">
            <div
              className="relative w-32 h-32 mb-6 cursor-pointer group"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <img
                src={`${
                  imageType == 0
                    ? user.avatar
                    : `http://localhost:3001${encodeURI(user.avatar)}`
                }`}
                alt="Foto de perfil"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-all duration-200"
              />

              <label
                htmlFor="avatarInput"
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center cursor-pointer transition-opacity"
              >
                <img
                  src="https://images.icon-icons.com/685/PNG/512/edit_icon-icons.com_61193.png"
                  alt="Editar"
                  className="w-8 h-8"
                />
              </label>

              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <p className="text-lg font-semibold mb-2">
              <span className="text-gray-400">Usuario:</span> {user.username}
            </p>
            <div className="flex items-center gap-6 mb-2">
              <p
                className="text-md font-medium cursor-pointer"
                onClick={() =>
                  navigate(`/followers/${user.id}`, {
                    state: { users: followers, type: "followers" },
                  })
                }
              >
                <span className="text-gray-400">Seguidores:</span>{" "}
                {followers.length}
              </p>
              <p
                className="text-md font-medium cursor-pointer"
                onClick={() =>
                  navigate(`/following/${user.id}`, {
                    state: { users: following, type: "following" },
                  })
                }
              >
                <span className="text-gray-400">Seguidos:</span>{" "}
                {following.length}
              </p>
            </div>
            <p className="text-md font-medium">
              <span className="text-gray-400">Correo:</span> {user.email}
            </p>
            <p className="text-md font-medium mt-4">
              <span className="text-gray-400">Biografía:</span> {user.bio}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-400 animate-pulse">
            Cargando perfil...
          </p>
        )}
      </div>
    </div>
  );
}
