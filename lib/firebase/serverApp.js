import "server-only";

import {cookies} from "next/headers";
import {initializeServerApp, initializeApp} from "firebase/app";

import {getAuth} from "firebase/auth";

export async function getAuthenticatedAppForUser() {
    const authIdToken = (await cookies()).get("__session")?.value;

    const firebaseServerApp = initializeServerApp(
        initializeApp(),
        {
            authIdToken,
        }
    );

    const auth = getAuth(firebaseServerApp);
    await auth.authStateReady();

    return {firebaseServerApp, currentUser: auth.currentUser};
}