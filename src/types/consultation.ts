export interface CreateConsultationData {
  patientId: string;
  patientName: string;
  appointmentId?: string;
  consultationDate: Date;
  consultationTime: string;
  dentist: string;
  specialty: string;
  chiefComplaint: string; // Queixa principal
  symptoms: string[]; // Sintomas
  diagnosis: string; // Diagnóstico
  treatment: string; // Tratamento
  prescription?: string; // Prescrição
  notes?: string; // Observações
  status: "agendada" | "em-andamento" | "concluida" | "cancelada";
  priority: "baixa" | "normal" | "alta" | "urgente";
  followUpDate?: Date; // Data de retorno
  followUpNotes?: string; // Observações para retorno
}

export interface Consultation extends CreateConsultationData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsultationFormProps {
  onSubmit: (data: CreateConsultationData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateConsultationData>;
  title?: string;
}

export interface ConsultationStats {
  total: number;
  completed: number;
  inProgress: number;
  cancelled: number;
  today: number;
  thisWeek: number;
  completionRate: number;
}
