import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/profile.css";
function Profile() {

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    profileImage: "",
    wallet: 0,
    winning: 0,
    rank: 0,
    referralCode: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://127.0.0.1:5000/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData(res.data.user);

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://127.0.0.1:5000/api/auth/profile",
        {
          fullName: formData.fullName,
          mobile: formData.mobile,
          profileImage: formData.profileImage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      fetchProfile();

    } catch (err) {

      alert(err.response?.data?.message || "Update Failed");

    }
  };

  return (

    <div className="profilePage">

      <div className="profileCard">

        <h2>My Profile</h2>

        <br />

        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
        />

        <br /><br />

        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile Number"
        />

        <br /><br />

        <input
          type="email"
          value={formData.email}
          readOnly
        />

        <br /><br />

        <input
          type="text"
          name="profileImage"
          value={formData.profileImage}
          onChange={handleChange}
          placeholder="Profile Image URL"
        />

        <br /><br />

        <h3>Wallet : ₹{formData.wallet}</h3>

        <h3>Winning : ₹{formData.winning}</h3>

        <h3>Rank : #{formData.rank}</h3>

        <h3>Referral Code : {formData.referralCode}</h3>

        <br />

        <button onClick={updateProfile}>
          Save Changes
        </button>

      </div>

    </div>

  );

}

export default Profile;