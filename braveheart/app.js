import { useEffect, useState } from "react";

export default function App() {
  const [user, setUser] = useState(null);
  const API_URL = "https://cwww-auth-sso-braveheart.cubiodojo.workers.dev";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      fetch(`${API_URL}/api/auth/callback?code=${code}`)
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem("jwt", data.token);
            window.history.replaceState({}, document.title, "/");
            fetchUser(data.token);
          }
        });
    }
  }, []);

  function login() {
    window.location.href = `${API_URL}/api/auth/authorize`;
  }

  function logout() {
    localStorage.removeItem("jwt");
    setUser(null);
  }

  function fetchUser(token) {
    fetch(`${API_URL}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => logout());
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Cloudflare SSO</h1>
      {user ? (
        <div className="p-4 bg-white rounded-lg shadow">
          <p>Welcome, {user.name} ({user.sub})</p>
          <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </div>
      ) : (
        <button onClick={login} className="px-4 py-2 bg-blue-500 text-white rounded">Login with SSO</button>
      )}
    </div>
  );
}
