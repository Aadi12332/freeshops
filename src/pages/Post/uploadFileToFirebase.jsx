// src/utils/uploadToFirebase.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseConfig";

export const uploadFileToFirebase = async (file, path = "uploads") => {
  try {
    const timestamp = Date.now();
    const fileRef = ref(storage, `${path}/${timestamp}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Firebase Upload Error:", error);
    throw error;
  }
};
