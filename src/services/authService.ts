import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import type { User } from "../types/user";
import { createUserDocument } from "./userService";

export const registerUser = async (
  fullName: string,
  phone: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  if (password !== confirmPassword) {
    throw new Error("As senhas não coincidem.");
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const firebaseUser = userCredential.user;

  const newUser: User = {
    id: firebaseUser.uid,
    fullName,
    phone,
    email,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await createUserDocument(newUser);

  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};
