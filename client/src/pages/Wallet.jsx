import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/wallet.css";

function Wallet() {

  const [wallet, setWallet] = useState(0);
  const [winning, setWinning] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:5000/api/wallet",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWallet(res.data.wallet);
      setWinning(res.data.winning);
      setTransactions(res.data.transactions);

    } catch (err) {

      console.log(err);

    }

  };

  const addMoney = async () => {

    if (!amount) {
      return alert("Enter Amount");
    }

    try {

      const res = await axios.post(
        "http://127.0.0.1:5000/api/wallet/add",
        {
          amount,
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

    } catch (err) {

      alert(err.response?.data?.message);

    }

  };

  const withdrawMoney = async () => {

    if (!amount) {
      return alert("Enter Amount");
    }

    try {

      const res = await axios.post(
        "http://127.0.0.1:5000/api/wallet/withdraw",
        {
          amount,
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

    } catch (err) {

      alert(err.response?.data?.message);

    }

  };

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
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <div className="walletButtons">

          <button onClick={addMoney}>
            Add Money
          </button>

          <button onClick={withdrawMoney}>
            Withdraw
          </button>

        </div>

        <hr />

        <h3>Transaction History</h3>

        {transactions.length === 0 ? (

          <p>No Transactions</p>

        ) : (

          transactions.map((item) => (

            <div
              className="transaction"
              key={item._id}
            >

              <p>

                {item.type.toUpperCase()}

              </p>

              <p>

                ₹{item.amount}

              </p>

              <p>

                {item.status}

              </p>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default Wallet;