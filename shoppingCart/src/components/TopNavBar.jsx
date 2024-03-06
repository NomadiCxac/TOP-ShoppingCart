import SearchBar from "./SearchBar"
import ProfileDisplay from "./ProfileDisplay";
import './TopNavBar.css'

const NotificationButton = () => (
    <button className="notificationButton">
        <span className="material-symbols-outlined">notifications</span>
    </button>
);

const handleSearch = (searchTerm) => {
    console.log(`Searching for: ${searchTerm}`);
    // Implement your search logic here
};

    

const TopNavBar = ({pageName, searchBarOn}) => {

    return (
        <div className='topNav'>
            <div className='topNavLeft'>
                <div className='topNavTitle'>
                    {pageName}
                </div>
            </div>

            <div className='topNavRight'>

            {searchBarOn &&                
                <SearchBar 
                    onSearch={handleSearch} 
                />
            }

            <div className="profileAndNotifications">
                <div className='notificationContainer'>
                    <NotificationButton />
                </div>

                <div className='adminProfile'>
                    <ProfileDisplay />
                </div>
            </div>
                
            </div>
        </div>
    )
}

export default TopNavBar