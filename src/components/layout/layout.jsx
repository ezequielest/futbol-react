import { Outlet } from "react-router-dom";
import Sidebar from '../sidebar/sidebar';
import { Link } from "react-router-dom";
import './layout.scss'

function Layout() {
    return (<>        


            <nav class="navbar  bg-primary">
                <div class="container-fluid">
                    <div className="sidebar-brand-text text-gray-100 mx-3"><strong>LA CANCHA <sup>2.0.0</sup></strong></div>
                    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="offcanvas bg-primary offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div class="offcanvas-header">
                        <div className="sidebar-brand-text text-gray-100 mx-3"><strong>LA CANCHA <sup>2.0.0</sup></strong></div>
                        <button type="button" className="btn-close text-gray-100" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <form class="d-flex mt-3" role="search">
                        <ul className="nav me-auto mb-2 mb-lg-0 mx-4 dropdown-menu-dark">
                            <li className="nav-item">
                                <Link className="nav-link text-gray-100" to="/">ARMAR EQUIPOS</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-gray-100" to="admin-players">ADMINISTRAR JUGADORES</Link>
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
            <footer className="sticky-footer bg-white">
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