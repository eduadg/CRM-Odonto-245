import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  Heart,
  Save,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import type {
  ConsultationFormProps,
  CreateConsultationData,
} from "../../types/consultation";
import "./ConsultationModal.css";

export const ConsultationModal: React.FC<ConsultationFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData = {},
  title = "Nova Consulta",
}) => {
  const [formData, setFormData] = useState<CreateConsultationData>({
    patientId: initialData.patientId || "",
    patientName: initialData.patientName || "",
    appointmentId: initialData.appointmentId || "",
    consultationDate: initialData.consultationDate
      ? new Date(initialData.consultationDate)
      : new Date(),
    consultationTime: initialData.consultationTime || "",
    dentist: initialData.dentist || "",
    specialty: initialData.specialty || "",
    chiefComplaint: initialData.chiefComplaint || "",
    symptoms: initialData.symptoms || [],
    diagnosis: initialData.diagnosis || "",
    treatment: initialData.treatment || "",
    prescription: initialData.prescription || "",
    notes: initialData.notes || "",
    status: initialData.status || "agendada",
    priority: initialData.priority || "normal",
    followUpDate: initialData.followUpDate
      ? new Date(initialData.followUpDate)
      : undefined,
    followUpNotes: initialData.followUpNotes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newSymptom, setNewSymptom] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = "Nome do paciente é obrigatório";
    }

    if (!formData.consultationTime) {
      newErrors.consultationTime = "Horário é obrigatório";
    }

    if (!formData.dentist.trim()) {
      newErrors.dentist = "Dentista é obrigatório";
    }

    if (!formData.specialty.trim()) {
      newErrors.specialty = "Especialidade é obrigatória";
    }

    if (!formData.chiefComplaint.trim()) {
      newErrors.chiefComplaint = "Queixa principal é obrigatória";
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = "Diagnóstico é obrigatório";
    }

    if (!formData.treatment.trim()) {
      newErrors.treatment = "Tratamento é obrigatório";
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
      console.error("Erro ao salvar consulta:", error);
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

  const addSymptom = () => {
    if (newSymptom.trim() && !formData.symptoms.includes(newSymptom.trim())) {
      setFormData((prev) => ({
        ...prev,
        symptoms: [...prev.symptoms, newSymptom.trim()],
      }));
      setNewSymptom("");
    }
  };

  const removeSymptom = (symptom: string) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.filter((s) => s !== symptom),
    }));
  };

  const priorityOptions = [
    { value: "baixa", label: "Baixa", icon: "🟢" },
    { value: "normal", label: "Normal", icon: "🔵" },
    { value: "alta", label: "Alta", icon: "🟡" },
    { value: "urgente", label: "Urgente", icon: "🔴" },
  ];

  const specialtyOptions = [
    "Clínica Geral",
    "Endodontia",
    "Periodontia",
    "Ortodontia",
    "Implantodontia",
    "Cirurgia",
    "Estética",
    "Odontopediatria",
    "Prótese",
  ];

  const dentistOptions = [
    "Dr. João Silva",
    "Dra. Maria Santos",
    "Dr. Pedro Costa",
    "Dra. Ana Oliveira",
    "Dr. Carlos Ferreira",
  ];

  return (
    <div className="consultation-modal-overlay" onClick={handleOverlayClick}>
      <div className="consultation-modal">
        <div className="consultation-modal-header">
          <h2>
            <Stethoscope size={20} />
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

        <div className="consultation-form-container">
          <form onSubmit={handleSubmit} className="consultation-form">
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
              </div>
            </div>

            {/* Informações da Consulta */}
            <div className="form-section">
              <h3>
                <Calendar size={16} />
                Detalhes da Consulta
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="consultationDate">
                    Data <span className="required-asterisk">*</span>
                  </label>
                  <input
                    id="consultationDate"
                    type="date"
                    value={formData.consultationDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleInputChange(
                        "consultationDate",
                        new Date(e.target.value)
                      )
                    }
                    disabled={isLoading}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="consultationTime">
                    <Clock size={14} />
                    Horário <span className="required-asterisk">*</span>
                  </label>
                  <input
                    id="consultationTime"
                    type="time"
                    value={formData.consultationTime}
                    onChange={(e) =>
                      handleInputChange("consultationTime", e.target.value)
                    }
                    className={errors.consultationTime ? "error" : ""}
                    disabled={isLoading}
                  />
                  {errors.consultationTime && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.consultationTime}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
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

                <div className="form-group">
                  <label htmlFor="specialty">
                    Especialidade <span className="required-asterisk">*</span>
                  </label>
                  <select
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) =>
                      handleInputChange("specialty", e.target.value)
                    }
                    className={errors.specialty ? "error" : ""}
                    disabled={isLoading}
                  >
                    <option value="">Selecione uma especialidade</option>
                    {specialtyOptions.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                  {errors.specialty && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.specialty}
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

            {/* Anamnese */}
            <div className="form-section">
              <h3>
                <Heart size={16} />
                Anamnese
              </h3>

              <div className="form-row single-column">
                <div className="form-group">
                  <label htmlFor="chiefComplaint">
                    Queixa Principal{" "}
                    <span className="required-asterisk">*</span>
                  </label>
                  <textarea
                    id="chiefComplaint"
                    value={formData.chiefComplaint}
                    onChange={(e) =>
                      handleInputChange("chiefComplaint", e.target.value)
                    }
                    className={errors.chiefComplaint ? "error" : ""}
                    disabled={isLoading}
                    rows={3}
                    placeholder="Descreva a queixa principal do paciente..."
                  />
                  {errors.chiefComplaint && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.chiefComplaint}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row single-column">
                <div className="form-group">
                  <label htmlFor="symptoms">Sintomas</label>
                  <div className="symptoms-input">
                    <input
                      type="text"
                      value={newSymptom}
                      onChange={(e) => setNewSymptom(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSymptom();
                        }
                      }}
                      placeholder="Digite um sintoma e pressione Enter"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={addSymptom}
                      disabled={isLoading || !newSymptom.trim()}
                      className="add-symptom-btn"
                    >
                      Adicionar
                    </button>
                  </div>
                  {formData.symptoms.length > 0 && (
                    <div className="symptoms-list">
                      {formData.symptoms.map((symptom, index) => (
                        <span key={index} className="symptom-tag">
                          {symptom}
                          <button
                            type="button"
                            onClick={() => removeSymptom(symptom)}
                            className="remove-symptom"
                            disabled={isLoading}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnóstico e Tratamento */}
            <div className="form-section">
              <h3>
                <FileText size={16} />
                Diagnóstico e Tratamento
              </h3>

              <div className="form-row single-column">
                <div className="form-group">
                  <label htmlFor="diagnosis">
                    Diagnóstico <span className="required-asterisk">*</span>
                  </label>
                  <textarea
                    id="diagnosis"
                    value={formData.diagnosis}
                    onChange={(e) =>
                      handleInputChange("diagnosis", e.target.value)
                    }
                    className={errors.diagnosis ? "error" : ""}
                    disabled={isLoading}
                    rows={3}
                    placeholder="Descreva o diagnóstico..."
                  />
                  {errors.diagnosis && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.diagnosis}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row single-column">
                <div className="form-group">
                  <label htmlFor="treatment">
                    Tratamento <span className="required-asterisk">*</span>
                  </label>
                  <textarea
                    id="treatment"
                    value={formData.treatment}
                    onChange={(e) =>
                      handleInputChange("treatment", e.target.value)
                    }
                    className={errors.treatment ? "error" : ""}
                    disabled={isLoading}
                    rows={3}
                    placeholder="Descreva o tratamento prescrito..."
                  />
                  {errors.treatment && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.treatment}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row single-column">
                <div className="form-group">
                  <label htmlFor="prescription">Prescrição</label>
                  <textarea
                    id="prescription"
                    value={formData.prescription}
                    onChange={(e) =>
                      handleInputChange("prescription", e.target.value)
                    }
                    disabled={isLoading}
                    rows={3}
                    placeholder="Medicamentos prescritos..."
                  />
                </div>
              </div>
            </div>

            {/* Retorno */}
            <div className="form-section">
              <h3>
                <Calendar size={16} />
                Retorno
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="followUpDate">Data de Retorno</label>
                  <input
                    id="followUpDate"
                    type="date"
                    value={
                      formData.followUpDate
                        ? formData.followUpDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "followUpDate",
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
                    disabled={isLoading}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="form-row single-column">
                <div className="form-group">
                  <label htmlFor="followUpNotes">Observações para Retorno</label>
                  <textarea
                    id="followUpNotes"
                    value={formData.followUpNotes}
                    onChange={(e) =>
                      handleInputChange("followUpNotes", e.target.value)
                    }
                    disabled={isLoading}
                    rows={2}
                    placeholder="Observações para o retorno..."
                  />
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
                    placeholder="Informações adicionais sobre a consulta..."
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
                {isLoading ? "Salvando..." : "Salvar Consulta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
