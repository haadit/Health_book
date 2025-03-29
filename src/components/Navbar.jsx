import { useState } from "react";
import LoginModal from "./auth/LoginModal";
import SignupModal from "./auth/SignupModal";

function Navbar({ currentPage, setCurrentPage }) {
  const [authModal, setAuthModal] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    // Check if user data exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
          name: payload.name,
          email: payload.email,
          role: payload.role,
        };
      } catch (err) {
        localStorage.removeItem("token");
        return null;
      }
    }
    return null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthModal(null);
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setAuthModal(null);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    if (currentPage === "dashboard") {
      setCurrentPage("home");
    }
  };

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: "#f5f7fa",
      }}
    >
      <div className="logo" onClick={() => setCurrentPage("home")}>
        <img src="src\assets\logo.svg" alt="Yoku" />
        <h1>Yoku</h1>
      </div>

      <button
        className="mobile-menu-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
        <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
        <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
      </button>

      <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <a
          href="#"
          className={currentPage === "home" ? "active" : ""}
          onClick={() => {
            setCurrentPage("home");
            setIsMenuOpen(false);
          }}
        >
          Home
        </a>
        <a
          href="#"
          className={currentPage === "about" ? "active" : ""}
          onClick={() => {
            setCurrentPage("about");
            setIsMenuOpen(false);
          }}
        >
          About Us
        </a>
        <a
          href="#"
          className={currentPage === "validator" ? "active" : ""}
          onClick={() => {
            setCurrentPage("validator");
            setIsMenuOpen(false);
          }}
        >
          Pose Validator
        </a>
        <a
          href="#"
          className={currentPage === "library" ? "active" : ""}
          onClick={() => {
            setCurrentPage("library");
            setIsMenuOpen(false);
          }}
        >
          Pose Library
        </a>
        <a
          href="#"
          className={currentPage === "anxiety" ? "active" : ""}
          onClick={() => {
            setCurrentPage("anxiety");
            setIsMenuOpen(false);
          }}
        >
          Anxiety Detection
        </a>
        <a
          href="#"
          className={currentPage === "meditation" ? "active" : ""}
          onClick={() => {
            setCurrentPage("meditation");
            setIsMenuOpen(false);
          }}
        >
          Meditation Guide
        </a>
        <a
          href="#"
          className={currentPage === "funding" ? "active" : ""}
          onClick={() => {
            setCurrentPage("funding");
            setIsMenuOpen(false);
          }}
        >
          Funding
        </a>
        {user && (
          <a
            href="#"
            className={currentPage === "dashboard" ? "active" : ""}
            onClick={() => {
              setCurrentPage("dashboard");
              setIsMenuOpen(false);
            }}
          >
            Progress Dashboard
          </a>
        )}

        {user ? (
          <div className="user-menu">
            <span className="user-name">Welcome, {user.name}</span>
            <button className="auth-button" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        ) : (
          <button className="auth-button" onClick={() => setAuthModal("login")}>
            Sign In
          </button>
        )}
      </div>

      {authModal === "login" && (
        <LoginModal
          onClose={() => setAuthModal(null)}
          onSwitch={setAuthModal}
          onLogin={handleLogin}
        />
      )}
      {authModal === "signup" && (
        <SignupModal
          onClose={() => setAuthModal(null)}
          onSwitch={setAuthModal}
          onSignup={handleSignup}
        />
      )}
    </nav>
  );
}

export default Navbar;
