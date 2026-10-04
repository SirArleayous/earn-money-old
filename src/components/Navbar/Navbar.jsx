import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { ThemeContext } from "../../context/ThemeContext";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import Logo from "../../assets/logo.png";
import coinNav from "../../assets/coinNav.png";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Navbar = () => {
  const { user, userSignOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogoutUser = () => {
    userSignOut().then(() => {
      navigate("/login");
    });
  };

  const { data: UserCoin = {} } = useQuery({
    queryKey: ["UserCoin", user?.email],
    queryFn: async () => {
      if (!user?.email) return {};
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/userCoin/${user?.email}`
      );
      return data || {};
    },
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const commonLinks = (
    <>
      <NavLink to="/" className="font-semibold hover:text-[#00d7c0]">
        Home
      </NavLink>

      <NavLink to="/about" className="hover:text-[#00d7c0] font-semibold">
        About
      </NavLink>

      <NavLink to="/contact" className="hover:text-[#00d7c0] font-semibold">
        Contact
      </NavLink>

      {user && (
        <NavLink
          to="/dashboard"
          className="hover:text-[#00d7c0] font-semibold"
        >
          Dashboard
        </NavLink>
      )}
    </>
  );

  const authLinks = user ? (
    <div className="flex items-center gap-3">
      <img
        className="w-10 h-10 rounded-full object-cover"
        src={user?.photoURL || 'https://i.ibb.co/mR40Bmy/user.png'}
        alt="User Profile"
        referrerPolicy="no-referrer"
      />
      <div className="flex items-center gap-1">
        <img src={coinNav} className="w-5 h-5 object-contain" alt="Wallet" />
        <span className="font-semibold">{UserCoin?.coin || 0} Wallet Balance</span>
      </div>
      <button
        onClick={handleLogoutUser}
        className="btn btn-sm btn-ghost hover:text-[#00d7c0]"
      >
        Logout
      </button>
    </div>
  ) : (
    <>
      <NavLink to="/login" className="font-semibold hover:text-[#00d7c0]">
        Login
      </NavLink>
      <NavLink
        to="/register"
        className="btn btn-sm bg-[#00d7c0] text-white border-none hover:bg-[#00bfa8]"
      >
        Register
      </NavLink>
    </>
  );

  return (
    <div className="fixed z-20 w-full backdrop-blur">
      <div className="w-11/12 py-6 mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo & Brand Name */}
          <NavLink to="/" className="flex gap-3 items-center">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={Logo}
              alt="SINEX Logo"
            />
            <h2 className="text-3xl font-bold tracking-wide">SINEX</h2>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center gap-6">
            {commonLinks}
            {authLinks}
            <button onClick={toggleTheme} className="focus:outline-none">
              {theme === "dark" ? <FaSun size={24} /> : <FaMoon size={24} />}
            </button>
            <a
              href="https://github.com/walid-official"
              target="_blank"
              rel="noopener noreferrer"
              className="btn rounded-md bg-[#00d7c0] hover:bg-[#00bfa8] text-white border-none"
            >
              Developer Hub
            </a>
          </div>

          {/* Mobile Toggle Button */}
          <div className="lg:hidden space-x-3 flex items-center">
            <button onClick={toggleTheme} className="focus:outline-none">
              {theme === "dark" ? <FaSun size={24} /> : <FaMoon size={24} />}
            </button>
            <button onClick={toggleMobileMenu} className="focus:outline-none">
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4">
            <div className="flex flex-col gap-4 p-6 rounded-lg shadow-lg bg-base-100">
              {commonLinks}
              {authLinks}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;