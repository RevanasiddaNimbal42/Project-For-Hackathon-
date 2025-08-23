import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/api";

const ArtworkDetails = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const { data } = await axios.get(`/artworks/${id}`);
        setArtwork(data);
      } catch (error) {
        console.error("Error fetching artwork:", error);
      }
    };
    fetchArtwork();
  }, [id]);

  if (!artwork) return <p>Loading artwork...</p>;

  return (
    <div
      style={{ padding: "20px", justifyContent: "center", textAlign: "center" }}
    >
      <h1>{artwork.title}</h1>
      <img
        src={artwork.imageUrl}
        alt={artwork.title}
        style={{ width: "300px" }}
      />
      <p>{artwork.description}</p>
      <p>By: {artwork.artist}</p>
    </div>
  );
};

export default ArtworkDetails;
