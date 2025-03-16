// pages/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Filters from "../components/Filters/Filters";
import SearchBar from "../components/SearchBar/SearchBar";
import GameCard from "../components/GameCard/GameCard";
import "./Home.css";

const Home = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
  
    const [filters, setFilters] = useState({
      year: { value: "", mode: "none" },
      genre: { value: [], mode: "include" },
      platforms: { value: [], mode: "include" }, 
    });
  
    const [availableOptions, setAvailableOptions] = useState({
      genres: [],
      platforms: [],
    });
  
    const handleFilterChange = (filterName, newValue) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterName]: newValue,
      }));
    };
  
    useEffect(() => {
      const fetchGames = async () => {
        try {
          const params = {
            key: import.meta.env.VITE_RAWG_API_KEY,
            ordering: "-metacritic",
            page: currentPage,
            page_size: 20,
            search: searchQuery || undefined,
          };
  
          if (filters.year.mode === "include") {
            params.dates = `${filters.year.value}-01-01,${filters.year.value}-12-31`;
          }
  
          if (filters.genre.mode === "include" && filters.genre.value.length > 0) {
            params.genres = filters.genre.value.join(",");
          }
  
          if (filters.platforms.mode === "include" && filters.platforms.value.length > 0) {
            params.platforms = filters.platforms.value.join(",");
          }
  
          const response = await axios.get("https://api.rawg.io/api/games", { params });
          setGames(response.data.results);
        } catch (error) {
          console.error("Error fetching games:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchGames();
    }, [currentPage, filters, searchQuery]);
  
    useEffect(() => {
      const fetchAvailableOptions = async () => {
        try {
          const genresResponse = await axios.get("https://api.rawg.io/api/genres", {
            params: { key: import.meta.env.VITE_RAWG_API_KEY },
          });
          const platformsResponse = await axios.get("https://api.rawg.io/api/platforms", {
            params: { key: import.meta.env.VITE_RAWG_API_KEY },
          });
  
          setAvailableOptions({
            genres: genresResponse.data.results.map((genre) => genre.slug),
            platforms: platformsResponse.data.results.map((platform) => ({
              value: platform.id,
              label: platform.name,
            })),
          });
        } catch (error) {
          console.error("Error fetching available options:", error);
        }
      };
      fetchAvailableOptions();
    }, []);
  
    const clearFilters = () => {
      setFilters({
        year: { value: "", mode: "none" },
        genre: { value: [], mode: "none" },
        platforms: { value: [], mode: "none" },
      });
      setSearchQuery("");
      setCurrentPage(1);
    };
  
    if (loading) return <p>Cargando juegos...</p>;
  
    return (
      <div>
        <Filters
          filters={filters}
          availableOptions={availableOptions}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearFilters={clearFilters}
        />
  
        <h1>Top Games by Metacritic</h1>
        <ul className="game-list">
          {games.length > 0 ? (
            games.map((game) => (
              <li key={game.id}>
                <GameCard game={game} />
              </li>
            ))
          ) : (
            <p>No se encontraron juegos con los criterios seleccionados.</p>
          )}
        </ul>
  
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>Página {currentPage}</span>
          <button onClick={() => setCurrentPage((prev) => prev + 1)}>Siguiente</button>
        </div>
      </div>
    );
  };
  
  export default Home;