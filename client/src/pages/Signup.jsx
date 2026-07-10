import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";

function Signup() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    referredBy: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    try {

      const res = await axios.post(
  "http://127.0.0.1:5000/api/auth/register",
  formData
);

      alert(res.data.message);

      navigate("/login");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Registration Failed"
      );

    }
  };

  return (
    <div className="signupPage">

      <div className="signupBox">

        <h1>TEST WINNERS</h1>

        <p>Create Your Account 🚀</p>

        <div className="inputGroup">
          <label>Full Name</label>

          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />

        </div>

        <div className="inputGroup">

          <label>Mobile Number</label>

          <input
            type="text"
            name="mobile"
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChange={handleChange}
          />

        </div>

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
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
          />

        </div>

        <div className="inputGroup">

          <label>Referral Code (Optional)</label>

          <input
            type="text"
            name="referredBy"
            placeholder="Referral code"
            value={formData.referredBy}
            onChange={handleChange}
          />

        </div>

        <div className="signupOptions">

          <label>

            <input type="checkbox" />

            I agree to Terms & Conditions

          </label>

        </div>

        <button
          className="signupBtn"
          onClick={handleSignup}
        >

          Create Account

        </button>

        <button
          className="showBtn"
          onClick={() =>
            setShowPassword(!showPassword)
          }
        >

          {showPassword
            ? "Hide Password"
            : "Show Password"}

        </button>

        <p className="bottomText">

          Already have an account?

          <Link to="/login">

            Login

          </Link>

        </p>

      </div>

    </div>
  );
}

export default Signup;