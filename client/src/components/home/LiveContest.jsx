import "../../styles/livecontest.css";

function LiveContest() {
  return (
    <section className="liveContest">

      <div className="contestCard">

        <div>
          <small>🔥 LIVE CONTEST</small>
          <h2>Today's Prize Pool</h2>
          <h1>₹50,000</h1>
        </div>

        <div className="contestStats">

          <div>
            <h3>2,487</h3>
            <span>Participants</span>
          </div>

          <div>
            <h3>02:14:28</h3>
            <span>Time Left</span>
          </div>

        </div>

        <button>Join Now</button>

      </div>

    </section>
  );
}

export default LiveContest;