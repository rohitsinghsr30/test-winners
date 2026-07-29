import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          TEST WINNERS
        </Link>

        {/* Navigation */}
        <nav className={styles.navLinks}>
          <Link to="/">Home</Link>
          <Link to="/test">Tests</Link>
          <Link to="/result">Results</Link>
          <Link to="/wallet">Wallet</Link>
        </nav>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          <Link to="/login" className={styles.login}>
            Login
          </Link>

          <Link to="/signup" className={styles.signup}>
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;