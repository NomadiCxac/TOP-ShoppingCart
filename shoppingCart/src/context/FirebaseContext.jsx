import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut,  signInAnonymously as firebaseSignInAnonymously } from 'firebase/auth';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import firebaseConfig from '../firebaseConfig';

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({children}) => {
    const [isFirebaseReady, setIsFirebaseReady] = useState(false);
    const [app, setApp] = useState(null);
    const [auth, setAuth] = useState(null);
    const [database, setDatabase] = useState(null);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOrderingAvailable, setIsOrderingAvailable] = useState(true); // Add isOrderAvailable state

    const [anonymousOrderId, setAnonymousOrderId] = useState(null); // Add anonymousOrderId state
    const [anonymousOrder, setAnonymousOrder] = useState([]); // Add anonymousOrderId state
    const [referenceOrderId, setReferenceOrderId] = useState("");
    
    useEffect(() => {
        
        try {

            let appInstance;
            if (!getApps().length) {
                appInstance = initializeApp(firebaseConfig); // Initialize if no apps
            } else {
                appInstance = getApps()[0]; // Use the existing app if already initialized
            }
            setApp(appInstance);
    
            const authInstance = getAuth(appInstance);
            const databaseInstance = getDatabase(appInstance);

            setAuth(authInstance);
            setDatabase(databaseInstance);
    
            const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
                setUser(currentUser); // Set the user state
            
                if (currentUser) {
                    try {
                        const idTokenResult = await currentUser.getIdTokenResult();
                        setIsAdmin(!!idTokenResult.claims.admin); // Update isAdmin based on the admin claim
                    } catch (error) {
                        console.error("Error fetching ID token result: ", error);
                    }
                } else {
                    setIsAdmin(false); // No user signed in, not an admin
                    setAnonymousOrderId(null); // Reset anonymousOrderId when there is no user
                }

                setIsFirebaseReady(true); // Set to true once everything is initialized

            });

           
            return () => unsubscribe(); // Cleanup listener
        } catch (error) {
            console.error("Firebase initialization error: ", error);
        }
    }, []);


    useEffect(() => {
        if (database) { // Make sure database is initialized
            const orderingAvailabilityRef = ref(database, 'settings/orderingAvailability');
            const unsubscribeOrderingAvailability = onValue(orderingAvailabilityRef, (snapshot) => {
                const isAvailable = snapshot.val();
                setIsOrderingAvailable(isAvailable !== null ? isAvailable : false); // 
            });

            return () => unsubscribeOrderingAvailability(); // Return the cleanup function
        }
    }, [database]); // Rerun this effect if the database instance changes


    // Log when isAdmin changes
    useEffect(() => {
        console.log("isAdmin state updated:", isAdmin);
    }, [isAdmin]); // Only re-run the effect if isAdmin changes

    const signInAnonymously = async (orderId) => {
        console.log(orderId)
        if (!user) { // Only sign in if there's no current user
            try {
                const result = await firebaseSignInAnonymously(auth);
                console.log("Signed in as an anonymous user:", result.user);
                console.log("Did not step into set Anonymous OrderId" + orderId)
                if (orderId) {
                    localStorage.setItem('anonymousOrderId', orderId); // Store orderId in localStorage
                    setAnonymousOrderId(orderId);
                }
            } catch (error) {
                console.error("Could not sign in anonymously:", error);
            }
        }
    };

    const switchOrderingAvailability = async () => {

        if (database && isAdmin) {
            try {
                const orderingAvailabilityRef = ref(database, 'settings/orderingAvailability');

                const snapshot = await get(orderingAvailabilityRef);
                const availabilityStatus = snapshot.val();

                if (availabilityStatus) {
                    set(orderingAvailabilityRef, false)
                } else {
                    set(orderingAvailabilityRef, true)
                }

            } catch (error) {
                console.error("Could not access the reference location", error);
                return
            }
        }
    }

    const userSignOut = async () => {
        console.log("Attempting to sign out");
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            // Optionally, reset any user-related state here
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const value = {
        app,
        isAdmin, // Provide isAdmin in the context value for consumption by other components
        user,
        auth,
        database,
        isFirebaseReady,
        isOrderingAvailable,
        anonymousOrderId,
        anonymousOrder,
        referenceOrderId,
        switchOrderingAvailability,
        setReferenceOrderId,
        setAnonymousOrder,
        setAnonymousOrderId,
        userSignOut,
        setUser,
        signInAnonymously
    };

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    );
};