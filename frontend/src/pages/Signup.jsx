
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="page-shell auth-page fade-in">
      <div className="auth-panel">
        <div className="form-card">
          <h2 className="section-heading" style={{ fontSize: "2rem" }}>Signup</h2>
          <p className="section-subtitle">Create a new account for the dashboard.</p>

          <input
            className="input-field"
            placeholder="First Name"
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Last Name"
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="form-button mt-6" onClick={handleSignup}>Signup</button>
          <div className="mt-4 text-center" style={{ color: "var(--text-secondary)" }}>
            <span>Already have an account? </span>
            <button className="link-button" onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}