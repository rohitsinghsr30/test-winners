import "../styles/topwinners.css";

function TopWinners() {

  const winners = [

    {
      name: "Rohit Kumar",
      prize: "₹5,000",
      city: "Patna"
    },

    {
      name: "Anjali Singh",
      prize: "₹3,000",
      city: "Delhi"
    },

    {
      name: "Rahul Kumar",
      prize: "₹2,000",
      city: "Lucknow"
    }

  ];

  return (

    <section className="winnerSection">

      <h2>🏆 Recent Winners</h2>

      <div className="winnerGrid">

        {winners.map((winner, index) => (

          <div className="winnerCard" key={index}>

            <div className="avatar">
              👤
            </div>

            <h3>{winner.name}</h3>

            <p>{winner.city}</p>

            <h1>{winner.prize}</h1>

          </div>

        ))}

      </div>

    </section>

  );

}

export default TopWinners;