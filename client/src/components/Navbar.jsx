import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        TEST WINNERS
      </div>

      <ul className="navLinks">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/test">Mock Tests</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/wallet">Wallet</Link></li>
        <li><Link to="/result">Results</Link></li>
      </ul>

      <div className="navButtons">
        <Link to="/login" className="loginBtn">
          Login
        </Link>

        <Link to="/signup" className="signupBtn">
          Sign Up
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;