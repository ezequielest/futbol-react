function Sidebar() {
    return (<>
    
            <ul className="navbar-nav bg-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-futbol"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3">LA CANCHA <sup>1.1.0</sup></div>
                </a>

                <hr className="sidebar-divider my-0" />

                <li className="nav-item active">
                    <a className="nav-link" href="index.html">
                        <span>ARMAR EQUIPOS</span></a>
                </li>

            <hr className="sidebar-divider"/>
            </ul>
            </>
        
    )


}

export default Sidebar