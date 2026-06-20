import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
    signInWithEmailAndPassword as _signInWithEmailAndPassword,
    sendPasswordResetEmail as _sendPasswordResetEmail,
    onAuthStateChanged as _onAuthStateChanged,
    onIdTokenChanged as _onIdTokenChanged,
} from 'firebase/auth';

import { auth } from './clientApp';

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

export async function createUserWithEmailAndPassword(email, password) {
    try {
        return await _createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Error creating user with email/password:', error);
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