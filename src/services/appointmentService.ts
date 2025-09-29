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
import type { Appointment, CreateAppointmentData } from "../types/appointment";

const COLLECTION_NAME = "appointments";

const convertFirestoreToAppointment = (
  doc: QueryDocumentSnapshot<DocumentData>
): Appointment => {
  const data = doc.data();
  return {
    id: doc.id,
    patientName: data.patientName,
    patientPhone: data.patientPhone,
    patientEmail: data.patientEmail,
    appointmentDate: data.appointmentDate?.toDate(),
    appointmentTime: data.appointmentTime,
    duration: data.duration,
    service: data.service,
    dentist: data.dentist,
    notes: data.notes,
    status: data.status,
    priority: data.priority,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
};

const convertAppointmentToFirestore = (
  appointmentData: CreateAppointmentData | Partial<CreateAppointmentData>
) => {
  const data: any = {
    ...appointmentData,
    updatedAt: Timestamp.now(),
  };

  // Convert Date objects to Firestore Timestamps
  if (appointmentData.appointmentDate) {
    data.appointmentDate = Timestamp.fromDate(appointmentData.appointmentDate);
  }

  return data;
};

export class AppointmentService {
  // Alias methods for compatibility
  async getAll(): Promise<Appointment[]> {
    return this.getAllAppointments();
  }

  async create(data: CreateAppointmentData): Promise<Appointment> {
    return this.createAppointment(data);
  }

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    try {
      const conflicts = await this.checkTimeConflicts(
        data.appointmentDate,
        data.appointmentTime,
        data.duration,
        data.dentist
      );

      if (conflicts.length > 0) {
        throw new Error(
          "Conflito de horário detectado. Escolha outro horário."
        );
      }

      const firestoreData = {
        ...convertAppointmentToFirestore(data),
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(
        collection(db, COLLECTION_NAME),
        firestoreData
      );
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Erro ao criar agendamento");
      }

      return convertFirestoreToAppointment(
        docSnap as QueryDocumentSnapshot<DocumentData>
      );
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      throw new Error("Erro ao criar agendamento");
    }
  }

  async getAllAppointments(): Promise<Appointment[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("appointmentDate", "asc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreToAppointment);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      throw new Error("Erro ao buscar agendamentos");
    }
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, COLLECTION_NAME),
        where("appointmentDate", ">=", Timestamp.fromDate(startOfDay)),
        where("appointmentDate", "<=", Timestamp.fromDate(endOfDay)),
        orderBy("appointmentDate", "asc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreToAppointment);
    } catch (error) {
      console.error("Erro ao buscar agendamentos por data:", error);
      throw new Error("Erro ao buscar agendamentos");
    }
  }

  async getAppointmentsByStatus(status: string): Promise<Appointment[]> {
    try {
      if (status === "all") return this.getAllAppointments();

      const q = query(
        collection(db, COLLECTION_NAME),
        where("status", "==", status),
        orderBy("appointmentDate", "asc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreToAppointment);
    } catch (error) {
      console.error("Erro ao buscar agendamentos por status:", error);
      throw new Error("Erro ao buscar agendamentos");
    }
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return convertFirestoreToAppointment(
        docSnap as QueryDocumentSnapshot<DocumentData>
      );
    } catch (error) {
      console.error("Erro ao buscar agendamento:", error);
      throw new Error("Erro ao buscar agendamento");
    }
  }

  async updateAppointment(
    id: string,
    data: Partial<CreateAppointmentData>
  ): Promise<Appointment> {
    try {
      if (
        data.appointmentDate ||
        data.appointmentTime ||
        data.duration ||
        data.dentist
      ) {
        const currentAppointment = await this.getAppointmentById(id);
        if (!currentAppointment) {
          throw new Error("Agendamento não encontrado");
        }

        const conflicts = await this.checkTimeConflicts(
          data.appointmentDate || currentAppointment.appointmentDate,
          data.appointmentTime || currentAppointment.appointmentTime,
          data.duration || currentAppointment.duration,
          data.dentist || currentAppointment.dentist,
          id
        );

        if (conflicts.length > 0) {
          throw new Error(
            "Conflito de horário detectado. Escolha outro horário."
          );
        }
      }

      const updateData = convertAppointmentToFirestore(data);
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, updateData);

      const updatedDoc = await getDoc(docRef);
      if (!updatedDoc.exists()) {
        throw new Error("Agendamento não encontrado");
      }

      return convertFirestoreToAppointment(
        updatedDoc as QueryDocumentSnapshot<DocumentData>
      );
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      throw new Error("Erro ao atualizar agendamento");
    }
  }

  async deleteAppointment(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
      throw new Error("Erro ao deletar agendamento");
    }
  }

  async checkTimeConflicts(
    date: Date,
    time: string,
    duration: number,
    dentist: string,
    excludeId?: string
  ): Promise<Appointment[]> {
    try {
      const dayAppointments = await this.getAppointmentsByDate(date);
      const [hours, minutes] = time.split(":").map(Number);
      const startTime = hours * 60 + minutes; // Convert to minutes
      const endTime = startTime + duration;

      return dayAppointments.filter((apt) => {
        if (excludeId && apt.id === excludeId) return false;
        if (apt.dentist !== dentist) return false;
        if (apt.status === "cancelado") return false;

        const [aptHours, aptMinutes] = apt.appointmentTime
          .split(":")
          .map(Number);
        const aptStartTime = aptHours * 60 + aptMinutes;
        const aptEndTime = aptStartTime + apt.duration;

        // Check for overlap
        return startTime < aptEndTime && endTime > aptStartTime;
      });
    } catch (error) {
      console.error("Erro ao verificar conflitos:", error);
      return [];
    }
  }

  async getAvailableSlots(
    date: Date,
    dentist: string,
    duration = 60
  ): Promise<string[]> {
    try {
      const existingAppointments = await this.getAppointmentsByDate(date);
      const dentistAppointments = existingAppointments.filter(
        (apt) => apt.dentist === dentist && apt.status !== "cancelado"
      );

      const slots: string[] = [];
      const workStart = 8 * 60; // 08:00 in minutes
      const workEnd = 18 * 60; // 18:00 in minutes
      const slotDuration = 30; // 30-minute slots

      for (
        let time = workStart;
        time <= workEnd - duration;
        time += slotDuration
      ) {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        const timeString = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;

        // Check for conflicts
        const hasConflict = dentistAppointments.some((apt) => {
          const [aptHours, aptMinutes] = apt.appointmentTime
            .split(":")
            .map(Number);
          const aptStartTime = aptHours * 60 + aptMinutes;
          const aptEndTime = aptStartTime + apt.duration;
          const slotEndTime = time + duration;

          return time < aptEndTime && slotEndTime > aptStartTime;
        });

        if (!hasConflict) {
          slots.push(timeString);
        }
      }

      return slots;
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
      return [];
    }
  }

  async getAppointmentStats(): Promise<{
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    today: number;
    thisWeek: number;
    confirmationRate: number;
  }> {
    try {
      const allAppointments = await this.getAllAppointments();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const total = allAppointments.length;
      const confirmed = allAppointments.filter(
        (apt) => apt.status === "confirmado"
      ).length;
      const pending = allAppointments.filter(
        (apt) => apt.status === "agendado"
      ).length;
      const cancelled = allAppointments.filter(
        (apt) => apt.status === "cancelado"
      ).length;

      const todayAppointments = allAppointments.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      }).length;

      const thisWeekAppointments = allAppointments.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= weekStart && aptDate <= weekEnd;
      }).length;

      const confirmationRate =
        total > 0 ? Math.round((confirmed / (total - cancelled)) * 100) : 0;

      return {
        total,
        confirmed,
        pending,
        cancelled,
        today: todayAppointments,
        thisWeek: thisWeekAppointments,
        confirmationRate,
      };
    } catch (error) {
      console.error("Erro ao calcular estatísticas:", error);
      return {
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        today: 0,
        thisWeek: 0,
        confirmationRate: 0,
      };
    }
  }
}

export const appointmentService = new AppointmentService();
