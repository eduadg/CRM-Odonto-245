export interface CreateAppointmentData {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  appointmentDate: Date;
  appointmentTime: string;
  duration: number;
  service: string;
  dentist: string;
  notes?: string;
  status:
    | "agendado"
    | "confirmado"
    | "em-andamento"
    | "concluido"
    | "cancelado";
  priority: "baixa" | "normal" | "alta" | "urgente";
}

export interface Appointment extends CreateAppointmentData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentFormProps {
  onSubmit: (data: CreateAppointmentData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateAppointmentData>;
  title?: string;
}
