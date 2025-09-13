import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const modules = [
    { name: 'Dashboard', path: '/' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Product Management', path: '/products' },
    { name: 'Sales', path: '/sales' },
    { name: 'Reporting', path: '/reporting' }
  ];

  return (
    <header className="header" style={{ position: 'relative', padding: '10px 20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      
      {/* Navbar Links */}
      <nav className="header-nav" style={{ textAlign: 'center', width: '100%' }}>
        {modules.map((mod) => (
          <NavLink
            key={mod.path}
            to={mod.path}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            style={{ margin: '0 15px', display: 'inline-block', textDecoration: 'none', color: '#333', fontWeight: '500' }}
          >
            {mod.name}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="user-info" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>Welcome, Admin</span>
        <div className="user-avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#85586F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
      </div>
    </header>
  );
};

export default Header;
