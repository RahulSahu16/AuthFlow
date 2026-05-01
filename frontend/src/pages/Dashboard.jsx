import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        setUser(res.data);
        setFirstname(res.data.firstname);
        setLastname(res.data.lastname);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await API.put("/users/profile", { firstname, lastname });
      setUser(res.data.user);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/users/logout");
    } catch (err) {
      console.warn(err);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-sm text-slate-500">Manage your profile</p>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            Logout
          </button>
        </div>

        {/* Content */}
        {user ? (
          <div className="space-y-4">
            
            {/* Email */}
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium text-slate-800">{user.email}</p>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                First Name
              </label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Last Name
              </label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>

            {/* Button */}
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-medium transition 
              ${loading 
                ? "bg-blue-300 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>

          </div>
        ) : (
          <p className="text-center text-slate-500">Loading...</p>
        )}
      </div>
    </div>
  );
}