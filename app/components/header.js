"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    signInWithGoogle,
    signOut,
    onIdTokenChanged,
} from '../lib/firebase/auth';
import  {setCookie, deleteCookie} from 'cookies-next';

function useUserSession(initialUser) {
    useEffect(() => {
        return onIdTokenChanged(async (user) => {
            if (user) {
                const idToken = await user.getIdToken();
                await setCookie('__session', idToken);
            } else {
                await deleteCookie('__session');
            }
            if (initialUser?.uid === user?.uid) return;
            window.location.reload();
        });
    }, [initialUser]);
}