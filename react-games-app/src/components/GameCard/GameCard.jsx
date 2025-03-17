import { useNavigate } from "react-router-dom";
import { useState } from "react";
import fallbackImage from "../../images/no-image.jpg";

const GameCard = ({ game }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleGameClick = () => {
    navigate(`/game/${game.id}`);
  };

  return (
    <div className="game-card" onClick={handleGameClick}>
      <img
        src={imageError ? fallbackImage : game.background_image || fallbackImage}
        alt={game.name}
        onError={() => setImageError(true)}
        style={{ width: "400px", height: "auto", borderRadius: "8px" }}
      />
      <h3>{game.name}</h3>
      <p>Puntuación: {game.metacritic || "N/A"}</p>
    </div>
  );
};

export default GameCard;