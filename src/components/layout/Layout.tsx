import {
  Calendar,
  DollarSign,
  FileText,
  Home,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";

interface PageProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Pacientes", href: "/patients" },
  { icon: Calendar, label: "Agendamentos", href: "/appointments" },
  { icon: Stethoscope, label: "Consultas", href: "/consultations" },
  { icon: FileText, label: "Prontuários", href: "/records" },
  { icon: DollarSign, label: "Financeiro", href: "/financial" },
  { icon: Settings, label: "Configurações", href: "/settings" },
];

const Page: React.FC<PageProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <main className="dashboard">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarItems={sidebarItems}
      />

      <main className="main-content">
        <Header
          setSidebarOpen={setSidebarOpen}
          userMenuOpen={userMenuOpen}
          setUserMenuOpen={setUserMenuOpen}
        />

        <div className="page-content">{children}</div>
      </main>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </main>
  );
};

export default Page;
