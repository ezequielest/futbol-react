import { Link } from "react-router-dom";

function Sidebar() {
    return (<>       
            <ul className="navbar-nav bg-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                <a className="sidebar-brand d-flex align-items-center justify-content-center">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-futbol"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3">LA CANCHA <sup>2.0.0</sup></div>
                </a>

                <hr className="sidebar-divider my-0" />

                <li className="nav-item active">
                    <Link className="nav-link"  to="/">ARMAR EQUIPOS</Link>
                </li>
                <li className="nav-item active">
                    <Link className="nav-link" to="admin-players">ADMINISTRAR JUGADORES</Link>
                </li>

            <hr className="sidebar-divider"/>
            </ul>
            </>
    )
}

export default Sidebar