import { Link } from "react-router-dom";
import "../styles/hero.css";
import heroImage from "../assets/hero.png";

function Hero() {
  return (
    <section className="hero">

      <div className="heroLeft">

        <span className="badge">
          India's Smartest Online Test Platform
        </span>

        <h1>
          Practice Daily.
          <br />
          Win Real Cash Rewards.
        </h1>

        <p>
          Join TEST WINNERS and compete in professional CBT exams.
          Pay only ₹10, improve your ranking and win exciting rewards.
        </p>

        <div className="heroButtons">

          <Link to="/signup" className="primaryBtn">
            Start Now
          </Link>

          <Link to="/test" className="secondaryBtn">
            Explore Tests
          </Link>

        </div>

      </div>

      <div className="heroRight">
        <img src={heroImage} alt="Hero" />
      </div>

    </section>
  );
}

export default Hero;