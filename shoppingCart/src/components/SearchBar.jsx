import { useState } from "react";
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        onSearch(searchTerm);
    };

    return (
        <div className="searchBarContainer"> 
            <input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="searchInput"
            />
            <button onClick={handleSearchClick} className="searchButton">
                <span className="material-symbols-outlined">search</span>
            </button>
        </div>
    );
};

export default SearchBar;