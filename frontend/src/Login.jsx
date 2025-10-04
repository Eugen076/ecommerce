import { useState } from "react";

function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
      })
      .then(user => {
        localStorage.setItem("user", JSON.stringify(user));
        onLogin(user);
      })
      .catch(err => alert(err.message));
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="form-control mb-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="form-control mb-2"
        required
      />
      <button className="btn btn-primary">Login</button>

    
      <p className="mt-2">
        Nu ai cont?{" "}
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={onShowRegister}
        >
          Crează unul aici
        </button>
      </p>
    </form>
  );
}

export default Login;
