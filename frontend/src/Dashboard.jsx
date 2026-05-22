import { useEffect, useMemo, useState } from "react";
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
        setFirstname(res.data.firstname || "");
        setLastname(res.data.lastname || "");
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

  const greeting = useMemo(() => {
    if (!user) return "Welcome back.";
    const name = firstname || lastname ? `${firstname} ${lastname}`.trim() : user.email?.split("@")[0] || "there";
    return `Welcome back, ${name}`;
  }, [firstname, lastname, user]);

  const profileCompletion = useMemo(() => {
    const fields = [firstname, lastname, user?.email].filter(Boolean).length;
    return Math.min(100, Math.round((fields / 3) * 100));
  }, [firstname, lastname, user]);

  return (
    <div className="page-shell fade-in">
      <div className="page-content">
        <div className="mx-auto w-full max-w-6xl">
        <div className="overflow-hidden rounded-4xl bg-white/90 shadow-2xl ring-1 ring-slate-200 backdrop-blur-xl">
          <div className="bg-slate-900 px-8 py-10 sm:px-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Secure dashboard</p>
                <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Manage your account like a pro.</h1>
                <p className="mt-4 text-slate-300 text-base sm:text-lg">Update your profile, review account status, and keep your workspace secure with one smooth experience.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-8 lg:grid-cols-[1.55fr_1fr]">
            <section className="space-y-6">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-600 text-3xl font-semibold text-white shadow-lg">
                      {user?.firstname?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Signed in as</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{firstname && lastname ? `${firstname} ${lastname}` : user?.email}</h2>
                      <p className="mt-1 text-sm text-slate-500">{user?.role ?? "Member"}</p>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                    {user?.email ?? "No email"}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Profile completeness</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{profileCompletion}%</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Account status</p>
                  <p className="mt-3 text-3xl font-semibold text-emerald-600">Active</p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Profile details</h3>
                    <p className="mt-2 text-sm text-slate-500">Keep your name current for a polished account experience.</p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-600">Fast update</div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First name</label>
                    <input
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last name</label>
                    <input
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className={`w-full rounded-3xl py-3 text-sm font-semibold text-white transition ${loading ? "bg-slate-300 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700"}`}
                  >
                    {loading ? "Saving changes..." : "Save profile"}
                  </button>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[1.75rem] bg-slate-900 p-6 text-white shadow-xl">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Quick summary</p>
                <h3 className="mt-4 text-3xl font-semibold">{greeting}</h3>
                <p className="mt-3 text-slate-300">Your profile is safe and your account is ready. Use the quick actions below to update security or view your account data.</p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Backup status</p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">Protected</p>
                  <p className="mt-2 text-sm text-slate-500">All authentication sessions are monitored.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Recommended next step</p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">Review your security</p>
                  <p className="mt-2 text-sm text-slate-500">Update your profile regularly for the best experience.</p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Quick actions</h3>
                <p className="mt-2 text-sm text-slate-500">Useful tasks for keeping your account fresh.</p>
                <div className="mt-4 grid gap-3">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className={`w-full rounded-3xl py-3 text-sm font-semibold text-white transition ${loading ? "bg-slate-300 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700"}`}
                  >
                    {loading ? "Saving..." : "Update profile"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Log out securely
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
