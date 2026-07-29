import { Link } from "react-router-dom";
import "../../styles/hero.css";
import heroImage from "../../assets/hero.png";

function Hero() {
  return (
    <section className="hero">

      <div className="heroLeft">

        <span className="badge">
  🏆 India's #1 CBT Exam & Reward Platform
</span>

<h1>
  Practice.
  <br />
  Compete.
  <br />
  Win Real Cash.
</h1>

<p>
  Join thousands of students preparing for SSC, Railway, Banking,
  BPSC, UPSC and other competitive exams. Attempt high-quality CBT
  tests for just ₹10 and win exciting cash rewards based on your rank.
</p>

<div className="heroStats">
  <div>
    <h3>50K+</h3>
    <span>Students</span>
  </div>

  <div>
    <h3>10K+</h3>
    <span>Tests</span>
  </div>

  <div>
    <h3>₹25L+</h3>
    <span>Rewards</span>
  </div>
</div>

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