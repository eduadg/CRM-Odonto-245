import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Bell,
  Calendar,
  ChevronDown,
  Clock,
  DollarSign,
  FileText,
  Heart,
  Home,
  LogOut,
  Menu,
  Settings,
  Stethoscope,
  TrendingUp,
  User,
  Users,
  X
} from 'lucide-react';
import SimpleChart from '../components/charts/SimpleChart';
import './Dashboard.css';

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const stats = [
    {
      title: 'Pacientes Ativos',
      value: '2,431',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Consultas Hoje',
      value: '24',
      change: '+5%',
      trend: 'up',
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 48.2K',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Taxa de Ocupação',
      value: '87%',
      change: '-3%',
      trend: 'down',
      icon: Activity,
      color: 'orange'
    }
  ];

  const recentAppointments = [
    {
      id: 1,
      patient: 'Ana Silva',
      time: '09:00',
      type: 'Consulta de Rotina',
      doctor: 'Dr. João Santos',
      specialty: 'Clínico Geral'
    },
    {
      id: 2,
      patient: 'Carlos Oliveira',
      time: '10:30',
      type: 'Exame Preventivo',
      doctor: 'Dra. Maria Costa',
      specialty: 'Cardiologia'
    },
    {
      id: 3,
      patient: 'Lucia Ferreira',
      time: '14:00',
      type: 'Retorno',
      doctor: 'Dr. Pedro Lima',
      specialty: 'Ortopedia'
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'Nova consulta agendada',
      message: 'Paciente João marcou consulta para amanhã às 15h',
      time: '5 min atrás',
      type: 'info'
    },
    {
      id: 2,
      title: 'Lembrete de consulta',
      message: 'Consulta com Maria Silva em 30 minutos',
      time: '15 min atrás',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Pagamento recebido',
      message: 'Pagamento de R$ 250 confirmado',
      time: '1h atrás',
      type: 'success'
    }
  ];

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true, href: '/dashboard' },
    { icon: Users, label: 'Pacientes', active: false, href: '/patients' },
    { icon: Calendar, label: 'Agendamentos', active: false, href: '/appointments' },
    { icon: Stethoscope, label: 'Consultas', active: false, href: '/consultations' },
    { icon: FileText, label: 'Prontuários', active: false, href: '/records' },
    { icon: DollarSign, label: 'Financeiro', active: false, href: '/financial' },
    { icon: Settings, label: 'Configurações', active: false, href: '/settings' }
  ];

  const consultasData = [
    { label: 'Jan', value: 45, color: '#3b82f6' },
    { label: 'Fev', value: 52, color: '#3b82f6' },
    { label: 'Mar', value: 48, color: '#3b82f6' },
    { label: 'Abr', value: 61, color: '#3b82f6' },
    { label: 'Mai', value: 55, color: '#3b82f6' },
    { label: 'Jun', value: 67, color: '#3b82f6' }
  ];

  const especialidadesData = [
    { label: 'Clínica Geral', value: 35, color: '#4f46e5' },
    { label: 'Cardiologia', value: 25, color: '#10b981' },
    { label: 'Ortopedia', value: 20, color: '#f59e0b' },
    { label: 'Pediatria', value: 15, color: '#ef4444' },
    { label: 'Outras', value: 5, color: '#8b5cf6' }
  ];

  const receitaData = [
    { label: 'Jan', value: 32000 },
    { label: 'Fev', value: 38000 },
    { label: 'Mar', value: 35000 },
    { label: 'Abr', value: 42000 },
    { label: 'Mai', value: 45000 },
    { label: 'Jun', value: 48200 }
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="logo-circle">CR</div>
            <div className="brand-text">
              <h2>CRM Odonto</h2>
              <p>Dashboard</p>
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
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`nav-item ${item.active ? 'nav-item-active' : ''}`}
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
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
            >
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

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className={`stat-card stat-${stat.color}`}>
                <div className="stat-icon">
                  <stat.icon size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.title}</div>
                  <div className={`stat-change ${stat.trend === 'up' ? 'stat-up' : 'stat-down'}`}>
                    <TrendingUp size={14} />
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Appointments */}
            <div className="content-card">
              <div className="card-header">
                <h3>Próximas Consultas</h3>
                <button className="card-action">Ver todas</button>
              </div>
              <div className="appointments-list">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-time">
                      <Clock size={16} />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="appointment-details">
                      <div className="appointment-patient">{appointment.patient}</div>
                      <div className="appointment-type">{appointment.type}</div>
                      <div className="appointment-doctor">
                        {appointment.doctor} • {appointment.specialty}
                      </div>
                    </div>
                    <div className="appointment-status">
                      <Heart size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="content-card chart-card">
              <div className="card-header">
                <h3>Consultas por Mês</h3>
                <button className="card-action">Relatório completo</button>
              </div>
              <div className="chart-wrapper">
                <SimpleChart
                  data={consultasData}
                  type="bar"
                  height={200}
                />
              </div>
            </div>

            <div className="content-card chart-card">
              <div className="card-header">
                <h3>Especialidades</h3>
                <button className="card-action">Ver detalhes</button>
              </div>
              <div className="chart-wrapper">
                <SimpleChart
                  data={especialidadesData}
                  type="donut"
                  height={200}
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="content-card">
              <div className="card-header">
                <h3>Notificações</h3>
                <button className="card-action">Marcar como lidas</button>
              </div>
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`notification-item notification-${notification.type}`}>
                    <div className="notification-icon">
                      <Bell size={16} />
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="content-card chart-card wide-card">
              <div className="card-header">
                <h3>Receita Mensal</h3>
                <button className="card-action">Relatório financeiro</button>
              </div>
              <div className="chart-wrapper">
                <SimpleChart
                  data={receitaData}
                  type="line"
                  height={180}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="content-card">
              <div className="card-header">
                <h3>Ações Rápidas</h3>
              </div>
              <div className="quick-actions">
                <button className="quick-action">
                  <Users size={20} />
                  <span>Novo Paciente</span>
                </button>
                <button className="quick-action">
                  <Calendar size={20} />
                  <span>Agendar Consulta</span>
                </button>
                <button className="quick-action">
                  <FileText size={20} />
                  <span>Criar Prontuário</span>
                </button>
                <button className="quick-action">
                  <Stethoscope size={20} />
                  <span>Iniciar Consulta</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
