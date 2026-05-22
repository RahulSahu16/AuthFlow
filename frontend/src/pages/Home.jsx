import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const displayName = user
    ? `${user.firstname || ""} ${user.lastname || ""}`.trim() || user.email?.split("@")[0]
    : "there";

  return (
    <div className="page-shell fade-in">
      <Navbar />
      <main className="page-content">
        <section className="hero-card">
          <p className="small-text">Premium account experience</p>
          <h1>Secure authentication built for modern teams.</h1>
          <p className="section-subtitle">
            Welcome back, {displayName}. Access your account, manage your profile, and navigate securely through a clean and modern authentication workspace.
          </p>
          <div className="hero-actions">
            <button className="btn-pill primary-btn" onClick={() => navigate("/profile")}>Open profile</button>
          </div>
        </section>
      </main>
    </div>
  );
}
