const SearchBar = ({ onSearch }) => {
    return (
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar juegos..."
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
    );
  };
  
  export default SearchBar;