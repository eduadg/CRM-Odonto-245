import { LogOut, X } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarItems: {
    icon: React.ElementType;
    label: string;
    href: string;
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarItems,
}) => {
  const location = useLocation();

  return (
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <div className="brand">
          <div className="logo-circle">CR</div>
          <div className="brand-text">
            <h2>CRM Odonto</h2>
            <p>Dashboard</p>
          </div>
        </div>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {sidebarItems.map((item, index) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={index}
              to={item.href}
              className={`nav-item ${isActive ? "nav-item-active" : ""}`}
              onClick={() => setSidebarOpen(false)} // fecha sidebar em mobile
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
