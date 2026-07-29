import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/wallet.css";

function Wallet() {
  const [wallet, setWallet] = useState(0);
  const [winning, setWinning] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wallet`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWallet(res.data.wallet || 0);
      setWinning(res.data.winning || 0);
      setTransactions(res.data.transactions || []);

    } catch (error) {

      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

    } finally {

      setLoading(false);

    }
  };

  // ================= Deposit Money =================

  const depositMoney = async () => {

    if (!amount || Number(amount) <= 0) {
      return alert("Please enter a valid amount.");
    }

    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/wallet/deposit`,
        {
          amount: Number(amount),
          paymentMethod: "UPI",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      setAmount("");

      fetchWallet();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to deposit money."
      );

    }
  };

  // ================= Withdraw =================

  const withdrawMoney = async () => {

    if (!amount || Number(amount) <= 0) {
      return alert("Please enter a valid amount.");
    }

    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/wallet/withdraw`,
        {
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      setAmount("");

      fetchWallet();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Withdrawal failed."
      );

    }
  };

  if (loading) {
    return (
      <div className="walletPage">
        <h2 style={{ textAlign: "center" }}>
          Loading Wallet...
        </h2>
      </div>
    );
  }

  return (
    <div className="walletPage">

      <div className="walletCard">

        <h2>💰 My Wallet</h2>

        <h3>Wallet Balance : ₹{wallet}</h3>

        <h3>Winning Balance : ₹{winning}</h3>

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="walletButtons">

          <button onClick={depositMoney}>
            Deposit Money
          </button>

          <button onClick={withdrawMoney}>
            Withdraw
          </button>

        </div>

        <hr />

        <h3>Transaction History</h3>

        {transactions.length === 0 ? (
          <p>No Transactions Found.</p>
        ) : (
          transactions.map((item) => (
            <div
              className="transaction"
              key={item._id}
            >
              <p>
                <strong>{item.type}</strong>
              </p>

              <p>₹{item.amount}</p>

              <p>{item.status}</p>
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default Wallet;