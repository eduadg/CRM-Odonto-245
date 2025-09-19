import { Bell, ChevronDown, LogOut, Menu, Settings, User } from "lucide-react";
import React from "react";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  setSidebarOpen,
  userMenuOpen,
  setUserMenuOpen,
}) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
          <Menu size={20} />
        </button>
        <div className="header-title">
          <h1>Dashboard</h1>
          <p>Bem-vindo de volta, Dr. João Santos</p>
        </div>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-menu">
          <button
            className="user-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="user-avatar">
              <User size={16} />
            </div>
            <span>Dr. João Santos</span>
            <ChevronDown size={16} />
          </button>

          {userMenuOpen && (
            <div className="user-dropdown">
              <a href="#" className="dropdown-item">
                <User size={16} />
                <span>Perfil</span>
              </a>
              <a href="#" className="dropdown-item">
                <Settings size={16} />
                <span>Configurações</span>
              </a>
              <hr className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <LogOut size={16} />
                <span>Sair</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
