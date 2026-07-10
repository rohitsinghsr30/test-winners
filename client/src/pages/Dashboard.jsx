import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function Dashboard() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const token = localStorage.getItem("token");

        console.log("================================");
        console.log("TOKEN :", token);
        console.log("Fetching User...");
        console.log("================================");

        const res = await axios.get(
          "http://127.0.0.1:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:");
        console.log(res.data);

        setUser(res.data.user);

      } catch (error) {

        console.log("=========== ERROR ===========");

        console.log("Message:", error.message);

        console.log("Status:", error.response?.status);

        console.log("Response:", error.response?.data);

        console.log(error);

      }

    };

    fetchUser();

  }, []);

  if (!user) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (

    <div className="dashboard">
<h1 style={{color:"red"}}>NEW DASHBOARD</h1>
      <div className="dashboardHeader">
        <h1>Welcome, {user.fullName} 👋</h1>
        <p>Ready to win today's live test?</p>
      </div>

      <div className="dashboardCards">

        <div className="card">
          <h3>Wallet</h3>
          <h2>₹{user.wallet}</h2>
        </div>

        <div className="card">
          <h3>Tests Given</h3>
          <h2>25</h2>
        </div>

        <div className="card">
          <h3>Current Rank</h3>
          <h2>#{user.rank}</h2>
        </div>

        <div className="card">
          <h3>Total Winning</h3>
          <h2>₹{user.winning}</h2>
        </div>

      </div>

    </div>

  );

}

export default Dashboard;