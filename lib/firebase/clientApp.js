"use client";

import {getAuth} from 'firebase/auth';
import {getFirestore, initializeFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {firebaseApp} from './firebaseConfig';


export const auth = getAuth(firebaseApp);
export const db = initializeFirestore(firebaseApp, {}, "road-sign-factory-default");
export const storage = getStorage(firebaseApp);