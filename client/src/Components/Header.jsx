import FreshookLogo from '../assets/images/freshook_logo.png';
import { useState } from 'react';

export default function HeaderAppComponent({ correo_electronico, onMenuItemClick }) {
    const [activeItem, setActiveItem] = useState("POSTS");

    const handleMenuItemClick = (item) => {
        setActiveItem(item);
        onMenuItemClick(item);
    };

    return (
        <header className="fb-section sidebar">
            <div className="fixed-panel sidebar-wrapper">
                <img src={FreshookLogo} alt="Logo" className="sidebar__logo" />
                <nav className="sidebar__menu">
                    <ul className="sidebar__menu__list">
                        <li className={`sidebar__menu__list__item ${activeItem === "POSTS" ? "active" : ""}`}>
                            <a className="menu-button" onClick={() => handleMenuItemClick("POSTS")}>
                                <strong> POSTS </strong>
                            </a>
                        </li>
                        <li className={`sidebar__menu__list__item ${activeItem === "EVENTOS" ? "active" : ""}`}>
                            <a className="menu-button" onClick={() => handleMenuItemClick("EVENTS")}>
                                <i className="fa fa-calendar-alt"></i>
                            </a>
                        </li>
                        <li className={`sidebar__menu__list__item ${activeItem === "GRUPOS" ? "active" : ""}`}>
                            <a className="menu-button" onClick={() => handleMenuItemClick("GRUPOS")}>
                                <i className="fa fa-users"></i>
                            </a>
                        </li>
                    </ul>
                </nav>
                <a className="sidebar__logout menu-button">
                    <i className="fa fa-sign-out-alt"></i>
                </a>
            </div>
        </header>
    );
}
