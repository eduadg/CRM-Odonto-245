import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import type { User } from "../types/user";

export const createUserDocument = async (user: User) => {
  const userRef = doc(db, "users", user.id);
  await setDoc(userRef, user);
};

export const getUserById = async (id: string): Promise<User | null> => {
  const userRef = doc(db, "users", id);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data() as User;
  }

  return null;
};
