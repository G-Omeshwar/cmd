import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <i className="bi bi-diagram-3"></i> ERP CRM Portal
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle"></i> {user?.name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <span className="dropdown-item-text">Role: {user?.role}</span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-2 sidebar">
            <div className="nav flex-column nav-pills mt-3">
              <a
                className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
                href="/"
              >
                <i className="bi bi-house-door"></i> Dashboard
              </a>
              <a
                className={`nav-link ${isActive('/customers') ? 'active' : ''}`}
                href="/customers"
              >
                <i className="bi bi-people"></i> Customers
              </a>
              <a
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                href="/products"
              >
                <i className="bi bi-box"></i> Products
              </a>
              <a
                className={`nav-link ${isActive('/challans') ? 'active' : ''}`}
                href="/challans"
              >
                <i className="bi bi-receipt"></i> Challans
              </a>
              <a
                className={`nav-link ${isActive('/inventory') ? 'active' : ''}`}
                href="/inventory"
              >
                <i className="bi bi-box2"></i> Inventory
              </a>
            </div>
          </nav>

          {/* Main Content */}
          <main className="col-md-10 ms-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
