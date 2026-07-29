import "../../styles/features.css";

const features = [
  {
    title: "Real Cash Rewards",
    desc: "Win real cash based on your rank after every contest."
  },
  {
    title: "Professional CBT Tests",
    desc: "Experience a real exam interface with timer and navigation."
  },
  {
    title: "Daily Competitions",
    desc: "New tests and prize pools are available every day."
  },
  {
    title: "Instant Results",
    desc: "Get your score, rank and analysis immediately after submission."
  },
  {
    title: "Performance Analytics",
    desc: "Track your progress and identify weak subjects."
  },
  {
    title: "Secure Payments",
    desc: "Fast deposits, withdrawals and secure transactions."
  }
];

function Features() {
  return (
    <section className="features">

      <h2>Why Choose TEST WINNERS?</h2>

      <div className="featuresGrid">

        {features.map((item, index) => (

          <div className="featureCard" key={index}>

            <h3>{item.title}</h3>

            <p>{item.desc}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Features;