import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGamepad,
} from "react-icons/fa";
import api from "../../services/api";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  role: "gamer",
});
const [showPassword, setShowPassword] = useState(false);
const [confirmPassword, setConfirmPassword] = useState("");

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async (e) => {
    if (formData.password !== confirmPassword) {
  toast.error("Passwords do not match");
  return;
}
  e.preventDefault();

  try {
    const res = await api.post("/auth/register", formData);
toast.success("Account Created Successfully 🎉");

    navigate("/login");
  } catch (error) {
    toast.error(error.response?.data?.message || "Registration Failed");
  }
};
 return (
  <div className="register-page">
    <div className="register-overlay">

      <div className="register-card">

        <div className="register-logo">
          <FaGamepad />
          <h1>IndieGamer Hub</h1>
          <p>Create your gaming account 🎮</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <FaUser className="input-icon"/>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon"/>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">

            <FaLock className="input-icon"/>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </span>

          </div>

          <div className="input-group">

            <FaLock className="input-icon"/>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
            />

          </div>

          <select
            className="role-select"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="gamer">🎮 Gamer</option>
            <option value="developer">💻 Developer</option>
          </select>

          <button className="register-btn" type="submit">
            Create Account
          </button>

        </form>

        <p className="login-link">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  </div>
);
  
}

export default Register;