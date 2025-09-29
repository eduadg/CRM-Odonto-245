export interface Patient {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  birthDate?: Date;
  gender?: 'masculino' | 'feminino' | 'outro';
  cpf?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    medicalConditions?: string[];
    notes?: string;
  };
  dentalInfo?: {
    lastVisit?: Date;
    nextAppointment?: Date;
    treatmentHistory?: string[];
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreatePatientData {
  fullName: string;
  email?: string;
  phone: string;
  birthDate?: Date;
  gender?: 'masculino' | 'feminino' | 'outro';
  cpf?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    medicalConditions?: string[];
    notes?: string;
  };
  dentalInfo?: {
    lastVisit?: Date;
    nextAppointment?: Date;
    treatmentHistory?: string[];
    notes?: string;
  };
}

export interface UpdatePatientData extends Partial<CreatePatientData> {
  id: string;
}

