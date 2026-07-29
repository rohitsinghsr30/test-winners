import "../../styles/prizepool.css";

function PrizePool() {
  return (
    <section className="prizePool">

      <h2>Today's Prize Pool</h2>

      <div className="prizeCard">

        <h1>₹50,000</h1>

        <p>
          Daily rewards distributed among top-performing students.
          Attempt tests, improve your rank and win real cash prizes.
        </p>

        <button className="joinBtn">
          Join Today's Contest
        </button>

      </div>

    </section>
  );
}

export default PrizePool;