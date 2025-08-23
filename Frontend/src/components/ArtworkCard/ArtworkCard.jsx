import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ArtworkCard.module.css";

const ArtworkCard = ({ artwork }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <img
        src={`http://localhost:5000${artwork.imageUrl}`}
        alt={artwork.title}
      />
      <h3>{artwork.title}</h3>
      <p>{artwork.artForm}</p>
      <button onClick={() => navigate(`/artworks/${artwork._id}`)}>
        View Details
      </button>
    </div>
  );
};

export default ArtworkCard;
