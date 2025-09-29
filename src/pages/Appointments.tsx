"use client";

import {
  AlertCircle,
  Calendar,
  CalendarIcon,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { AppointmentCalendar } from "../components/appointments/AppointmentCalendar";
import { AppointmentModal } from "../components/appointments/AppointmentModal";
import Page from "../components/layout/Layout";
import { appointmentService } from "../services/appointmentService";
import type { Appointment } from "../types/appointment";
import "./Appointments.css";

type AppointmentsProps = {};

const Appointments: React.FC<AppointmentsProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // 'list' ou 'calendar'
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAll();
      setAppointments(data);
      
      // Calcular estatísticas
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = data.filter(apt => apt.appointmentDate && apt.appointmentDate.toISOString().split('T')[0] === today);
      const pendingAppointments = data.filter(apt => apt.status === 'agendado');
      const confirmedAppointments = data.filter(apt => apt.status === 'confirmado');
      const cancelledAppointments = data.filter(apt => apt.status === 'cancelado');

      setStats({
        total: data.length,
        today: todayAppointments.length,
        pending: pendingAppointments.length,
        confirmed: confirmedAppointments.length,
        cancelled: cancelledAppointments.length,
      });
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAppointment = async (appointmentData: any) => {
    try {
      setLoading(true);
      await appointmentService.create(appointmentData);
      await loadAppointments();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmado":
        return <CheckCircle size={16} className="status-confirmed" />;
      case "agendado":
        return <Clock size={16} className="status-agendado" />;
      case "em-andamento":
        return <Clock size={16} className="status-em-andamento" />;
      case "concluido":
        return <CheckCircle size={16} className="status-concluido" />;
      case "cancelado":
        return <AlertCircle size={16} className="status-cancelled" />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmado":
        return "Confirmado";
      case "agendado":
        return "Agendado";
      case "em-andamento":
        return "Em Andamento";
      case "concluido":
        return "Concluído";
      case "cancelado":
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
      title: "Cancelados",
      value: stats.cancelled.toString(),
      change: "+2%",
      trend: "up",
      icon: AlertCircle,
      color: "red",
    },
  ];

  return (
    <Page>
      <div className="appointments">
        {/* Content */}
        <div className="appointments-content">
          {/* Stats */}
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
                    <TrendingUp size={12} />
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="appointments-controls">
            <div className="search-filter">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar agendamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todos</option>
                <option value="agendado">Agendados</option>
                <option value="confirmado">Confirmados</option>
                <option value="em-andamento">Em Andamento</option>
                <option value="concluido">Concluídos</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>

            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <FileText size={20} />
                Lista
              </button>
              <button
                className={`view-btn ${viewMode === "calendar" ? "active" : ""}`}
                onClick={() => setViewMode("calendar")}
              >
                <CalendarIcon size={20} />
                Calendário
              </button>
              <button
                className="add-btn"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={20} />
                Novo Agendamento
              </button>
            </div>
          </div>

          {/* Content */}
          {viewMode === "list" ? (
            <div className="appointments-list">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Carregando agendamentos...</p>
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={48} />
                  <h3>Nenhum agendamento encontrado</h3>
                  <p>
                    {searchTerm || selectedFilter !== "all"
                      ? "Tente ajustar os filtros de busca"
                      : "Comece criando seu primeiro agendamento"}
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus size={20} />
                    Novo Agendamento
                  </button>
                </div>
              ) : (
                <div className="appointments-table">
                  <div className="table-header">
                    <div className="col-patient">Paciente</div>
                    <div className="col-service">Serviço</div>
                    <div className="col-dentist">Dentista</div>
                    <div className="col-date">Data</div>
                    <div className="col-time">Horário</div>
                    <div className="col-status">Status</div>
                    <div className="col-actions">Ações</div>
                  </div>
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="table-row">
                      <div className="col-patient" data-label="Paciente">
                        <div className="patient-info">
                          <div className="patient-avatar">
                            {appointment.patientName.charAt(0)}
                          </div>
                          <div>
                            <div className="patient-name">
                              {appointment.patientName}
                            </div>
                            <div className="patient-phone">
                              {appointment.patientPhone}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-service" data-label="Serviço">{appointment.service}</div>
                      <div className="col-dentist" data-label="Dentista">{appointment.dentist}</div>
                      <div className="col-date" data-label="Data">
                        {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString("pt-BR") : 'N/A'}
                      </div>
                      <div className="col-time" data-label="Horário">{appointment.appointmentTime}</div>
                      <div className="col-status" data-label="Status">
                        <span
                          className={`status-badge status-${appointment.status}`}
                        >
                          {getStatusIcon(appointment.status)}
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      <div className="col-actions" data-label="Ações">
                        <button className="action-btn edit">
                          <Edit size={16} />
                        </button>
                        <button className="action-btn delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="calendar-view">
              <AppointmentCalendar appointments={filteredAppointments} />
            </div>
          )}
        </div>

        {isModalOpen && (
          <AppointmentModal
            onSubmit={handleSaveAppointment}
            onCancel={() => setIsModalOpen(false)}
            title="Novo Agendamento"
            isLoading={loading}
          />
        )}
      </div>
    </Page>
  );
};

export default Appointments;