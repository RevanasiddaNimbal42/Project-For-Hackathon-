import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/api";
import ArtworkCard from "../components/ArtworkCard/ArtworkCard";

const Artworks = () => {
  const [artworks, setArtworks] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await axios.get(`/artworks${query ? `?q=${query}` : ""}`);
        console.log("API response:", res.data);
        setArtworks(res.data.artworks || res.data.items || res.data);
      } catch (err) {
        console.error(
          "Error fetching artworks:",
          err.response?.data || err.message
        );
      }
    };
    fetchArtworks();
  }, [query]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        padding: "20px",
      }}
    >
      {artworks.length > 0 ? (
        artworks.map((art) => <ArtworkCard key={art._id} artwork={art} />)
      ) : (
        <p>No artworks found</p>
      )}
    </div>
  );
};

export default Artworks;
