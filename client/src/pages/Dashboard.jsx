import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="dashboard">
        <h2 style={{ textAlign: "center", marginTop: "100px" }}>
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="dashboard">

      <div className="dashboardHeader">
        <h1>Welcome, {user.fullName} 👋</h1>
        <p>Ready to win today's live test?</p>
      </div>

      <div className="dashboardCards">

        <div className="card">
          <h3>Wallet Balance</h3>
          <h2>₹{user.wallet || 0}</h2>
        </div>

        <div className="card">
          <h3>Tests Given</h3>
          <h2>{user.testsGiven || 0}</h2>
        </div>

        <div className="card">
          <h3>Current Rank</h3>
          <h2>#{user.rank || 0}</h2>
        </div>

        <div className="card">
          <h3>Total Winning</h3>
          <h2>₹{user.winning || 0}</h2>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;