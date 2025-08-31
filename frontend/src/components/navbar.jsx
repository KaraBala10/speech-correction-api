/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import kio from "../assets/img/kio.png";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  // const { token } = useParams();
  // const token=localStorage.getItem("token");
  console.log(token);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // Fetch profile data if token exists
    if (storedToken) {
      fetchProfileData(storedToken);
    }
  }, []);

  const fetchProfileData = async (storedToken) => {
    try {
      const response = await fetch("http://localhost:9999/api/profile/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleLogout = () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.warn("No token found. Redirecting to login.");
      navigate("/login");
      return;
    }

    fetch("http://localhost:9999/api/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${storedToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Logout failed");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Logout successful:", data);
        localStorage.removeItem("token");
        setToken(null);
        setProfileData(null);
        setShowProfileDropdown(false);
        navigate("/login");
      })
      .catch((err) => {
        console.error("Logout error:", err);
        localStorage.removeItem("token");
        setToken(null);
        setProfileData(null);
        setShowProfileDropdown(false);
        navigate("/login");
      });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".profile-dropdown")) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "bg-cyber-950/95 backdrop-blur-xl shadow-neon-blue border-b border-neon-blue/20"
          : "bg-cyber-950/80 backdrop-blur-lg"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <img
              src={kio}
              alt="Logo"
              className="w-38 h-14 rounded-xl shadow-neon-blue group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-neon rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
          {/* <span className="text-2xl font-bold gradient-text tracking-wide">
            Sayar
          </span> */}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-8 text-cyber-200 font-medium text-base">
          {!token ? (
            <Link
              to="/"
              className="relative group hover:text-neon-blue transition-all duration-300"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-neon group-hover:w-full transition-all duration-300"></span>
            </Link>
          ) : (
            <Link
              to={`/landing`}
              className="relative group hover:text-neon-blue transition-all duration-300"
            >
              Lessons
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-neon group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}
          <Link
            to={`/about`}
            className="relative group hover:text-neon-blue transition-all duration-300"
          >
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-neon group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to={`/contact`}
            className="relative group hover:text-neon-blue transition-all duration-300"
          >
            Contact Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-neon group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to={`/support`}
            className="relative group hover:text-neon-blue transition-all duration-300"
          >
            AI Support
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-neon group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        {/* Right Side - Auth or Profile Dropdown */}
        <div className="flex items-center space-x-4">
          {!token ? (
            <>
              <Link to="/login" className="btn-outline text-sm px-4 py-2">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative profile-dropdown">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-2 rounded-full bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30 transition-all duration-300 hover-scale border border-neon-blue/30"
              >
                {profileData?.profile?.profile_picture ? (
                  <>
                    <img
                      src={profileData.profile.profile_picture}
                      alt="Profile"
                      className="w-8 h-8 object-cover border-2 border-neon-blue/50"
                      style={{
                        clipPath:
                          "polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)",
                      }}
                    />
                    <p className="text-white font-semibold text-sm">
                      {profileData?.user?.username || "User"}
                    </p>
                  </>
                ) : (
                  <FiUser className="w-5 h-5" />
                )}
                <FiChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    showProfileDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-cyber-900/95 backdrop-blur-xl border border-neon-blue/20 rounded-2xl shadow-neon-blue overflow-hidden animate-fade-in-down">
                  <div className="p-4 border-b border-neon-blue/20">
                    <div className="flex items-center space-x-3">
                      {profileData?.profile?.profile_picture ? (
                        <img
                          src={profileData.profile.profile_picture}
                          alt="Profile"
                          className="w-10 h-10 object-cover border-2 border-neon-blue/50"
                          style={{
                            clipPath:
                              "polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)",
                          }}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 bg-neon-blue/20 flex items-center justify-center"
                          style={{
                            clipPath:
                              "polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)",
                          }}
                        >
                          <FiUser className="w-5 h-5 text-neon-blue" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {profileData?.user?.username || "User"}
                        </p>
                        <p className="text-cyber-300 text-xs">
                          {profileData?.user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/MyProfile"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-cyber-200 hover:text-white hover:bg-neon-blue/10 rounded-xl transition-all duration-300"
                    >
                      <FiUser className="w-4 h-4" />
                      <span className="text-sm">My Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        handleLogout();
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-neon-pink hover:text-white hover:bg-neon-pink/10 rounded-xl transition-all duration-300"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="lg:hidden p-2 rounded-lg bg-cyber-800/50 text-cyber-200 hover:bg-cyber-700/50 transition-all duration-300 focus-ring border border-cyber-700/50"
        >
          {navbarOpen ? (
            <FiX className="text-2xl" />
          ) : (
            <FiMenu className="text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu Content */}
      <div
        className={`lg:hidden transition-all duration-500 ease-out overflow-hidden ${
          navbarOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-cyber-950/95 backdrop-blur-xl border-t border-neon-blue/20 px-4 pb-6 pt-4">
          <div className="flex flex-col space-y-4 text-cyber-200 font-medium text-base">
            {!token ? (
              <Link
                to="/"
                className="py-2 px-4 rounded-lg hover:bg-neon-blue/10 hover:text-neon-blue transition-all duration-300"
                onClick={() => setNavbarOpen(false)}
              >
                Home
              </Link>
            ) : (
              <Link
                to={`/landing}`}
                className="py-2 px-4 rounded-lg hover:bg-neon-blue/10 hover:text-neon-blue transition-all duration-300"
                onClick={() => setNavbarOpen(false)}
              >
                Lessons
              </Link>
            )}
            {token && (
              <Link
                to={`/MyProfile}`}
                className="py-2 px-4 rounded-lg hover:bg-neon-blue/10 hover:text-neon-blue transition-all duration-300"
                onClick={() => setNavbarOpen(false)}
              >
                Profile
              </Link>
            )}
            <Link
              to={`/about`}
              className="py-2 px-4 rounded-lg hover:bg-neon-blue/10 hover:text-neon-blue transition-all duration-300"
              onClick={() => setNavbarOpen(false)}
            >
              About Us
            </Link>
            <Link
              to={`/contact`}
              className="py-2 px-4 rounded-lg hover:bg-neon-blue/10 hover:text-neon-blue transition-all duration-300"
              onClick={() => setNavbarOpen(false)}
            >
              Contact Us
            </Link>

            <div className="pt-4 border-t border-neon-blue/20">
              {!token ? (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="btn-outline text-center"
                    onClick={() => setNavbarOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-center"
                    onClick={() => setNavbarOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setNavbarOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-neon-pink border border-neon-pink px-4 py-3 rounded-xl hover:bg-neon-pink/10 transition-all duration-300"
                >
                  <FiLogOut className="w-4 h-4" />
                  Log out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
