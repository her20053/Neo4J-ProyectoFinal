import FreshookLogo from '../assets/images/freshook_logo.png';
import { useState } from 'react';

export default function HeaderAppComponent({ correo_electronico_param, onMenuItemClick }) {
    const [activeItem, setActiveItem] = useState("POSTS");

    const handleMenuItemClick = (item) => {
        setActiveItem(item);
        onMenuItemClick(item);
    };

    const handleLogoutClick = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/usuarios/eliminar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    correo_electronico: correo_electronico_param
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(correo_electronico_param);
            console.log(data);
            // Aquí puedes manejar la respuesta. Por ejemplo, puedes redirigir al usuario a la página de login.
            window.location.reload();

        } catch (error) {
            console.error('Error:', error);
            // Aquí puedes manejar el error. Por ejemplo, puedes mostrar un mensaje al usuario.
        }
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
                <a className="sidebar__logout menu-button" onClick={handleLogoutClick}>
                    <i className="fa fa-sign-out-alt"></i>
                </a>
            </div>
        </header>
    );
}
