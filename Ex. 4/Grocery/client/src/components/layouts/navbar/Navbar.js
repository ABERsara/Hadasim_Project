
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
 
//   const [currentImage, setCurrentImage] = useState(image ? `http://localhost:2024/public/uploads${image}` : "/noavatar.png")

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
                  <NavLink to="/dash/about" className={(isActive) => isActive ? "active-navlink-nav" : ""}>אודות</NavLink>
                  <NavLink to="/dash/astro" className={(isActive) => isActive ? "active-navlink-nav" : ""}>אסטרולוגיה</NavLink>
                  <NavLink to="/dash/diagnosis" className={(isActive) => isActive ? "active-navlink-nav" : ""}>אבחונים</NavLink>
                  <NavLink to="/dash/reviews" className={(isActive) => isActive ? "active-navlink-nav" : ""}>מה אומרים עלינו?</NavLink>
                  <NavLink to="/dash/courses" className={(isActive) => isActive ? "active-navlink-nav" : ""}>קורסים</NavLink>
                  <button onClick={() => scrollToSection("contact-section")}>יצירת קשר</button>
                  {/* הוסף כאן אפשרויות נוספות אם צריך */}
              </div>
          )}
      <div className="navbar-top-homepage">
        {companyName?
          <div className="nav-hello">
            {/* <img
              className="account-profile"
              alt=""
              src={getFilePath(currentImage ? currentImage : image)}
              onClick={() => navigate("/dash/user/editProfile")} 
            /> */}
            היי {companyName}! </div>
          : <><Login />
            <Register /></>}
         <img alt="" src="assets/shopping-cart.png" className="shopping-cart-home" />
        <img alt="" src="assets/heart.png" className="heart-home"  />

        {/* הצגת כפתור היציאה רק אם המשתמש לא נמצא בדף הבית */}
        {!isHomePage && (
          <button className="logout-button" onClick={logoutClick}>
            <MdLogout />
            יציאה
          </button>
        )}

      </div>
      <div className="navbar-under-homepage">
        <img className="logo-homepage" src="assets/market-logo.png" />
        <NavLink to="/dash/about" className={(isActive) => isActive ? "active-navlink-nav" : ""}>אודות</NavLink>
                  <NavLink  className={(isActive) => isActive ? "active-navlink-nav" : ""}>המוצרים שלנו</NavLink>
                  <NavLink  className={(isActive) => isActive ? "active-navlink-nav" : ""}>מה אומרים עלינו?</NavLink>
                  {/* <NavLink to="" className={(isActive) => isActive ? "active-navlink-nav" : ""}></NavLink> */}
                  <button onClick={() => scrollToSection("contact-section")}>יצירת קשר</button>
      </div>


    </div>

  );
};

export default Navbar;
