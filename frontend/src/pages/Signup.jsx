
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
    <div className="form-card">
      <h2 className="text-3xl font-bold text-slate-900">Signup</h2>
      <p className="mt-2 text-sm text-slate-500">Create a new account for the dashboard.</p>

      <input
        className="form-field"
        placeholder="First Name"
        value={form.firstname}
        onChange={(e) => setForm({ ...form, firstname: e.target.value })}
      />
      <input
        className="form-field"
        placeholder="Last Name"
        value={form.lastname}
        onChange={(e) => setForm({ ...form, lastname: e.target.value })}
      />
      <input
        className="form-field"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="form-field"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="form-button" onClick={handleSignup}>Signup</button>
      <div className="mt-4 text-center">
        <span>Already have an account? </span>
        <span className="link-button" onClick={() => navigate('/login')}>Login</span>
      </div>
    </div>
  );
}