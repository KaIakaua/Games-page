// components/Filters.jsx
import React, { useState } from "react";
import { groupedPlatforms } from "../../data/data"; // Importa los datos agrupados

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
  });

  // Manejar el toggle del menú desplegable
  const toggleDropdown = (filterName) => {
    setShowDropdowns((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
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
  };

  return (
    <div className="gb-filters__container">
      {/* Encabezado */}
      <div className="gb-filters__header">
        <h3>Filtrar Resultados</h3>
        <button onClick={onClearFilters} className="clear-filters">
          Limpiar Todos los Filtros
        </button>
      </div>

      {/* Campo de búsqueda */}
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
              {availableOptions.genres.map((genre) => (
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
              ))}
              <li className="gb-filters__actions">
                <button
                  className="gb-btn gb-btn--ghost p0"
                  type="button"
                  onClick={() => clearSpecificFilters("genre")}
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  className="gb-btn gb-btn--ghost p0 hide-on-mobile"
                  onClick={() => setShowDropdowns({ ...showDropdowns, genre: false })}
                >
                  Guardar
                </button>
              </li>
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
              {groupedPlatforms.map((platform) => (
                <li key={platform.value}>
                  <label className="block w400">
                    <input
                      type="checkbox"
                      value={platform.value}
                      checked={filters.platforms.value.includes(platform.value)}
                      onChange={() => handleCheckboxChange("platforms", platform.value)}
                    />
                    {platform.label}
                  </label>
                </li>
              ))}
              <li className="gb-filters__actions">
                <button
                  className="gb-btn gb-btn--ghost p0"
                  type="button"
                  onClick={() => clearSpecificFilters("platforms")}
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  className="gb-btn gb-btn--ghost p0 hide-on-mobile"
                  onClick={() => setShowDropdowns({ ...showDropdowns, platforms: false })}
                >
                  Guardar
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;