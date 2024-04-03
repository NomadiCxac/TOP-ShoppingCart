// firebaseUIConfig.js
import * as firebaseui from 'firebaseui';
import { GoogleAuthProvider, FacebookAuthProvider, EmailAuthProvider, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';

export const getFirebaseUIInstance = (auth) => {
  return firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
};

export const getFirebaseUIConfig = (auth) => ({
    autoUpgradeAnonymousUsers: true, // Enable automatic anonymous user upgrade.
    signInSuccessUrl: '/',
    signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        // FacebookAuthProvider.PROVIDER_ID,
        // EmailAuthProvider.PROVIDER_ID,
        // PhoneAuthProvider.PROVIDER_ID,
        // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
    ],
    signInFlow: 'popup',
    callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            return false; // Avoids redirects after sign-in.
        },
        signInFailure: async (error) => {
            if (error.code === 'firebaseui/anonymous-upgrade-merge-conflict') {
                const cred = error.credential;
                try {
                    await signInWithCredential(auth, cred);
                } catch (signInError) {
                    console.error("Error during anonymous account upgrade", signInError);
                }
            }
            return Promise.resolve();
        },
    },
});