"use client";

import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  Mail,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import type {
  AppointmentFormProps,
  CreateAppointmentData,
} from "../../types/appointment";
import { formatPhone } from "../../utils/PhoneMask";
import "./AppointmentModal.css";

export const AppointmentModal: React.FC<AppointmentFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData = {},
  title = "Novo Agendamento",
}) => {
  const [formData, setFormData] = useState<CreateAppointmentData>({
    patientName: initialData.patientName || "",
    patientPhone: initialData.patientPhone || "",
    patientEmail: initialData.patientEmail || "",
    appointmentDate: initialData.appointmentDate
      ? new Date(initialData.appointmentDate)
      : new Date(),

    appointmentTime: initialData.appointmentTime || "",
    duration: initialData.duration || 60,
    service: initialData.service || "",
    dentist: initialData.dentist || "",
    notes: initialData.notes || "",
    status: initialData.status || "agendado",
    priority: initialData.priority || "normal",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = "Nome do paciente é obrigatório";
    }

    if (!formData.patientPhone.trim()) {
      newErrors.patientPhone = "Telefone é obrigatório";
    }

    if (formData.patientEmail && !formData.patientEmail.includes("@")) {
      newErrors.patientEmail = "E-mail inválido";
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Horário é obrigatório";
    }

    if (!formData.service.trim()) {
      newErrors.service = "Serviço é obrigatório";
    }

    if (!formData.dentist.trim()) {
      newErrors.dentist = "Dentista é obrigatório";
    }

    if (formData.duration < 15) {
      newErrors.duration = "Duração mínima é 15 minutos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const priorityOptions = [
    { value: "baixa", label: "Baixa", icon: "🟢" },
    { value: "normal", label: "Normal", icon: "🔵" },
    { value: "alta", label: "Alta", icon: "🟡" },
    { value: "urgente", label: "Urgente", icon: "🔴" },
  ];

  const serviceOptions = [
    "Consulta",
    "Limpeza",
    "Restauração",
    "Extração",
    "Canal",
    "Prótese",
    "Implante",
    "Ortodontia",
    "Clareamento",
    "Cirurgia",
    "Emergência",
  ];

  const dentistOptions = [
    "Dr. João Silva",
    "Dra. Maria Santos",
    "Dr. Pedro Costa",
    "Dra. Ana Oliveira",
    "Dr. Carlos Ferreira",
  ];

  return (
    <div className="appointment-modal-overlay" onClick={handleOverlayClick}>
      <div className="appointment-modal">
        <div className="appointment-modal-header">
          <h2>
            <Calendar size={20} />
            {title}
          </h2>
          <button
            type="button"
            className="close-button"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="appointment-form-container">
          <form onSubmit={handleSubmit} className="appointment-form">
            {/* Informações do Paciente */}
            <div className="form-section">
              <h3>
                <User size={16} />
                Informações do Paciente
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="patientName">
                    Nome do Paciente{" "}
                    <span className="required-asterisk">*</span>
                  </label>
                  <input
                    id="patientName"
                    type="text"
                    value={formData.patientName}
                    onChange={(e) =>
                      handleInputChange("patientName", e.target.value)
                    }
                    className={errors.patientName ? "error" : ""}
                    disabled={isLoading}
                    placeholder="Digite o nome completo"
                  />
                  {errors.patientName && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.patientName}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="patientPhone">
                    <Phone size={14} />
                    Telefone <span className="required-asterisk">*</span>
                  </label>
                  <input
                    id="patientPhone"
                    type="tel"
                    value={formData.patientPhone}
                    onChange={(e) =>
                      handleInputChange(
                        "patientPhone",
                        formatPhone(e.target.value)
                      )
                    }
                    className={errors.patientPhone ? "error" : ""}
                    disabled={isLoading}
                    placeholder="(11) 99999-9999"
                  />
                  {errors.patientPhone && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.patientPhone}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="patientEmail">
                    <Mail size={14} />
                    E-mail
                  </label>
                  <input
                    id="patientEmail"
                    type="email"
                    value={formData.patientEmail}
                    onChange={(e) =>
                      handleInputChange("patientEmail", e.target.value)
                    }
                    className={errors.patientEmail ? "error" : ""}
                    disabled={isLoading}
                    placeholder="email@exemplo.com"
                  />
                  {errors.patientEmail && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.patientEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Informações do Agendamento */}
            <div className="form-section">
              <h3>
                <Calendar size={16} />
                Detalhes do Agendamento
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="appointmentDate">
                    Data <span className="required-asterisk">*</span>
                  </label>
                  <input
                    id="appointmentDate"
                    type="date"
                    value={formData.appointmentDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleInputChange(
                        "appointmentDate",
                        new Date(e.target.value)
                      )
                    }
                    disabled={isLoading}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="appointmentTime">
                    <Clock size={14} />
                    Horário <span className="required-asterisk">*</span>
                  </label>
                  <input
                    id="appointmentTime"
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) =>
                      handleInputChange("appointmentTime", e.target.value)
                    }
                    className={errors.appointmentTime ? "error" : ""}
                    disabled={isLoading}
                  />
                  {errors.appointmentTime && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.appointmentTime}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="duration">
                    Duração (minutos){" "}
                    <span className="required-asterisk">*</span>
                  </label>
                  <select
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange(
                        "duration",
                        Number.parseInt(e.target.value)
                      )
                    }
                    className={errors.duration ? "error" : ""}
                    disabled={isLoading}
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>1 hora</option>
                    <option value={90}>1h 30min</option>
                    <option value={120}>2 horas</option>
                  </select>
                  {errors.duration && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.duration}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="service">
                    Serviço <span className="required-asterisk">*</span>
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) =>
                      handleInputChange("service", e.target.value)
                    }
                    className={errors.service ? "error" : ""}
                    disabled={isLoading}
                  >
                    <option value="">Selecione um serviço</option>
                    {serviceOptions.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.service}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="dentist">
                    Dentista <span className="required-asterisk">*</span>
                  </label>
                  <select
                    id="dentist"
                    value={formData.dentist}
                    onChange={(e) =>
                      handleInputChange("dentist", e.target.value)
                    }
                    className={errors.dentist ? "error" : ""}
                    disabled={isLoading}
                  >
                    <option value="">Selecione um dentista</option>
                    {dentistOptions.map((dentist) => (
                      <option key={dentist} value={dentist}>
                        {dentist}
                      </option>
                    ))}
                  </select>
                  {errors.dentist && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.dentist}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row single-column">
                <div className="form-group">
                  <label>Prioridade</label>
                  <div className="priority-selector">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`priority-option ${option.value} ${
                          formData.priority === option.value ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleInputChange("priority", option.value)
                        }
                        disabled={isLoading}
                      >
                        <span>{option.icon}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="form-section">
              <h3>
                <FileText size={16} />
                Observações
              </h3>

              <div className="form-row single-column">
                <div className="form-group">
                  <label htmlFor="notes">Observações Adicionais</label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    disabled={isLoading}
                    rows={3}
                    placeholder="Informações adicionais sobre o agendamento..."
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onCancel}
                disabled={isLoading}
              >
                <X size={16} />
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                <Save size={16} />
                {isLoading ? "Salvando..." : "Salvar Agendamento"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
