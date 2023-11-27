import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/nav.css"; // CSS file for styling

const Nav = () => {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = (route) => {
        navigate(route);
        toggleMenu(); // Close the menu after navigation
    };

    const toggleMenu = () => {
        setShowMenu((prevState) => !prevState);
    };

    return (
        <div className="page-container">
            <div className={`menu ${showMenu ? "active" : ""}`}>
                <button className="hamburger-menu" onClick={toggleMenu}>
                    <svg viewBox="0 0 100 80" width="40" height="40">
                        <rect width="100" height="20"></rect>
                        <rect y="30" width="100" height="20"></rect>
                        <rect y="60" width="100" height="20"></rect>
                    </svg>
                </button>
                <div className={`menu-content ${showMenu ? "show" : ""}`}>
                    <button className="text-button" onClick={() => handleNavigation("/main")}>Home</button>
                    <button className="text-button" onClick={() => handleNavigation("/parts")}>Parts</button>
                    <button className="text-button" onClick={() => handleNavigation("/workstation")}>Workstation</button>
                    <button className="text-button" onClick={() => handleNavigation("/process")}>Process</button>
					<button className="text-button" onClick={ () => handleNavigation("/logout")}>Logout</button>
				</div>
            </div>
            <div className={`overlay ${showMenu ? "show" : ""}`} onClick={toggleMenu}></div>
        </div>
    );
};

export default Nav;
