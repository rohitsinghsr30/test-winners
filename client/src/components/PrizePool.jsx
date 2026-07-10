import "../styles/prizepool.css";

function PrizePool() {
  return (
    <section className="prizePool">

      <h2>🏆 Today's Live Prize Pool</h2>

      <div className="poolCards">

        <div className="poolCard">
          <h3>Entry Fee</h3>
          <h1>₹10</h1>
        </div>

        <div className="poolCard">
          <h3>Total Prize Pool</h3>
          <h1>₹10,000</h1>
        </div>

        <div className="poolCard">
          <h3>Participants</h3>
          <h1>750 / 1000</h1>
        </div>

        <div className="poolCard">
          <h3>Test Starts In</h3>
          <h1>07:30 PM</h1>
        </div>

      </div>

    </section>
  );
}

export default PrizePool;