import "../../styles/faq.css";

const faqs = [
  {
    q: "How do I participate?",
    a: "Create an account, add wallet balance and join any available test."
  },
  {
    q: "How are rewards distributed?",
    a: "Rewards are distributed according to the rank achieved in each contest."
  },
  {
    q: "Can I withdraw winnings?",
    a: "Yes. Verified users can withdraw winnings directly to their bank account."
  },
  {
    q: "Are CBT exams timed?",
    a: "Yes. Every exam includes a real countdown timer like government exams."
  }
];

function Faq() {
  return (
    <section className="faq">

      <h2>Frequently Asked Questions</h2>

      <div className="faqContainer">

        {faqs.map((item, index) => (

          <div className="faqItem" key={index}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>

        ))}

      </div>

    </section>
  );
}

export default Faq;