import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyBohxZ-GWqr4jN83WYmziXqgz0iXPSYraQ",
  authDomain: "ghanada-art.firebaseapp.com",
  projectId: "ghanada-art",
  storageBucket: "ghanada-art.firebasestorage.app",
  messagingSenderId: "662117785375",
  appId: "1:662117785375:web:b36acc19709bbda78e5a2a",
  measurementId: "G-G07CMPGRJ6"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};
