import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      toast.success("Registration successful");

      window.location.href = "/login";
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="auth-card mx-auto" style={{ maxWidth: "450px" }}>
        <h2 className="auth-title text-center">Create Account</h2>

        <p className="text-muted text-center mb-4">
          Register to start shopping
        </p>

        <form onSubmit={handleRegister}>
          <input
            className="form-control mb-3"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;