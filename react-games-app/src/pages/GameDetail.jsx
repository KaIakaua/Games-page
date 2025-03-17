import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import fallbackImage from "../images/no-image.jpg";

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`https://api.rawg.io/api/games/${id}`, {
          params: { key: import.meta.env.VITE_RAWG_API_KEY },
        });
        setGame(response.data);
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (loading) return <p>Cargando detalles...</p>;
  if (!game) return <p>Juego no encontrado.</p>;

  return (
    <div className="game-detail">
      <h1>{game.name}</h1>
      <img
        src={imageError ? fallbackImage : game.background_image || fallbackImage}
        alt={game.name}
        onError={() => setImageError(true)}
        style={{ width: "400px", height: "auto", borderRadius: "8px" }}
      />
      <p>Lanzamiento: {game.released}</p>
      <p>Géneros: {game.genres.map((genre) => genre.name).join(", ")}</p>
      <p>Plataformas: {game.platforms.map((platform) => platform.platform.name).join(", ")}</p>
      <p>Puntuación Metacritic: {game.metacritic || "N/A"}</p>
      <p>Desarrollador: {game.developers.map((dev) => dev.name).join(", ")}</p>
      <p>Tags: {game.tags.map((tag) => tag.name).join(", ")}</p>
    </div>
  );
};

export default GameDetail;