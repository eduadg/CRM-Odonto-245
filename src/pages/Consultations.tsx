import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Stethoscope,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Page from "../components/layout/Layout";
import { ConsultationModal } from "../components/consultations/ConsultationModal";
import { consultationService } from "../services/consultationService";
import type { Consultation, ConsultationStats, CreateConsultationData } from "../types/consultation";
import "./Consultations.css";

export const Consultations: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<ConsultationStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    cancelled: 0,
    today: 0,
    thisWeek: 0,
    completionRate: 0,
  });

  useEffect(() => {
    loadConsultations();
    loadStats();
  }, []);

  useEffect(() => {
    filterConsultations();
  }, [searchTerm, selectedFilter, selectedSpecialty, consultations]);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const data = await consultationService.getAllConsultations();
      setConsultations(data);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await consultationService.getConsultationStats();
      setStats(statsData);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const filterConsultations = () => {
    let filtered = consultations;

    // Filtro por busca
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (consultation) =>
          consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.dentist.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (selectedFilter !== "all") {
      filtered = filtered.filter((consultation) => consultation.status === selectedFilter);
    }

    // Filtro por especialidade
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter((consultation) => consultation.specialty === selectedSpecialty);
    }

    setFilteredConsultations(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluida":
        return <CheckCircle size={16} className="status-completed" />;
      case "em-andamento":
        return <Clock size={16} className="status-in-progress" />;
      case "agendada":
        return <Calendar size={16} className="status-scheduled" />;
      case "cancelada":
        return <AlertCircle size={16} className="status-cancelled" />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "concluida":
        return "Concluída";
      case "em-andamento":
        return "Em Andamento";
      case "agendada":
        return "Agendada";
      case "cancelada":
        return "Cancelada";
      default:
        return "Desconhecido";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgente":
        return "priority-urgent";
      case "alta":
        return "priority-high";
      case "normal":
        return "priority-normal";
      case "baixa":
        return "priority-low";
      default:
        return "priority-normal";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  const formatTime = (time: string) => {
    return time;
  };

  const handleSaveConsultation = async (data: CreateConsultationData) => {
    try {
      setLoading(true);
      await consultationService.createConsultation(data);
      await loadConsultations();
      await loadStats();
      setIsModalOpen(false);
      console.log("Consulta criada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar consulta:", error);
      alert(error.message || "Erro ao criar consulta");
    } finally {
      setLoading(false);
    }
  };

  const handleConsultationAction = async (action: string, consultationId: string) => {
    try {
      setLoading(true);

      switch (action) {
        case "view":
          console.log("Visualizar consulta:", consultationId);
          break;
        case "edit":
          console.log("Editar consulta:", consultationId);
          break;
        case "complete":
          await consultationService.updateConsultation(consultationId, {
            status: "concluida",
          });
          await loadConsultations();
          await loadStats();
          break;
        case "cancel":
          await consultationService.updateConsultation(consultationId, {
            status: "cancelada",
          });
          await loadConsultations();
          await loadStats();
          break;
        case "delete":
          if (confirm("Tem certeza que deseja excluir esta consulta?")) {
            await consultationService.deleteConsultation(consultationId);
            await loadConsultations();
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

  const dynamicStats = [
    {
      title: "Total de Consultas",
      value: stats.total.toString(),
      change: "+12%",
      trend: "up",
      icon: Stethoscope,
      color: "blue",
    },
    {
      title: "Concluídas Hoje",
      value: stats.today.toString(),
      change: "+8%",
      trend: "up",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Em Andamento",
      value: stats.inProgress.toString(),
      change: "-3%",
      trend: "down",
      icon: Clock,
      color: "orange",
    },
    {
      title: "Taxa de Conclusão",
      value: `${stats.completionRate}%`,
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  const specialties = [
    "Clínica Geral",
    "Endodontia",
    "Periodontia",
    "Ortodontia",
    "Implantodontia",
    "Cirurgia",
    "Estética",
  ];

  return (
    <Page>
      <div className="consultations-page">
        <div className="consultations-container">
          {/* Header */}
          <div className="consultations-header">
            <div className="consultations-title">
              <h1>Consultas</h1>
              <p>Gerencie as consultas e tratamentos dos seus pacientes</p>
            </div>
            <button 
              className="btn-primary" 
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
            >
              <Plus size={16} />
              <span>Nova Consulta</span>
            </button>
          </div>

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
                  placeholder="Buscar por paciente, dentista ou especialidade..."
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
                  <option value="agendada">Agendadas</option>
                  <option value="em-andamento">Em Andamento</option>
                  <option value="concluida">Concluídas</option>
                  <option value="cancelada">Canceladas</option>
                </select>
              </div>

              <div className="filter-select">
                <Stethoscope size={16} />
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="all">Todas as Especialidades</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="controls-right">
              <div className="consultations-count">
                {filteredConsultations.length} consulta{filteredConsultations.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Consultations List */}
          {loading && consultations.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Carregando consultas...</p>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🩺</div>
              <h3>Nenhuma consulta encontrada</h3>
              <p>
                {searchTerm || selectedFilter !== "all" || selectedSpecialty !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando sua primeira consulta"}
              </p>
            </div>
          ) : (
            <div className="consultations-list">
              {filteredConsultations.map((consultation) => (
                <div key={consultation.id} className="consultation-card">
                  <div className="consultation-header">
                    <div className="consultation-patient">
                      <div className="patient-avatar">
                        {consultation.patientName.charAt(0).toUpperCase()}
                      </div>
                      <div className="patient-info">
                        <h3>{consultation.patientName}</h3>
                        <p className="consultation-dentist">
                          {consultation.dentist} • {consultation.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="consultation-status">
                      <div className="status-badge">
                        {getStatusIcon(consultation.status)}
                        <span>{getStatusText(consultation.status)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="consultation-details">
                    <div className="consultation-time">
                      <Clock size={16} />
                      <span>
                        {formatDate(consultation.consultationDate)} às {formatTime(consultation.consultationTime)}
                      </span>
                    </div>
                    <div className="consultation-priority">
                      <span className={`priority-badge ${getPriorityColor(consultation.priority)}`}>
                        {consultation.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="consultation-content">
                    <div className="consultation-section">
                      <h4>Queixa Principal</h4>
                      <p>{consultation.chiefComplaint}</p>
                    </div>

                    {consultation.symptoms.length > 0 && (
                      <div className="consultation-section">
                        <h4>Sintomas</h4>
                        <div className="symptoms-list">
                          {consultation.symptoms.map((symptom, index) => (
                            <span key={index} className="symptom-tag">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {consultation.diagnosis && (
                      <div className="consultation-section">
                        <h4>Diagnóstico</h4>
                        <p>{consultation.diagnosis}</p>
                      </div>
                    )}

                    {consultation.treatment && (
                      <div className="consultation-section">
                        <h4>Tratamento</h4>
                        <p>{consultation.treatment}</p>
                      </div>
                    )}
                  </div>

                  <div className="consultation-actions">
                    <button
                      className="action-btn"
                      title="Visualizar"
                      onClick={() => handleConsultationAction("view", consultation.id)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-btn"
                      title="Editar"
                      onClick={() => handleConsultationAction("edit", consultation.id)}
                    >
                      <Edit size={16} />
                    </button>
                    {consultation.status === "em-andamento" && (
                      <button
                        className="action-btn action-complete"
                        title="Concluir"
                        onClick={() => handleConsultationAction("complete", consultation.id)}
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {consultation.status !== "cancelada" && (
                      <button
                        className="action-btn action-cancel"
                        title="Cancelar"
                        onClick={() => handleConsultationAction("cancel", consultation.id)}
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      className="action-btn action-more"
                      title="Mais opções"
                      onClick={() => handleConsultationAction("delete", consultation.id)}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  {consultation.followUpDate && (
                    <div className="consultation-followup">
                      <Calendar size={14} />
                      <span>
                        Retorno: {formatDate(consultation.followUpDate)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ConsultationModal
          onSubmit={handleSaveConsultation}
          onCancel={() => setIsModalOpen(false)}
          title="Nova Consulta"
          isLoading={loading}
        />
      )}
    </Page>
  );
};

export default Consultations;
