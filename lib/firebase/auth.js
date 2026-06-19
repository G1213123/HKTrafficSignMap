import {
    GoogleAuthProvider,
    signInWithPopup,
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

export async function signOut() {
    try {
        return auth.signOut();
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}