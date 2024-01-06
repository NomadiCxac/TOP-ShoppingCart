import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import firebaseConfig from '../firebaseConfig';

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [database, setDatabase] = useState(null);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const authInstance = getAuth(app);
        const databaseInstance = getDatabase(app);

        setAuth(authInstance);
        setDatabase(databaseInstance);

        const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
            setUser(currentUser); // Set the user state

            if (currentUser) {
                const idTokenResult = await currentUser.getIdTokenResult();
                setIsAdmin(!!idTokenResult.claims.admin); // Update isAdmin based on the admin claim
            } else {
                setIsAdmin(false); // No user signed in, not an admin
            }
        });

        return () => unsubscribe();  // Cleanup listener
    }, [auth]);

    // Log when isAdmin changes
    useEffect(() => {
        console.log("isAdmin state updated:", isAdmin);
    }, [isAdmin]); // Only re-run the effect if isAdmin changes

    const userSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const value = {
        user,
        auth,
        database,
        userSignOut,
        setUser,
        isAdmin, // Provide isAdmin in the context value for consumption by other components
    };

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    );
};