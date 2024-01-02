// useAuth.js
import { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';

const useAuth = () => {
    const { auth } = useFirebase();
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        });
        return () => unsubscribe(); // Cleanup subscription
    }, [auth]);

    return { user, isLoggedIn };
};

export default useAuth;