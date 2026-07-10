import "../styles/stats.css";

function Stats() {
  const stats = [
    { number: "50,000+", title: "Registered Users" },
    { number: "1,20,000+", title: "Tests Completed" },
    { number: "₹12 Lakhs+", title: "Rewards Paid" },
    { number: "98%", title: "Success Rate" },
  ];

  return (
    <section className="statsSection">
      <h2>Trusted by Thousands of Students</h2>

      <div className="statsGrid">
        {stats.map((item, index) => (
          <div className="statCard" key={index}>
            <h1>{item.number}</h1>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;