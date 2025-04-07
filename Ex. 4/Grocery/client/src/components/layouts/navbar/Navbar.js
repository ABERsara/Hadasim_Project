
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { useSendLogoutMutation } from "../../../app/auth/authApiSlice";
import { MdLogout, MdDensityMedium, MdEmojiPeople, MdFace, MdOutlinePermIdentity, MdOutlineSearch } from "react-icons/md";
import "./navbar.css"
import Login from '../../features/supplier/login-register/SupplierLogin';
import Register from '../../features/supplier/login-register/SupplierRegistration';

const Navbar = () => {

  const [logout, { isSuccess: isLogoutSuccess }] = useSendLogoutMutation()
  const navigate = useNavigate();
  const location = useLocation();
  const {companyName } = useAuth();
 
//   const [currentImage, setCurrentImage] = useState( `http://localhost:2024/public/uploads${image}` : "/account.png")

const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
  };
  const isHomePage = location.pathname === "/";

  
  const logoutClick = () => {
    console.log("logout")
    logout()
  }
  
  

  useEffect(() => {
    if (isLogoutSuccess) {
      navigate("/")
    }

  }, [isLogoutSuccess])

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };



  
  return (
      <div className="navbarBox">
          <img className="iphone-menu" src="/menu.svg" onClick={toggleMenu} />
          
          {isMenuOpen && (
              <div className="navbar-under-homepage">
                  <NavLink  className={(isActive) => isActive ? "active-navlink-nav" : ""}>אודות</NavLink>
                  <NavLink  className={(isActive) => isActive ? "active-navlink-nav" : ""}>אסטרולוגיה</NavLink>
                  <NavLink  className={(isActive) => isActive ? "active-navlink-nav" : ""}>אבחונים</NavLink>
                  <NavLink  className={(isActive) => isActive ? "active-navlink-nav" : ""}>מה אומרים עלינו?</NavLink>
                  <NavLink  className={(isActive) => isActive ? "active-navlink-nav" : ""}>קורסים</NavLink>
                  <button onClick={() => scrollToSection("contact-section")}>יצירת קשר</button>
              </div>
          )}
      <div className="navbar-top-homepage">
        {companyName?
          <div className="nav-hello">
            <img
              className="account-profile"
              alt="תצוגת משתמש"
              src="/account-white.png"
            />
            היי {companyName}! </div>
          : <><Login />
            <Register /></>}
         <img alt="" src="/shopping-cart.png" className="shopping-cart-home" />
        <img alt="" src="/heart.png" className="heart-home"  />

        {!isHomePage && (
          <button className="logout-button" onClick={logoutClick}>
            <MdLogout />
            יציאה
          </button>
        )}

      </div>
      <div className="navbar-under-homepage">
        <img className="logo-homepage" src="/market-logo.png" />
        <NavLink to="/dash/about" className={(isActive) => isActive ? "active-navlink-nav" : ""}>אודות</NavLink>
                  <NavLink  className={(isActive) => isActive ? "active-navlink-nav" : ""}>המוצרים שלנו</NavLink>
                  <NavLink  className={(isActive) => isActive ? "active-navlink-nav" : ""}>מה אומרים עלינו?</NavLink>
                  <button onClick={() => scrollToSection("contact-section")}>יצירת קשר</button>
      </div>


    </div>

  );
};

export default Navbar;
