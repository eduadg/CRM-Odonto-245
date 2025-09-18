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
  X,
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import './Appointments.css';

interface AppointmentsProps {}

export const Appointments: React.FC<AppointmentsProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'calendar'

  const appointments = [
    {
      id: 1,
      patient: 'Ana Silva',
      phone: '(11) 99999-9999',
      email: 'ana.silva@email.com',
      date: '2024-01-15',
      time: '09:00',
      duration: 60,
      type: 'Consulta de Rotina',
      doctor: 'Dr. João Santos',
      specialty: 'Clínico Geral',
      status: 'confirmed',
      notes: 'Paciente retorna para acompanhamento',
      address: 'Rua das Flores, 123 - São Paulo, SP'
    },
    {
      id: 2,
      patient: 'Carlos Oliveira',
      phone: '(11) 88888-8888',
      email: 'carlos.oliveira@email.com',
      date: '2024-01-15',
      time: '10:30',
      duration: 45,
      type: 'Exame Preventivo',
      doctor: 'Dra. Maria Costa',
      specialty: 'Cardiologia',
      status: 'pending',
      notes: 'Primeira consulta - trazer exames anteriores',
      address: 'Av. Paulista, 456 - São Paulo, SP'
    },
    {
      id: 3,
      patient: 'Lucia Ferreira',
      phone: '(11) 77777-7777',
      email: 'lucia.ferreira@email.com',
      date: '2024-01-15',
      time: '14:00',
      duration: 30,
      type: 'Retorno',
      doctor: 'Dr. Pedro Lima',
      specialty: 'Ortopedia',
      status: 'confirmed',
      notes: 'Avaliação pós-cirurgia',
      address: 'Rua Augusta, 789 - São Paulo, SP'
    },
    {
      id: 4,
      patient: 'Roberto Mendes',
      phone: '(11) 66666-6666',
      email: 'roberto.mendes@email.com',
      date: '2024-01-16',
      time: '08:30',
      duration: 60,
      type: 'Consulta Especializada',
      doctor: 'Dra. Ana Beatriz',
      specialty: 'Dermatologia',
      status: 'cancelled',
      notes: 'Cancelado pelo paciente',
      address: 'Rua Oscar Freire, 321 - São Paulo, SP'
    },
    {
      id: 5,
      patient: 'Mariana Santos',
      phone: '(11) 55555-5555',
      email: 'mariana.santos@email.com',
      date: '2024-01-16',
      time: '11:00',
      duration: 45,
      type: 'Primeira Consulta',
      doctor: 'Dr. João Santos',
      specialty: 'Clínico Geral',
      status: 'confirmed',
      notes: 'Nova paciente - realizar anamnese completa',
      address: 'Alameda Santos, 654 - São Paulo, SP'
    }
  ];

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: false, href: '/dashboard' },
    { icon: Users, label: 'Pacientes', active: false, href: '/patients' },
    { icon: Calendar, label: 'Agendamentos', active: true, href: '/appointments' },
    { icon: Stethoscope, label: 'Consultas', active: false, href: '/consultations' },
    { icon: FileText, label: 'Prontuários', active: false, href: '/records' },
    { icon: DollarSign, label: 'Financeiro', active: false, href: '/financial' },
    { icon: Settings, label: 'Configurações', active: false, href: '/settings' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="status-confirmed" />;
      case 'pending':
        return <Clock size={16} className="status-pending" />;
      case 'cancelled':
        return <AlertCircle size={16} className="status-cancelled" />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || appointment.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      title: 'Total de Agendamentos',
      value: appointments.length.toString(),
      change: '+8%',
      trend: 'up',
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Confirmados Hoje',
      value: appointments.filter(a => a.date === '2024-01-15' && a.status === 'confirmed').length.toString(),
      change: '+12%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Pendentes',
      value: appointments.filter(a => a.status === 'pending').length.toString(),
      change: '-5%',
      trend: 'down',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Taxa de Confirmação',
      value: '87%',
      change: '+3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  return (
    <div className="appointments">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
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
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <FileText size={16} />
                  <span>Lista</span>
                </button>
                <button 
                  className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                  onClick={() => setViewMode('calendar')}
                >
                  <CalendarIcon size={16} />
                  <span>Calendário</span>
                </button>
              </div>

              <button className="btn-primary">
                <Plus size={16} />
                <span>Novo Agendamento</span>
              </button>
            </div>
          </div>

          {/* Appointments List */}
          <div className="appointments-list">
            <div className="list-header">
              <div className="list-title">
                <h3>Agendamentos</h3>
                <span className="appointments-count">{filteredAppointments.length} agendamentos</span>
              </div>
            </div>

            <div className="appointments-table">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-row">
                  <div className="appointment-time">
                    <div className="time-display">
                      <Clock size={16} />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="date-display">{appointment.date}</div>
                  </div>

                  <div className="appointment-patient">
                    <div className="patient-info">
                      <h4>{appointment.patient}</h4>
                      <div className="patient-contact">
                        <Phone size={14} />
                        <span>{appointment.phone}</span>
                      </div>
                      <div className="patient-contact">
                        <Mail size={14} />
                        <span>{appointment.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="appointment-details">
                    <div className="appointment-type">{appointment.type}</div>
                    <div className="appointment-doctor">
                      {appointment.doctor} • {appointment.specialty}
                    </div>
                    <div className="appointment-duration">
                      <Clock size={14} />
                      <span>{appointment.duration} min</span>
                    </div>
                  </div>

                  <div className="appointment-location">
                    <MapPin size={16} />
                    <span>{appointment.address}</span>
                  </div>

                  <div className="appointment-status">
                    <div className="status-badge">
                      {getStatusIcon(appointment.status)}
                      <span>{getStatusText(appointment.status)}</span>
                    </div>
                  </div>

                  <div className="appointment-actions">
                    <button className="action-btn" title="Editar">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn" title="Cancelar">
                      <Trash2 size={16} />
                    </button>
                    <button className="action-btn" title="Mais opções">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))}
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

export default Appointments;
