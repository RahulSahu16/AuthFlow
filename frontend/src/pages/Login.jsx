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

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 px-4">
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-2">
            Login to continue your journey 
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full mt-6 py-2 rounded-lg font-medium text-white transition 
          ${loading 
            ? "bg-blue-300 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-600">
          <span>Don’t have an account? </span>
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
}