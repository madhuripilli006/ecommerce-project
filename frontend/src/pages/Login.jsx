import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      alert("Login successful");

      window.location.href = "/";
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container py-5">
      <div className="auth-card mx-auto" style={{ maxWidth: "450px" }}>
        <h2 className="auth-title text-center">Welcome Back</h2>

        <p className="text-muted text-center mb-4">
          Login to continue shopping
        </p>

        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-3"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-control mb-4"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-100 py-2">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;