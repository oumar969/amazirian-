// src/pages/Login.tsx
import React, { useState } from "react";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username && password) {
      alert("Login Successful!");
    } else {
      alert("Please fill in both fields.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="border p-2 w-full mb-4"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="bg-blue-600 text-white p-2 w-full">
        Log In
      </button>
    </div>
  );
};

export default Login;
