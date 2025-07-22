export default async function isLoggedIn() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await fetch("http://localhost:3001/api/auth/me", {
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
