import React, { useEffect, useState } from "react";
import axios from "../api/api";
import ArtworkCard from "../components/ArtworkCard/ArtworkCard";

const Home = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await axios.get("/artworks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setArtworks(res.data.items || res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArtworks();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      {artworks.map((art) => (
        <ArtworkCard key={art._id} artwork={art} />
      ))}
    </div>
  );
};

export default Home;
