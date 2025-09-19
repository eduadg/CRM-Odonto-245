import React, { useEffect, useState } from "react";
import Page from "../components/layout/Layout";
import { PatientForm } from "../components/patients/PatientForm";
import { SearchBar } from "../components/patients/SearchBar";
import { useAuth } from "../hooks/useAuth";
import { useLoading } from "../hooks/useLoading";
import { useToast } from "../hooks/useToast";
import { patientService } from "../services/patientService";
import type { CreatePatientData, Patient } from "../types/patient";
import "./Patients.css";

export const Patients: React.FC = () => {
  const { user } = useAuth();
  const { isLoading, showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Carregar pacientes
  const loadPatients = async () => {
    try {
      showLoading("Carregando pacientes...");
      const patientsData = await patientService.getAllPatients();
      setPatients(patientsData);
      setFilteredPatients(patientsData);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      showToast({
        type: "error",
        title: "Erro",
        message: "Erro ao carregar pacientes",
      });
    } finally {
      hideLoading();
    }
  };

  // Filtrar pacientes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm) ||
          (patient.email &&
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (patient.cpf && patient.cpf.includes(searchTerm))
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  // Carregar pacientes na inicialização
  useEffect(() => {
    loadPatients();
  }, []);

  // Salvar paciente
  const handleSavePatient = async (patientData: CreatePatientData) => {
    if (!user) {
      showToast({
        type: "error",
        title: "Erro",
        message: "Usuário não autenticado",
      });
      return;
    }

    try {
      showLoading("Salvando paciente...");

      if (editingPatient) {
        // Atualizar paciente existente
        await patientService.updatePatient({
          id: editingPatient.id,
          ...patientData,
        });
        showToast({
          type: "success",
          title: "Sucesso",
          message: "Paciente atualizado com sucesso!",
        });
      } else {
        // Criar novo paciente
        await patientService.createPatient(patientData, user.id);
        showToast({
          type: "success",
          title: "Sucesso",
          message: "Paciente cadastrado com sucesso!",
        });
      }

      // Recarregar lista de pacientes
      await loadPatients();

      // Fechar formulário
      setShowForm(false);
      setEditingPatient(null);
    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      showToast({
        type: "error",
        title: "Erro",
        message: "Erro ao salvar paciente",
      });
    } finally {
      hideLoading();
    }
  };

  // Editar paciente
  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  // Deletar paciente
  const handleDeletePatient = async (patient: Patient) => {
    if (
      !window.confirm(
        `Tem certeza que deseja excluir o paciente ${patient.fullName}?`
      )
    ) {
      return;
    }

    try {
      showLoading("Excluindo paciente...");
      await patientService.deletePatient(patient.id);

      showToast({
        type: "success",
        title: "Sucesso",
        message: "Paciente excluído com sucesso!",
      });

      // Recarregar lista de pacientes
      await loadPatients();
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      showToast({
        type: "error",
        title: "Erro",
        message: "Erro ao excluir paciente",
      });
    } finally {
      hideLoading();
    }
  };

  // Cancelar formulário
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  // Formatar data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  // Formatar telefone
  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  if (showForm) {
    return (
      <div className="patients-page">
        <PatientForm
          onSubmit={handleSavePatient}
          onCancel={handleCancelForm}
          isLoading={isLoading}
          initialData={editingPatient || undefined}
          title={editingPatient ? "Editar Paciente" : "Cadastrar Paciente"}
        />
      </div>
    );
  }

  return (
    <Page>
      <div className="patients-page">
        <div className="patients-container">
          <div className="patients-header">
            <div className="patients-title">
              <h1>Pacientes</h1>
              <p>Gerencie os pacientes da sua clínica</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowForm(true)}
              disabled={isLoading}
            >
              + Novo Paciente
            </button>
          </div>

          <div className="patients-content">
            <div className="patients-filters">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar por nome, telefone, email ou CPF..."
              />
              <div className="patients-count">
                {filteredPatients.length} paciente
                {filteredPatients.length !== 1 ? "s" : ""}
              </div>
            </div>

            {isLoading && patients.length === 0 ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Carregando pacientes...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>Nenhum paciente encontrado</h3>
                <p>
                  {searchTerm
                    ? "Tente ajustar os termos de busca"
                    : "Comece cadastrando seu primeiro paciente"}
                </p>
                {!searchTerm && (
                  <button
                    className="btn-primary"
                    onClick={() => setShowForm(true)}
                  >
                    Cadastrar Primeiro Paciente
                  </button>
                )}
              </div>
            ) : (
              <div className="patients-grid">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="patient-card">
                    <div className="patient-header">
                      <div className="patient-avatar">
                        {patient.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="patient-info">
                        <h3>{patient.fullName}</h3>
                        <p className="patient-phone">
                          {formatPhone(patient.phone)}
                        </p>
                        {patient.email && (
                          <p className="patient-email">{patient.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="patient-details">
                      {patient.birthDate && (
                        <div className="detail-item">
                          <span className="detail-label">Nascimento:</span>
                          <span className="detail-value">
                            {formatDate(patient.birthDate)}
                          </span>
                        </div>
                      )}
                      {patient.gender && (
                        <div className="detail-item">
                          <span className="detail-label">Sexo:</span>
                          <span className="detail-value">{patient.gender}</span>
                        </div>
                      )}
                      {patient.cpf && (
                        <div className="detail-item">
                          <span className="detail-label">CPF:</span>
                          <span className="detail-value">{patient.cpf}</span>
                        </div>
                      )}
                    </div>

                    <div className="patient-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditPatient(patient)}
                        title="Editar paciente"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeletePatient(patient)}
                        title="Excluir paciente"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="patient-footer">
                      <small>
                        Cadastrado em {formatDate(patient.createdAt)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Patients;
