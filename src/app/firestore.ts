import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Gallery, Image, Content } from './shared/models';
import { DocumentData } from 'firebase/firestore'; // Import DocumentData


@Injectable({
  providedIn: 'root'
})
export class FirestoreService { // Renamed class to FirestoreService

  constructor(private firestore: Firestore) { }

  getCollection<T>(collectionPath: string, queries?: any[], orderByField?: string): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionPath);
    let q = query(collectionRef);

    if (queries) {
      queries.forEach(queryParam => {
        q = query(q, where(queryParam.field, queryParam.operator, queryParam.value));
      });
    }

    if (orderByField) {
      q = query(q, orderBy(orderByField));
    }

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as DocumentData }) as T)),
      catchError(error => {
        console.error(`Error getting collection ${collectionPath}:`, error);
        throw error;
      })
    );
  }

  getDocument<T>(collectionPath: string, docId: string): Observable<T | undefined> {
    const docRef = doc(this.firestore, collectionPath, docId);
    return from(getDoc(docRef)).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() as DocumentData } as T;
        } else {
          return undefined;
        }
      }),
      catchError(error => {
        console.error(`Error getting document ${docId} from ${collectionPath}:`, error);
        throw error;
      })
    );
  }

  async addDocument(collectionPath: string, data: any): Promise<any> {
    try {
      const collectionRef = collection(this.firestore, collectionPath);
      return await addDoc(collectionRef, data);
    } catch (error) {
      console.error(`Error adding document to ${collectionPath}:`, error);
      throw error;
    }
  }

  async updateDocument(collectionPath: string, docId: string, data: any): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionPath, docId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`Error updating document ${docId} in ${collectionPath}:`, error);
      throw error;
    }
  }

  async deleteDocument(collectionPath: string, docId: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionPath, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${docId} from ${collectionPath}:`, error);
      throw error;
    }
  }
}
