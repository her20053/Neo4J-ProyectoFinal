
import FreshookLogo from '../assets/images/freshook_logo.png';

export default function HeaderAppComponent() {
    return (
        <header className="fb-section sidebar">
            <div className="fixed-panel sidebar-wrapper">
                <img src={FreshookLogo} alt="Logo" className="sidebar__logo" />
                <nav className="sidebar__menu">
                    <ul className="sidebar__menu__list">
                        <li className="sidebar__menu__list__item">
                            <a className="menu-button active new-content">
                                <strong> Home </strong>
                            </a>
                        </li>
                        <li className="sidebar__menu__list__item">
                            <a className="menu-button"><i className="fa fa-layer-group"></i></a>
                        </li>
                        <li className="sidebar__menu__list__item">
                            <a className="menu-button"><i className="fab fa-youtube"></i></a>
                        </li>
                        <li className="sidebar__menu__list__item">
                            <a className="menu-button"><i className="fa fa-store-alt"></i></a>
                        </li>
                        <li className="sidebar__menu__list__item">
                            <a className="menu-button"><i className="fa fa-user-friends"></i></a>
                        </li>
                    </ul>
                </nav>
                <a className="sidebar__logout menu-button">
                    <i className="fa fa-sign-out-alt"></i>
                </a>
            </div>
        </header>
    )
}