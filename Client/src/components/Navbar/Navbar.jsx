import { Link } from "react-router-dom";
import { FaGamepad, FaSearch, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">

      <div className="logo">
        <FaGamepad />
        <span>IndieGamer Hub</span>
      </div>

      <nav>
  <Link to="/">Home</Link>

  <Link to="/games">Browse</Link>

  <Link to="/developer">Developer</Link>

  <Link to="/my-games">My Games</Link>

  <Link to="/dashboard">Dashboard</Link>
</nav>

      <div className="search-box">

        <FaSearch className="search-icon"/>

        <input
          type="text"
          placeholder="Search Games..."
        />

      </div>

      <div className="nav-buttons">

        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/register" className="register-btn">
          Register
        </Link>

        <FaUserCircle className="profile-icon"/>

      </div>

    </header>
  );
}

export default Navbar;