// src/firebase/firestoreUtils.js
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "./firebaseconfig";

// Function to add a new user
export const addUser = async (user) => {
  try {
    const usersRef = collection(db, "users");
    await addDoc(usersRef, user);
  } catch (error) {
    console.error("Error adding user: ", error);
    throw error;
  }
};

// Function to get user by username and password
export const getUser = async (username, password) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username), where("password", "==", password));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    } else {
      return querySnapshot.docs[0].data();
    }
  } catch (error) {
    console.error("Error fetching user: ", error);
    throw error;
  }
};

// Function to check if a username exists
export const doesUserExist = async (username) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if user exists: ", error);
    throw error;
  }
};
