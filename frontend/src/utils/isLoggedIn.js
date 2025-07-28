export default async function isLoggedIn() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return false;

    const data = await res.json();
    return !!data.user;
  } catch (error) {
    return error.message;
  }
}
