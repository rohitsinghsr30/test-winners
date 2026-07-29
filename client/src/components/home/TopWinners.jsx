import "../../styles/topwinners.css";

const winners = [
  {
    name: "Rohit Kumar",
    rank: 1,
    prize: "₹10,000",
    exam: "SSC CGL"
  },
  {
    name: "Anjali Singh",
    rank: 2,
    prize: "₹7,500",
    exam: "Railway NTPC"
  },
  {
    name: "Amit Sharma",
    rank: 3,
    prize: "₹5,000",
    exam: "BPSC"
  }
];

function TopWinners() {
  return (
    <section className="topWinners">

      <h2>🏆 Top Winners</h2>

      <div className="winnerGrid">

        {winners.map((winner) => (

          <div className="winnerCard" key={winner.rank}>

            <h1>#{winner.rank}</h1>

            <h3>{winner.name}</h3>

            <p>{winner.exam}</p>

            <span>{winner.prize}</span>

          </div>

        ))}

      </div>

    </section>
  );
}

export default TopWinners;