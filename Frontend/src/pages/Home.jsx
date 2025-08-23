import React, { useEffect, useState } from "react";
import axios from "../api/api";
import ArtworkCard from "../components/ArtworkCard/ArtworkCard";

const Home = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        const res = await axios.get("/artworks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API response:", res.data);

        setArtworks(res.data.artworks || res.data.items || res.data);
      } catch (err) {
        console.error(
          "Fetch artworks error:",
          err.response?.data || err.message
        );
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
      {artworks.length > 0 ? (
        artworks.map((art) => <ArtworkCard key={art._id} artwork={art} />)
      ) : (
        <p>No artworks found.</p>
      )}
    </div>
  );
};

export default Home;
