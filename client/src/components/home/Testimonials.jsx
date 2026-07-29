import "../../styles/testimonials.css";

const testimonials = [
  {
    name: "Rahul Kumar",
    exam: "SSC CGL Aspirant",
    review: "Best CBT platform. The exam interface feels exactly like the real exam."
  },
  {
    name: "Priya Singh",
    exam: "Railway NTPC",
    review: "I won my first cash reward after just two weeks of practice."
  },
  {
    name: "Aman Verma",
    exam: "BPSC",
    review: "Daily practice and detailed analysis helped improve my score."
  }
];

function Testimonials() {
  return (
    <section className="testimonials">

      <h2>What Students Say</h2>

      <div className="testimonialGrid">

        {testimonials.map((item, index) => (
          <div className="testimonialCard" key={index}>

            <p>"{item.review}"</p>

            <h3>{item.name}</h3>

            <span>{item.exam}</span>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Testimonials;