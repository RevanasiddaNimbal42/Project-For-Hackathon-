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
        const res = await axios.get(`/artworks${query ? `?q=${query}` : ""}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setArtworks(res.data.items || res.data);
      } catch (err) {
        console.error(err);
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
      {artworks.map((art) => (
        <ArtworkCard key={art._id} artwork={art} />
      ))}
    </div>
  );
};

export default Artworks;
