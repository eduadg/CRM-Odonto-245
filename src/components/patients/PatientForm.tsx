import React, { useState } from "react";
import type { CreatePatientData } from "../../types/patient";
import { formatCPF } from "../../utils/cpfMask";
import { formatPhone } from "../../utils/PhoneMask";
import "./PatientForm.css";

interface PatientFormProps {
  onSubmit: (data: CreatePatientData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreatePatientData>;
  title?: string;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData = {},
  title = "Cadastrar Paciente",
}) => {
  const [formData, setFormData] = useState<CreatePatientData>({
    fullName: initialData.fullName || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    birthDate: initialData.birthDate,
    gender: initialData.gender || "outro",
    cpf: initialData.cpf || "",
    address: {
      street: initialData.address?.street || "",
      number: initialData.address?.number || "",
      complement: initialData.address?.complement || "",
      neighborhood: initialData.address?.neighborhood || "",
      city: initialData.address?.city || "",
      state: initialData.address?.state || "",
      zipCode: initialData.address?.zipCode || "",
    },
    emergencyContact: {
      name: initialData.emergencyContact?.name || "",
      phone: initialData.emergencyContact?.phone || "",
      relationship: initialData.emergencyContact?.relationship || "",
    },
    medicalInfo: {
      allergies: initialData.medicalInfo?.allergies || [],
      medications: initialData.medicalInfo?.medications || [],
      medicalConditions: initialData.medicalInfo?.medicalConditions || [],
      notes: initialData.medicalInfo?.notes || "",
    },
    dentalInfo: {
      notes: initialData.dentalInfo?.notes || "",
    },
  });

  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nome completo é obrigatório";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "E-mail inválido";
    }

    if (formData.cpf) {
      const numericCpf = formData.cpf.replace(/\D/g, "");
      if (numericCpf.length !== 11) {
        newErrors.cpf = "CPF deve ter 11 dígitos";
      }
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
      console.error("Erro ao salvar paciente:", error);
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

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address!,
        [field]: value,
      },
    }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact!,
        [field]: value,
      },
    }));
  };

  const handleMedicalInfoChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo!,
        [field]: value,
      },
    }));
  };

  const handleDentalInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      dentalInfo: {
        ...prev.dentalInfo!,
        [field]: value,
      },
    }));
  };

  return (
    <div className="patient-form-container">
      <div className="patient-form-header">
        <h2>{title}</h2>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="patient-form">
        {/* Informações Básicas */}
        <div className="form-section">
          <h3>Informações Básicas</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Nome Completo *</label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={errors.fullName ? "error" : ""}
                disabled={isLoading}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefone *</label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  handleInputChange("phone", formatPhone(e.target.value))
                }
                className={errors.phone ? "error" : ""}
                disabled={isLoading}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "error" : ""}
                disabled={isLoading}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input
                id="cpf"
                type="text"
                value={formData.cpf}
                onChange={(e) =>
                  handleInputChange("cpf", formatCPF(e.target.value))
                }
                className={errors.cpf ? "error" : ""}
                disabled={isLoading}
                maxLength={14}
              />
              {errors.cpf && (
                <span className="error-message">{errors.cpf}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birthDate">Data de Nascimento</label>
              <input
                id="birthDate"
                type="date"
                value={
                  formData.birthDate
                    ? formData.birthDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange(
                    "birthDate",
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Sexo</label>
              <select
                id="gender"
                value={formData.gender || ""}
                onChange={(e) =>
                  handleInputChange(
                    "gender",
                    e.target.value as "masculino" | "feminino" | "outro"
                  )
                }
                disabled={isLoading}
              >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campos Avançados */}
        <div className="form-section">
          <button
            type="button"
            className="toggle-advanced"
            onClick={() => setShowAdvancedFields(!showAdvancedFields)}
          >
            {showAdvancedFields ? "Ocultar" : "Mostrar"} Campos Avançados
          </button>

          {showAdvancedFields && (
            <>
              {/* Endereço */}
              <div className="form-subsection">
                <h4>Endereço</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="street">Rua</label>
                    <input
                      id="street"
                      type="text"
                      value={formData.address?.street || ""}
                      onChange={(e) =>
                        handleAddressChange("street", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="number">Número</label>
                    <input
                      id="number"
                      type="text"
                      value={formData.address?.number || ""}
                      onChange={(e) =>
                        handleAddressChange("number", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="complement">Complemento</label>
                    <input
                      id="complement"
                      type="text"
                      value={formData.address?.complement || ""}
                      onChange={(e) =>
                        handleAddressChange("complement", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="neighborhood">Bairro</label>
                    <input
                      id="neighborhood"
                      type="text"
                      value={formData.address?.neighborhood || ""}
                      onChange={(e) =>
                        handleAddressChange("neighborhood", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">Cidade</label>
                    <input
                      id="city"
                      type="text"
                      value={formData.address?.city || ""}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">Estado</label>
                    <input
                      id="state"
                      type="text"
                      value={formData.address?.state || ""}
                      onChange={(e) =>
                        handleAddressChange("state", e.target.value)
                      }
                      disabled={isLoading}
                      maxLength={2}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">CEP</label>
                    <input
                      id="zipCode"
                      type="text"
                      value={formData.address?.zipCode || ""}
                      onChange={(e) =>
                        handleAddressChange(
                          "zipCode",
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      disabled={isLoading}
                      maxLength={8}
                    />
                  </div>
                </div>
              </div>

              {/* Contato de Emergência */}
              <div className="form-subsection">
                <h4>Contato de Emergência</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="emergencyName">Nome</label>
                    <input
                      id="emergencyName"
                      type="text"
                      value={formData.emergencyContact?.name || ""}
                      onChange={(e) =>
                        handleEmergencyContactChange("name", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="emergencyPhone">Telefone</label>
                    <input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyContact?.phone || ""}
                      onChange={(e) =>
                        handleEmergencyContactChange(
                          "phone",
                          formatPhone(e.target.value)
                        )
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="emergencyRelationship">Parentesco</label>
                    <input
                      id="emergencyRelationship"
                      type="text"
                      value={formData.emergencyContact?.relationship || ""}
                      onChange={(e) =>
                        handleEmergencyContactChange(
                          "relationship",
                          e.target.value
                        )
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Informações Médicas */}
              <div className="form-subsection">
                <h4>Informações Médicas</h4>
                <div className="form-group">
                  <label htmlFor="allergies">Alergias</label>
                  <textarea
                    id="allergies"
                    value={formData.medicalInfo?.allergies?.join(", ") || ""}
                    onChange={(e) =>
                      handleMedicalInfoChange(
                        "allergies",
                        e.target.value
                          .split(",")
                          .map((a) => a.trim())
                          .filter((a) => a)
                      )
                    }
                    disabled={isLoading}
                    placeholder="Separe as alergias por vírgula"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="medications">Medicamentos</label>
                  <textarea
                    id="medications"
                    value={formData.medicalInfo?.medications?.join(", ") || ""}
                    onChange={(e) =>
                      handleMedicalInfoChange(
                        "medications",
                        e.target.value
                          .split(",")
                          .map((m) => m.trim())
                          .filter((m) => m)
                      )
                    }
                    disabled={isLoading}
                    placeholder="Separe os medicamentos por vírgula"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="medicalConditions">Condições Médicas</label>
                  <textarea
                    id="medicalConditions"
                    value={
                      formData.medicalInfo?.medicalConditions?.join(", ") || ""
                    }
                    onChange={(e) =>
                      handleMedicalInfoChange(
                        "medicalConditions",
                        e.target.value
                          .split(",")
                          .map((c) => c.trim())
                          .filter((c) => c)
                      )
                    }
                    disabled={isLoading}
                    placeholder="Separe as condições por vírgula"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="medicalNotes">Observações Médicas</label>
                  <textarea
                    id="medicalNotes"
                    value={formData.medicalInfo?.notes || ""}
                    onChange={(e) =>
                      handleMedicalInfoChange("notes", e.target.value)
                    }
                    disabled={isLoading}
                    rows={3}
                  />
                </div>
              </div>

              {/* Informações Odontológicas */}
              <div className="form-subsection">
                <h4>Informações Odontológicas</h4>
                <div className="form-group">
                  <label htmlFor="dentalNotes">Observações Odontológicas</label>
                  <textarea
                    id="dentalNotes"
                    value={formData.dentalInfo?.notes || ""}
                    onChange={(e) =>
                      handleDentalInfoChange("notes", e.target.value)
                    }
                    disabled={isLoading}
                    rows={3}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Paciente"}
          </button>
        </div>
      </form>
    </div>
  );
};
