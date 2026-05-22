import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  const fullName = user ? `${user.firstname || ""} ${user.lastname || ""}`.trim() : "Loading...";

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password must match.");
      return;
    }

    if (newPassword.length < 8) {
      alert("New password should be at least 8 characters.");
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await API.put("/users/change-password", { currentPassword, newPassword });
      alert(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="page-shell fade-in">
      <Navbar />
      <main className="page-content ">
        

        <div className="profile-grid">
          <div className="card profile-panel">
            <p className="small-text">User details</p>
            <h2 className="panel-heading">{fullName}</h2>
            <p className="section-subtitle">{user?.email || "Loading your email..."}</p>
          </div>

          <div className="card panel">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3>Change password</h3>
                <p className="small-text">Update your password to keep your account secure.</p>
              </div>
            
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current password</label>
                <input
                  type="password"
                  className="input-field"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New password</label>
                <input
                  type="password"
                  className="input-field"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm new password</label>
                <input
                  type="password"
                  className="input-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="form-button"
              >
                {passwordLoading ? "Changing password..." : "Change password"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
