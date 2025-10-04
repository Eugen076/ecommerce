import { useState } from "react";

function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

   
    if (password !== confirmPassword) {
      setError("Parolele nu corespund!");
      return;
    }

    const newUser = {
      username,
      password,
      role: "USER" 
    };

    fetch("http://localhost:8080/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then(res => {
        if (!res.ok) throw new Error("Înregistrare eșuată");
        return res.json();
      })
      .then(user => {
        localStorage.setItem("user", JSON.stringify(user));
        onRegister(user);
      })
      .catch(err => setError(err.message));
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2>Crează un cont</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="form-control mb-2"
        required
      />

      <input
        type="password"
        placeholder="Parolă"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-control mb-2"
        required
      />

      <input
        type="password"
        placeholder="Confirmă parola"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="form-control mb-2"
        required
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <button className="btn btn-primary">Înregistrează-te</button>
    </form>
  );
}

export default Register;
