"use client";

import {
  AlertCircle,
  Bell,
  Calendar,
  CalendarIcon,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Edit,
  FileText,
  Filter,
  Home,
  LogOut,
  Mail,
  Menu,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Settings,
  Stethoscope,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppointmentCalendar } from "../components/appointments/AppointmentCalendar";
import { AppointmentModal } from "../components/appointments/AppointmentModal";
import { appointmentService } from "../services/appointmentService";
import type { Appointment } from "../types/appointment";
import "./Appointments.css";

type AppointmentsProps = {};

export const Appointments: React.FC<AppointmentsProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // 'list' ou 'calendar'
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    today: 0,
    thisWeek: 0,
    confirmationRate: 0,
  });

  useEffect(() => {
    loadAppointments();
    loadStats();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await appointmentService.getAppointmentStats();
      setStats(statsData);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={16} className="status-confirmed" />;
      case "pending":
        return <Clock size={16} className="status-pending" />;
      case "cancelled":
        return <AlertCircle size={16} className="status-cancelled" />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.dentist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" || appointment.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const dynamicStats = [
    {
      title: "Total de Agendamentos",
      value: stats.total.toString(),
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Confirmados Hoje",
      value: stats.today.toString(),
      change: "+12%",
      trend: "up",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Pendentes",
      value: stats.pending.toString(),
      change: "-5%",
      trend: "down",
      icon: Clock,
      color: "orange",
    },
    {
      title: "Taxa de Confirmação",
      value: `${stats.confirmationRate}%`,
      change: "+3%",
      trend: "up",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  const handleSaveAppointment = async (data: any) => {
    try {
      setLoading(true);
      await appointmentService.createAppointment(data);
      await loadAppointments();
      await loadStats();
      setIsModalOpen(false);
      console.log("Agendamento criado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar agendamento:", error);
      alert(error.message || "Erro ao criar agendamento");
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    console.log("Agendamento clicado:", appointment);
    // Aqui você pode abrir um modal de detalhes ou edição
  };

  const handleAppointmentAction = async (
    action: string,
    appointmentId: string
  ) => {
    try {
      setLoading(true);

      switch (action) {
        case "edit":
          // Implementar edição
          console.log("Editar agendamento:", appointmentId);
          break;
        case "cancel":
          await appointmentService.updateAppointment(appointmentId, {
            status: "cancelado",
          });
          await loadAppointments();
          await loadStats();
          break;
        case "delete":
          if (confirm("Tem certeza que deseja excluir este agendamento?")) {
            await appointmentService.deleteAppointment(appointmentId);
            await loadAppointments();
            await loadStats();
          }
          break;
      }
    } catch (error: any) {
      console.error("Erro na ação:", error);
      alert(error.message || "Erro ao executar ação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointments">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="logo-circle">CR</div>
            <div className="brand-text">
              <h2>CRM Odonto</h2>
              <p>Agendamentos</p>
            </div>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {[
            {
              icon: Home,
              label: "Dashboard",
              active: false,
              href: "/dashboard",
            },
            {
              icon: Users,
              label: "Pacientes",
              active: false,
              href: "/patients",
            },
            {
              icon: Calendar,
              label: "Agendamentos",
              active: true,
              href: "/appointments",
            },
            {
              icon: Stethoscope,
              label: "Consultas",
              active: false,
              href: "/consultations",
            },
            {
              icon: FileText,
              label: "Prontuários",
              active: false,
              href: "/records",
            },
            {
              icon: DollarSign,
              label: "Financeiro",
              active: false,
              href: "/financial",
            },
            {
              icon: Settings,
              label: "Configurações",
              active: false,
              href: "/settings",
            },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`nav-item ${item.active ? "nav-item-active" : ""}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="appointments-header">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="header-title">
              <h1>Agendamentos</h1>
              <p>Gerencie consultas e horários dos seus pacientes</p>
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

        {/* Appointments Content */}
        <div className="appointments-content">
          {/* Stats Grid */}
          <div className="stats-grid">
            {dynamicStats.map((stat, index) => (
              <div key={index} className={`stat-card stat-${stat.color}`}>
                <div className="stat-icon">
                  <stat.icon size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.title}</div>
                  <div
                    className={`stat-change ${
                      stat.trend === "up" ? "stat-up" : "stat-down"
                    }`}
                  >
                    <TrendingUp size={14} />
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="controls-section">
            <div className="controls-left">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar por paciente, médico ou especialidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-select">
                <Filter size={16} />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">Todos os Status</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="pending">Pendentes</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>
            </div>

            <div className="controls-right">
              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <FileText size={16} />
                  <span>Lista</span>
                </button>
                <button
                  className={`view-btn ${
                    viewMode === "calendar" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("calendar")}
                >
                  <CalendarIcon size={16} />
                  <span>Calendário</span>
                </button>
              </div>

              <button
                className="btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={16} />
                <span>Novo Agendamento</span>
              </button>
            </div>
          </div>

          {/* Appointments List */}
          {viewMode === "calendar" ? (
            <div className="calendar-section">
              <AppointmentCalendar
                appointments={appointments}
                onDateSelect={handleDateSelect}
                onAppointmentClick={handleAppointmentClick}
                selectedDate={selectedDate}
              />
            </div>
          ) : (
            <div className="appointments-list">
              <div className="list-header">
                <div className="list-title">
                  <h3>Agendamentos</h3>
                  <span className="appointments-count">
                    {filteredAppointments.length} agendamentos
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="loading-state">
                  <p>Carregando agendamentos...</p>
                </div>
              ) : (
                <div className="appointments-table">
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="appointment-row">
                      <div className="appointment-time">
                        <div className="time-display">
                          <Clock size={16} />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                        <div className="date-display">
                          {appointment.appointmentDate.toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                      </div>

                      <div className="appointment-patient">
                        <div className="patient-info">
                          <h4>{appointment.patientName}</h4>
                          <div className="patient-contact">
                            <Phone size={14} />
                            <span>{appointment.patientPhone}</span>
                          </div>
                          {appointment.patientEmail && (
                            <div className="patient-contact">
                              <Mail size={14} />
                              <span>{appointment.patientEmail}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="appointment-details">
                        <div className="appointment-type">
                          {appointment.service}
                        </div>
                        <div className="appointment-doctor">
                          {appointment.dentist}
                        </div>
                        <div className="appointment-duration">
                          <Clock size={14} />
                          <span>{appointment.duration} min</span>
                        </div>
                      </div>

                      <div className="appointment-priority">
                        <span
                          className={`priority-badge priority-${appointment.priority}`}
                        >
                          {appointment.priority}
                        </span>
                      </div>

                      <div className="appointment-status">
                        <div className="status-badge">
                          {getStatusIcon(appointment.status)}
                          <span>{getStatusText(appointment.status)}</span>
                        </div>
                      </div>

                      <div className="appointment-actions">
                        <button
                          className="action-btn"
                          title="Editar"
                          onClick={() =>
                            handleAppointmentAction("edit", appointment.id)
                          }
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="action-btn"
                          title="Cancelar"
                          onClick={() =>
                            handleAppointmentAction("cancel", appointment.id)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className="action-btn"
                          title="Mais opções"
                          onClick={() =>
                            handleAppointmentAction("delete", appointment.id)
                          }
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <AppointmentModal
          onSubmit={handleSaveAppointment}
          onCancel={() => setIsModalOpen(false)}
          title="Novo Agendamento"
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default Appointments;
