// pages/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Filters from "../components/Filters/Filters";
import SearchBar from "../components/SearchBar/SearchBar";
import GameCard from "../components/GameCard/GameCard";

const Home = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
  
    // Estado para los filtros seleccionados
    const [filters, setFilters] = useState({
      year: { value: "", mode: "none" }, // Año sigue siendo un solo valor
      genre: { value: [], mode: "include" }, // Géneros permiten múltiples selecciones
      platforms: { value: [], mode: "include" }, // Plataformas permiten múltiples selecciones
    });
  
    // Estado para las opciones disponibles
    const [availableOptions, setAvailableOptions] = useState({
      genres: [],
      platforms: [],
    });
  
    // Manejar cambios en los filtros
    const handleFilterChange = (filterName, newValue) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterName]: newValue,
      }));
    };
  
    // Obtener juegos basados en los filtros actuales
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
  
          // Aplicar filtros solo si están activos
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
  
    // Actualizar opciones disponibles cuando cambian los filtros
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
  
    // Función para limpiar filtros
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
        {/* Componente de Filtros */}
        <Filters
          filters={filters}
          availableOptions={availableOptions}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearFilters={clearFilters}
        />
  
        {/* Lista de Juegos */}
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
  
        {/* Paginación */}
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