import { useFirebase } from "../context/FirebaseContext"

const ProfileDisplay = () => {
    const { user } = useFirebase();

    return (
    <div className="profileDisplay">
        <img src={user.photoURL}className="profilePicture" />
        <span>{user.displayName}</span>
    </div>
    )
};

export default ProfileDisplay