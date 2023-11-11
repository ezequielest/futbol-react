import { Outlet } from "react-router-dom";
import Sidebar from '../sidebar/sidebar';
import { Link } from "react-router-dom";
import './layout.scss'
import appVersion from "/src/core/config";

function Layout() {
    const closeNave = () => {
        $(".navbar-toggler").click();
    }
    return (<>
            <nav className="navbar  bg-primary" >
                <div className="container-fluid">
                    <div className="sidebar-brand-text text-gray-100 mx-3"><strong>LA CANCHA <sup>{ appVersion }</sup></strong></div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <div className="offcanvas bg-primary offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header">
                        <div className="sidebar-brand-text text-gray-100 mx-3"><strong>LA CANCHA <sup>2.0.0</sup></strong></div>
                        <i className="fa-solid fa-xmark btn-close" onClick={closeNave}></i>
                    </div>
                    <div className="offcanvas-body">
                        <form className="d-flex mt-3" role="search">
                        <ul className="nav me-auto mb-2 mb-lg-0 mx-4 dropdown-menu-dark" onClick={closeNave}>
                            <li className="nav-item">
                                <Link className="nav-link text-gray-100" to="/next-team">EQUIPO DEL PROXIMO PARTIDO</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-gray-100" to="/build-team">ARMAR EQUIPOS</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-gray-100" to="/admin-players">ADMINISTRAR JUGADORES</Link>
                            </li>
                        </ul>
                        </form>
                    </div>
                    </div>
                </div>
                </nav>


            <div className='layout-container'>
                {/*<div className='sidebar-container'>
                    <Sidebar/>
                </div>*/}
                <div className='pages-container'>
                <Outlet />
                </div>
            </div>

            {/* Footer */}
            <footer className="sticky-footer bg-primary text-gray-100">
                <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                        <span>El lunes a la cancha &copy;</span>
                    </div>
                </div>
            </footer>
            {/* End of Footer */}
            </>
    )
}

export default Layout
