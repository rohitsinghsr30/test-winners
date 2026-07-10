import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css";

function Login() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      login(res.data.user, res.data.token);

      alert(res.data.message);

      navigate("/dashboard");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Login Failed"
      );

    }

  };

  return (

    <div className="loginPage">

      <div className="loginBox">

        <h1>TEST WINNERS</h1>

        <p>Welcome Back 👋</p>

        <div className="inputGroup">

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

        </div>

        <div className="inputGroup">

          <label>Password</label>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

        </div>

        <div className="loginOptions">

          <label>

            <input type="checkbox" />

            Remember Me

          </label>

          <span className="forgot">

            Forgot Password?

          </span>

        </div>

        <button
          className="loginBtn"
          onClick={handleLogin}
        >

          Login

        </button>

        <button
          className="showBtn"
          onClick={() => setShowPassword(!showPassword)}
        >

          {showPassword
            ? "Hide Password"
            : "Show Password"}

        </button>

        <p className="bottomText">

          Don't have an account?

          <Link to="/signup">

            Sign Up

          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;