import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa6";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footerGrid">

        <div>
          <h2>TEST WINNERS</h2>

          <p>
            India's trusted online CBT examination and reward platform.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>

          <p>Home</p>
          <p>Dashboard</p>
          <p>Tests</p>
          <p>Results</p>
        </div>

        <div>
          <h3>Support</h3>

          <p>Email : support@testwinners.in</p>

          <p>Phone : +91 9876543210</p>

          <p>24×7 Help Center</p>
        </div>

        <div>

          <h3>Follow Us</h3>

          <div className="socialIcons">

            <FaFacebook />

            <FaInstagram />

            <FaLinkedin />

            <FaYoutube />

          </div>

        </div>

      </div>

      <hr />

      <p className="copyright">
        © 2026 TEST WINNERS. All Rights Reserved.
      </p>

    </footer>
  );
}

export default Footer;