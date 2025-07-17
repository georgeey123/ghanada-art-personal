import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';





@Injectable({
  providedIn: 'root'
})
export class FirebaseStorage {

  constructor(private storage: Storage) { }

  async uploadFile(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(url: string): Promise<void> {
    const storageRef = ref(this.storage, url);
    return deleteObject(storageRef);
  }
}
