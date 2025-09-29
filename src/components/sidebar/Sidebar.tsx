import { ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  sidebarItems: {
    icon: React.ElementType;
    label: string;
    href: string;
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarExpanded,
  setSidebarExpanded,
  sidebarItems,
}) => {
  const location = useLocation();

  return (
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""} ${sidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      <div className="sidebar-header">
        <div className="brand">
          <div className="logo-circle">CR</div>
          {sidebarExpanded && (
            <div className="brand-text">
              <h2>CRM Odonto</h2>
              <p>Dashboard</p>
            </div>
          )}
        </div>
        <div className="sidebar-controls">
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            title={sidebarExpanded ? "Contrair sidebar" : "Expandir sidebar"}
          >
            {sidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
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
              title={!sidebarExpanded ? item.label : ""}
            >
              <item.icon size={20} />
              {sidebarExpanded && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" title={!sidebarExpanded ? "Sair" : ""}>
          <LogOut size={16} />
          {sidebarExpanded && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;








