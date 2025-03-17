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
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    year: { value: "", mode: "none" }, // Filtro de año individual
    yearRange: { start: "", end: "" }, // Filtro de rango de años
    genre: { value: [], mode: "include" },
    platforms: { value: [], mode: "include" },
    tags: { value: [], mode: "include" },
    developers: { value: [], mode: "include" },
  });

  const [availableOptions, setAvailableOptions] = useState({
    genres: [],
    platforms: [],
    tags: [],
    developers: [],
  });

  // Fetch games based on filters, search, and pagination
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
  
        // Aplicar filtro de año individual
        if (filters.year.mode === "include" && filters.year.value) {
          params.dates = `${filters.year.value}-01-01,${filters.year.value}-12-31`;
        }
  
        // Aplicar filtro de rango de años
        if (filters.yearRange.start && filters.yearRange.end) {
          const startYear = Math.max(parseInt(filters.yearRange.start), 1000); // Asegurar que el año mínimo sea 1000
          const endYear = Math.max(parseInt(filters.yearRange.end), 1000); // Asegurar que el año mínimo sea 1000
          params.dates = `${startYear}-01-01,${endYear}-12-31`;
        }
  
        // Aplicar otros filtros
        if (filters.genre.mode === "include" && filters.genre.value.length > 0) {
          params.genres = filters.genre.value.join(",");
        }
        if (filters.platforms.mode === "include" && filters.platforms.value.length > 0) {
          params.platforms = filters.platforms.value.join(",");
        }
        if (filters.tags.mode === "include" && filters.tags.value.length > 0) {
          params.tags = filters.tags.value.join(",");
        }
        if (filters.developers.mode === "include" && filters.developers.value.length > 0) {
          params.developers = filters.developers.value.join(",");
        }
  
        const response = await axios.get("https://api.rawg.io/api/games", { params });
        setGames(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 20));
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchGames();
  }, [currentPage, filters, searchQuery]);
  
  // Fetch available options for filters
  useEffect(() => {
    const fetchAvailableOptions = async () => {
      try {
        const [genresResponse, platformsResponse, tagsResponse, developersResponse] =
          await Promise.all([
            axios.get("https://api.rawg.io/api/genres", { params: { key: import.meta.env.VITE_RAWG_API_KEY } }),
            axios.get("https://api.rawg.io/api/platforms", { params: { key: import.meta.env.VITE_RAWG_API_KEY } }),
            axios.get("https://api.rawg.io/api/tags", { params: { key: import.meta.env.VITE_RAWG_API_KEY } }),
            axios.get("https://api.rawg.io/api/developers", { params: { key: import.meta.env.VITE_RAWG_API_KEY } }),
          ]);

        setAvailableOptions({
          genres: genresResponse.data.results.map((genre) => genre.name),
          platforms: platformsResponse.data.results.map((platform) => ({
            value: platform.id,
            label: platform.name,
          })),
          tags: tagsResponse.data.results.map((tag) => tag.name),
          developers: developersResponse.data.results.map((developer) => developer.slug),
        });
      } catch (error) {
        console.error("Error fetching available options:", error);
      }
    };

    fetchAvailableOptions();
  }, []);

  // Clear all filters and reset search
  const clearFilters = () => {
    setFilters({
      year: { value: "", mode: "none" },
      yearRange: { start: "", end: "" },
      genre: { value: [], mode: "none" },
      platforms: { value: [], mode: "none" },
      tags: { value: [], mode: "none" },
      developers: { value: [], mode: "none" },
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  if (loading) return <p>Cargando juegos...</p>;

  return (
    <div className="home">
      <Filters
        filters={filters}
        availableOptions={availableOptions}
        onFilterChange={(filterName, newValue) =>
          setFilters((prev) => ({ ...prev, [filterName]: newValue }))
        }
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearFilters={clearFilters}
      />

      <h1>Top Games by Metacritic</h1>
      <div className="game-list">
        {games.length > 0 ? (
          games.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p>No se encontraron juegos con los criterios seleccionados.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Home;