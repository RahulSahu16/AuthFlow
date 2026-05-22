import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell auth-page fade-in">
      <div className="auth-panel">
        <div className="form-card">
          <div className="mb-6 text-center">
            
            <h2 className="section-heading" style={{ fontSize: "2.5rem" }}>Welcome back</h2>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="form-button mt-6"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-6 text-center" style={{ color: "var(--text-secondary)" }}>
            <span>Don’t have an account? </span>
            <button
              onClick={() => navigate("/register")}
              className="link-button"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}