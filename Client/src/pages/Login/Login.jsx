import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGamepad } from "react-icons/fa";
import api from "../../services/api";
import "./Login.css";
import toast from "react-hot-toast";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

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

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", formData);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    toast.success("Login Successful 🎉");

    navigate("/dashboard");
  } catch (error) {
    toast.error(error.response?.data?.message || "Login Failed");
  }
};
  return (
  <div className="login-page">
    <div className="login-overlay">

      <div className="login-card">

        <div className="login-logo">
          <FaGamepad />
          <h1>IndieGamer Hub</h1>
          <p>Welcome Back Gamer 🎮</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <FaEnvelope className="input-icon" />

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

            <FaLock className="input-icon" />

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
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

          </div>

          <div className="login-options">

            <label>

              <input type="checkbox" />

              Remember Me

            </label>

            <Link to="#">Forgot Password?</Link>

          </div>

          <button className="login-btn" type="submit">
            Login
          </button>

        </form>

        <p className="register-link">
          Don't have an account?

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  </div>
);
      
}

export default Login;