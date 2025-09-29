import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import type { Patient, CreatePatientData, UpdatePatientData } from '../types/patient';

const COLLECTION_NAME = 'patients';

// Converter dados do Firestore para o tipo Patient
const convertFirestoreToPatient = (doc: QueryDocumentSnapshot<DocumentData>): Patient => {
  const data = doc.data();
  return {
    id: doc.id,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    birthDate: data.birthDate?.toDate(),
    gender: data.gender,
    cpf: data.cpf,
    address: data.address,
    emergencyContact: data.emergencyContact,
    medicalInfo: data.medicalInfo,
    dentalInfo: {
      ...data.dentalInfo,
      lastVisit: data.dentalInfo?.lastVisit?.toDate(),
      nextAppointment: data.dentalInfo?.nextAppointment?.toDate(),
    },
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
    createdBy: data.createdBy,
  };
};

// Converter dados do Patient para o formato do Firestore
const convertPatientToFirestore = (patientData: CreatePatientData | UpdatePatientData) => {
  const data: any = {
    ...patientData,
    updatedAt: Timestamp.now(),
  };

  // Converter datas para Timestamp
  if (patientData.birthDate) {
    data.birthDate = Timestamp.fromDate(patientData.birthDate);
  }

  if (patientData.dentalInfo?.lastVisit) {
    data.dentalInfo = {
      ...data.dentalInfo,
      lastVisit: Timestamp.fromDate(patientData.dentalInfo.lastVisit),
    };
  }

  if (patientData.dentalInfo?.nextAppointment) {
    data.dentalInfo = {
      ...data.dentalInfo,
      nextAppointment: Timestamp.fromDate(patientData.dentalInfo.nextAppointment),
    };
  }

  return data;
};

export const patientService = {
  // Criar um novo paciente
  async createPatient(patientData: CreatePatientData, userId: string): Promise<Patient> {
    try {
      const data = {
        ...convertPatientToFirestore(patientData),
        createdAt: Timestamp.now(),
        createdBy: userId,
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Erro ao criar paciente');
      }

      return convertFirestoreToPatient(docSnap as QueryDocumentSnapshot<DocumentData>);
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      throw new Error('Erro ao criar paciente');
    }
  },

  // Buscar todos os pacientes
  async getAllPatients(): Promise<Patient[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreToPatient);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      throw new Error('Erro ao buscar pacientes');
    }
  },

  // Buscar paciente por ID
  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return convertFirestoreToPatient(docSnap as QueryDocumentSnapshot<DocumentData>);
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      throw new Error('Erro ao buscar paciente');
    }
  },

  // Buscar pacientes por nome
  async searchPatientsByName(name: string): Promise<Patient[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('fullName', '>=', name),
        where('fullName', '<=', name + '\uf8ff'),
        orderBy('fullName')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreToPatient);
    } catch (error) {
      console.error('Erro ao buscar pacientes por nome:', error);
      throw new Error('Erro ao buscar pacientes');
    }
  },

  // Atualizar paciente
  async updatePatient(patientData: UpdatePatientData): Promise<Patient> {
    try {
      const { id, ...updateData } = patientData;
      const data = convertPatientToFirestore(updateData as CreatePatientData);
      
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
      
      const updatedDoc = await getDoc(docRef);
      if (!updatedDoc.exists()) {
        throw new Error('Paciente não encontrado');
      }

      return convertFirestoreToPatient(updatedDoc as QueryDocumentSnapshot<DocumentData>);
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      throw new Error('Erro ao atualizar paciente');
    }
  },

  // Deletar paciente
  async deletePatient(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar paciente:', error);
      throw new Error('Erro ao deletar paciente');
    }
  },

  // Buscar pacientes por CPF
  async getPatientByCpf(cpf: string): Promise<Patient | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('cpf', '==', cpf)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      return convertFirestoreToPatient(querySnapshot.docs[0]);
    } catch (error) {
      console.error('Erro ao buscar paciente por CPF:', error);
      throw new Error('Erro ao buscar paciente');
    }
  },

  // Buscar pacientes por telefone
  async getPatientByPhone(phone: string): Promise<Patient | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('phone', '==', phone)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      return convertFirestoreToPatient(querySnapshot.docs[0]);
    } catch (error) {
      console.error('Erro ao buscar paciente por telefone:', error);
      throw new Error('Erro ao buscar paciente');
    }
  },
};
