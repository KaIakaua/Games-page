import React, { useState } from "react";
import { groupedPlatforms } from "../../data/data";
import "./Filters.css";

const Filters = ({
  filters,
  availableOptions,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onClearFilters,
}) => {
  const [showDropdowns, setShowDropdowns] = useState({
    genre: false,
    platforms: false,
    year: false,
  });

  const [searchTerms, setSearchTerms] = useState({
    genre: "",
    platforms: "",
    year: "",
  });

  // Manejar el toggle del menú desplegable
  const toggleDropdown = (filterName) => {
    setShowDropdowns((prev) => {
      const newState = { genre: false, platforms: false, year: false };
      newState[filterName] = !prev[filterName];
      return newState;
    });

    if (showDropdowns[filterName]) {
      setSearchTerms((prev) => ({ ...prev, [filterName]: "" }));
    }
  };

  // Manejar cambios en los checkboxes
  const handleCheckboxChange = (filterName, value) => {
    const currentValues = filters[filterName].value;
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange(filterName, {
      ...filters[filterName],
      value: newValues,
      mode: newValues.length > 0 ? "include" : "none",
    });
  };

  // Limpiar filtros específicos
  const clearSpecificFilters = (filterName) => {
    onFilterChange(filterName, {
      ...filters[filterName],
      value: [],
      mode: "none",
    });
    setSearchTerms((prev) => ({ ...prev, [filterName]: "" }));
  };

  // Filtrar opciones según el término de búsqueda
  const filterOptions = (options, searchTerm) => {
    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="gb-filters__container">
      {/* Encabezado */}
      <div className="gb-filters__header">
        <h3>Filtrar Resultados</h3>
        <button onClick={onClearFilters} className="clear-filters-global">
          Limpiar Todos los Filtros
        </button>
      </div>

      {/* Campo de búsqueda global */}
      <input
        type="text"
        placeholder="Buscar juegos..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="filter-input"
      />

      {/* Contenedor de secciones de filtros */}
      <div className="gb-filters__sections-container">
        {/* Filtro por género */}
        <div className="gb-filters__section">
          <button
            className="gb-filters__toggle gb-btn"
            type="button"
            onClick={() => toggleDropdown("genre")}
          >
            Género:{" "}
            {filters.genre.value.length > 0
              ? `${filters.genre.value.length} seleccionados`
              : "Sin género seleccionado"}
            <i className="fa fa-caret-down ml-2 transition"></i>
          </button>
          {showDropdowns.genre && (
            <ul className="gb-filters__dropdown">
              {/* Header con barra de búsqueda y botón */}
              <li className="gb-filters__header">
                <input
                  type="text"
                  placeholder="Buscar géneros..."
                  value={searchTerms.genre}
                  onChange={(e) =>
                    setSearchTerms((prev) => ({
                      ...prev,
                      genre: e.target.value,
                    }))
                  }
                  className="search-input"
                />
                <button
                  className="clear-filters-header"
                  onClick={() => clearSpecificFilters("genre")}
                >
                  Limpiar Filtros
                </button>
              </li>

              {/* Lista de géneros filtrada */}
              {filterOptions(availableOptions.genres, searchTerms.genre).map(
                (genre) => (
                  <li key={genre}>
                    <label className="block w400">
                      <input
                        type="checkbox"
                        value={genre}
                        checked={filters.genre.value.includes(genre)}
                        onChange={() => handleCheckboxChange("genre", genre)}
                      />
                      {genre
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </label>
                  </li>
                )
              )}
            </ul>
          )}
        </div>

        {/* Filtro por plataformas */}
        <div className="gb-filters__section">
          <button
            className="gb-filters__toggle gb-btn"
            type="button"
            onClick={() => toggleDropdown("platforms")}
          >
            Plataforma:{" "}
            {filters.platforms.value.length > 0
              ? `${filters.platforms.value.length} seleccionadas`
              : "Sin plataforma seleccionada"}
            <i className="fa fa-caret-down ml-2 transition"></i>
          </button>
          {showDropdowns.platforms && (
            <ul className="gb-filters__dropdown">
              {/* Header con barra de búsqueda y botón */}
              <li className="gb-filters__header">
                <input
                  type="text"
                  placeholder="Buscar plataformas..."
                  value={searchTerms.platforms}
                  onChange={(e) =>
                    setSearchTerms((prev) => ({
                      ...prev,
                      platforms: e.target.value,
                    }))
                  }
                  className="search-input"
                />
                <button
                  className="clear-filters-header"
                  onClick={() => clearSpecificFilters("platforms")}
                >
                  Limpiar Filtros
                </button>
              </li>

              {/* Lista de plataformas filtrada */}
              {filterOptions(
                groupedPlatforms.map((platform) => platform.label),
                searchTerms.platforms
              ).map((platformLabel) => {
                const platform = groupedPlatforms.find(
                  (p) => p.label === platformLabel
                );
                return (
                  <li key={platform.value}>
                    <label className="block w400">
                      <input
                        type="checkbox"
                        value={platform.value}
                        checked={filters.platforms.value.includes(platform.value)}
                        onChange={() =>
                          handleCheckboxChange("platforms", platform.value)
                        }
                      />
                      {platform.label}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Filtro por año */}
        <div className="gb-filters__section">
          <button
            className="gb-filters__toggle gb-btn"
            type="button"
            onClick={() => toggleDropdown("year")}
          >
            Año:{" "}
            {filters.year.value
              ? `${filters.year.value}`
              : filters.yearRange.start && filters.yearRange.end
              ? `${filters.yearRange.start} - ${filters.yearRange.end}`
              : "Sin año seleccionado"}
            <i className="fa fa-caret-down ml-2 transition"></i>
          </button>
          {showDropdowns.year && (
            <ul className="gb-filters__dropdown">
              {/* Header con botón "Limpiar Filtros" */}
              <li className="gb-filters__header">
                <button
                  className="clear-filters-header"
                  onClick={() => {
                    onFilterChange("year", { value: "", mode: "none" });
                    onFilterChange("yearRange", { start: "", end: "" });
                  }}
                >
                  Limpiar Filtros
                </button>
              </li>

              {/* Lista de años individuales */}
              <li>
                <select
                  value={filters.year.value}
                  onChange={(e) => {
                    const selectedYear = e.target.value;
                    onFilterChange("year", { value: selectedYear, mode: "include" });
                    onFilterChange("yearRange", { start: "", end: "" }); // Limpiar rango si se selecciona un año individual
                  }}
                >
                  <option value="">Todos los años</option>
                  {Array.from(
                    { length: new Date().getFullYear() - 1969 },
                    (_, i) => 1970 + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </li>

              {/* Rango de años */}
              <li className="year-range">
                <input
                  type="number"
                  placeholder="Año inicial"
                  value={filters.yearRange.start || ""}
                  onChange={(e) => {
                    const startYear = e.target.value;
                    onFilterChange("yearRange", {
                      ...filters.yearRange,
                      start: startYear,
                    });
                    onFilterChange("year", { value: "", mode: "none" }); // Limpiar año individual si se selecciona un rango
                  }}
                />
                <span>a</span>
                <input
                  type="number"
                  placeholder="Año final"
                  value={filters.yearRange.end || ""}
                  onChange={(e) => {
                    const endYear = e.target.value;
                    onFilterChange("yearRange", {
                      ...filters.yearRange,
                      end: endYear,
                    });
                    onFilterChange("year", { value: "", mode: "none" }); // Limpiar año individual si se selecciona un rango
                  }}
                />
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;