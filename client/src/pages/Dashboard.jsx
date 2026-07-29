import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);

    } catch (error) {

      console.error("Dashboard Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h2 style={{ textAlign: "center", marginTop: "100px" }}>
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="dashboard">

      <div className="dashboardHeader">

        <h1>Welcome, {user?.fullName} 👋</h1>

        <p>
          Welcome back to <strong>TEST WINNERS</strong>.
          Practice daily, improve your rank and win real cash rewards.
        </p>

      </div>

      <div className="dashboardCards">

        <div className="card">
          <h3>💰 Wallet Balance</h3>
          <h2>₹{user?.wallet || 0}</h2>
        </div>

        <div className="card">
          <h3>🏆 Winning Balance</h3>
          <h2>₹{user?.winning || 0}</h2>
        </div>

        <div className="card">
          <h3>📝 Tests Attempted</h3>
          <h2>{user?.testsAttempted || 0}</h2>
        </div>

        <div className="card">
          <h3>🥇 Tests Won</h3>
          <h2>{user?.testsWon || 0}</h2>
        </div>

        <div className="card">
          <h3>🎁 Total Rewards</h3>
          <h2>₹{user?.totalRewards || 0}</h2>
        </div>

        <div className="card">
          <h3>📈 Current Rank</h3>
          <h2>#{user?.rank || 0}</h2>
        </div>

      </div>

      <div className="dashboardProfile">

        <h2>Profile Information</h2>

        <div className="profileGrid">

          <div>
            <strong>Full Name</strong>
            <p>{user?.fullName}</p>
          </div>

          <div>
            <strong>Email</strong>
            <p>{user?.email}</p>
          </div>

          <div>
            <strong>Mobile</strong>
            <p>{user?.mobile}</p>
          </div>

          <div>
            <strong>Referral Code</strong>
            <p>{user?.referralCode || "-"}</p>
          </div>

          <div>
            <strong>Account Status</strong>
            <p>{user?.status}</p>
          </div>

          <div>
            <strong>Role</strong>
            <p>{user?.role}</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;