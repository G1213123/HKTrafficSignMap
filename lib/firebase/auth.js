import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
    signInWithEmailAndPassword as _signInWithEmailAndPassword,
    sendPasswordResetEmail as _sendPasswordResetEmail,
    onAuthStateChanged as _onAuthStateChanged,
    onIdTokenChanged as _onIdTokenChanged,
} from 'firebase/auth';

import { auth, db } from './clientApp';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export function onAuthStateChanged(callback) {
    return _onAuthStateChanged(auth, callback);
}

export function onIdTokenChanged(callback) {
    return _onIdTokenChanged(auth, callback);
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        return await signInWithPopup(auth, provider);
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
}

export async function signInWithEmailAndPassword(email, password) {
    try {
        return await _signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Error signing in with email/password:', error);
        throw error;
    }
}

<<<<<<< HEAD
export async function createUserWithEmailAndPassword(email, password, username) {
    try {
        console.log('[Auth] Attempting to create user with email:', email);
        const userCredential = await _createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('[Auth] User created successfully. UID:', user.uid);

        // Save user metadata to Firestore
        console.log('[Auth] Attempting to save user metadata to Firestore...');
        const userDocRef = doc(db, 'users', user.uid);
        console.log('[Auth] Firestore document path:', userDocRef.path);
        
        await setDoc(userDocRef, {
            uid: user.uid,
            username: username,
            email: email,
            createdAt: serverTimestamp(),
        });
        console.log('[Auth] User metadata saved successfully to Firestore.');

        return userCredential;
    } catch (error) {
        console.error('[Auth] Error in createUserWithEmailAndPassword flow:');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
=======
export async function createUserWithEmailAndPassword(email, password) {
    try {
        console.log('[Auth] Attempting to create user with email:', email);
        const userCredential = await _createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('[Auth] User created successfully. UID:', user.uid);

        // Save user metadata to Firestore
        console.log('[Auth] Attempting to save user metadata to Firestore...');
        const userDocRef = doc(db, 'users', user.uid);
        console.log('[Auth] Firestore document path:', userDocRef.path);
        
        await setDoc(userDocRef, {
            uid: user.uid,
            username: username,
            email: email,
            createdAt: serverTimestamp(),
        });
        console.log('[Auth] User metadata saved successfully to Firestore.');

        return userCredential;
    } catch (error) {
        console.error('Error creating user with email/password:', error);
>>>>>>> 000c542 (feat: implement authentication pages with email/password and Google sign-in functionality. Added user registration form.)
        throw error;
    }
}

export async function sendPasswordResetEmail(email) {
    try {
        return await _sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
}

export async function signOut() {
    try {
        return auth.signOut();
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}