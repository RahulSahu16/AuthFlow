import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Navbar() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        const firstname = res.data.firstname || "";
        const lastname = res.data.lastname || "";
        setName(firstname || lastname ? `${firstname} ${lastname}`.trim() : res.data.email?.split("@")[0] || "User");
      } catch {
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

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
    <header className="navbar">
      <div className="navbar-inner">
        <div>
          <p className="navbar-brand">AuthFlow</p>
          <p className="navbar-text">Hello, {name}</p>
        </div>
        <div className="navbar-actions">
          <button className="btn-pill secondary-btn" onClick={() => navigate("/")}>Home</button>
          <button className="btn-pill secondary-btn" onClick={() => navigate("/profile")}>Profile</button>
          <button className="btn-pill primary-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
}
