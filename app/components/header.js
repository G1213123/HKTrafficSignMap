"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signInWithGoogle, signOut, onAuthStateChanged, onIdTokenChanged } from '../../lib/firebase/auth';
import  {setCookie, deleteCookie} from 'cookies-next';

export function useUserSession() {
  useEffect(() => {
    return onAuthStateChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie('__session', idToken);
      } else {
        await deleteCookie('__session');
      }
      // Removed window.location.reload() to prevent infinite refresh loops
    });
  }, []);
}