import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import type { Consultation, CreateConsultationData, ConsultationStats } from "../types/consultation";

const COLLECTION_NAME = "consultations";

const convertFirestoreToConsultation = (
  doc: QueryDocumentSnapshot<DocumentData>
): Consultation => {
  const data = doc.data();
  return {
    id: doc.id,
    patientId: data.patientId,
    patientName: data.patientName,
    appointmentId: data.appointmentId,
    consultationDate: data.consultationDate?.toDate(),
    consultationTime: data.consultationTime,
    dentist: data.dentist,
    specialty: data.specialty,
    chiefComplaint: data.chiefComplaint,
    symptoms: data.symptoms || [],
    diagnosis: data.diagnosis,
    treatment: data.treatment,
    prescription: data.prescription,
    notes: data.notes,
    status: data.status,
    priority: data.priority,
    followUpDate: data.followUpDate?.toDate(),
    followUpNotes: data.followUpNotes,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
};

const convertConsultationToFirestore = (
  consultationData: CreateConsultationData | Partial<CreateConsultationData>
) => {
  const data: any = {
    ...consultationData,
    updatedAt: Timestamp.now(),
  };

  // Convert Date objects to Firestore Timestamps
  if (consultationData.consultationDate) {
    data.consultationDate = Timestamp.fromDate(consultationData.consultationDate);
  }
  if (consultationData.followUpDate) {
    data.followUpDate = Timestamp.fromDate(consultationData.followUpDate);
  }

  return data;
};

export class ConsultationService {
  async createConsultation(data: CreateConsultationData): Promise<Consultation> {
    try {
      const firestoreData = {
        ...convertConsultationToFirestore(data),
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(
        collection(db, COLLECTION_NAME),
        firestoreData
      );
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Erro ao criar consulta");
      }

      return convertFirestoreToConsultation(
        docSnap as QueryDocumentSnapshot<DocumentData>
      );
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
      throw new Error("Erro ao criar consulta");
    }
  }

  async getAllConsultations(): Promise<Consultation[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("consultationDate", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreToConsultation);
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
      throw new Error("Erro ao buscar consultas");
    }
  }

  async getConsultationsByDate(date: Date): Promise<Consultation[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, COLLECTION_NAME),
        where("consultationDate", ">=", Timestamp.fromDate(startOfDay)),
        where("consultationDate", "<=", Timestamp.fromDate(endOfDay)),
        orderBy("consultationDate", "asc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreToConsultation);
    } catch (error) {
      console.error("Erro ao buscar consultas por data:", error);
      throw new Error("Erro ao buscar consultas");
    }
  }

  async getConsultationsByStatus(status: string): Promise<Consultation[]> {
    try {
      if (status === "all") return this.getAllConsultations();

      const q = query(
        collection(db, COLLECTION_NAME),
        where("status", "==", status),
        orderBy("consultationDate", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreToConsultation);
    } catch (error) {
      console.error("Erro ao buscar consultas por status:", error);
      throw new Error("Erro ao buscar consultas");
    }
  }

  async getConsultationsByPatient(patientId: string): Promise<Consultation[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("patientId", "==", patientId),
        orderBy("consultationDate", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreToConsultation);
    } catch (error) {
      console.error("Erro ao buscar consultas do paciente:", error);
      throw new Error("Erro ao buscar consultas do paciente");
    }
  }

  async getConsultationById(id: string): Promise<Consultation | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return convertFirestoreToConsultation(
        docSnap as QueryDocumentSnapshot<DocumentData>
      );
    } catch (error) {
      console.error("Erro ao buscar consulta:", error);
      throw new Error("Erro ao buscar consulta");
    }
  }

  async updateConsultation(
    id: string,
    data: Partial<CreateConsultationData>
  ): Promise<Consultation> {
    try {
      const updateData = convertConsultationToFirestore(data);
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, updateData);

      const updatedDoc = await getDoc(docRef);
      if (!updatedDoc.exists()) {
        throw new Error("Consulta não encontrada");
      }

      return convertFirestoreToConsultation(
        updatedDoc as QueryDocumentSnapshot<DocumentData>
      );
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
      throw new Error("Erro ao atualizar consulta");
    }
  }

  async deleteConsultation(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Erro ao deletar consulta:", error);
      throw new Error("Erro ao deletar consulta");
    }
  }

  async getConsultationStats(): Promise<ConsultationStats> {
    try {
      const allConsultations = await this.getAllConsultations();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const total = allConsultations.length;
      const completed = allConsultations.filter(
        (consultation) => consultation.status === "concluida"
      ).length;
      const inProgress = allConsultations.filter(
        (consultation) => consultation.status === "em-andamento"
      ).length;
      const cancelled = allConsultations.filter(
        (consultation) => consultation.status === "cancelada"
      ).length;

      const todayConsultations = allConsultations.filter((consultation) => {
        const consultationDate = new Date(consultation.consultationDate);
        consultationDate.setHours(0, 0, 0, 0);
        return consultationDate.getTime() === today.getTime();
      }).length;

      const thisWeekConsultations = allConsultations.filter((consultation) => {
        const consultationDate = new Date(consultation.consultationDate);
        return consultationDate >= weekStart && consultationDate <= weekEnd;
      }).length;

      const completionRate =
        total > 0 ? Math.round((completed / (total - cancelled)) * 100) : 0;

      return {
        total,
        completed,
        inProgress,
        cancelled,
        today: todayConsultations,
        thisWeek: thisWeekConsultations,
        completionRate,
      };
    } catch (error) {
      console.error("Erro ao calcular estatísticas:", error);
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        cancelled: 0,
        today: 0,
        thisWeek: 0,
        completionRate: 0,
      };
    }
  }

  async getConsultationsBySpecialty(specialty: string): Promise<Consultation[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("specialty", "==", specialty),
        orderBy("consultationDate", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreToConsultation);
    } catch (error) {
      console.error("Erro ao buscar consultas por especialidade:", error);
      throw new Error("Erro ao buscar consultas por especialidade");
    }
  }

  async getConsultationsByDentist(dentist: string): Promise<Consultation[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("dentist", "==", dentist),
        orderBy("consultationDate", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreToConsultation);
    } catch (error) {
      console.error("Erro ao buscar consultas do dentista:", error);
      throw new Error("Erro ao buscar consultas do dentista");
    }
  }
}

export const consultationService = new ConsultationService();
