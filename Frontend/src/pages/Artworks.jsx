import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/api";
import ArtworkCard from "../components/ArtworkCard/ArtworkCard";

const Artworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image: null });
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  // Fetch artworks
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

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Submit new artwork
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      if (form.image) data.append("image", form.image);

      await axios.post("/artworks", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Refresh artworks after upload
      const res = await axios.get("/artworks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setArtworks(res.data.items || res.data);
      setForm({ title: "", description: "", image: null });
    } catch (err) {
      console.error("Error uploading artwork:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit">Upload Artwork</button>
      </form>

      {/* Artwork List */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {artworks.length > 0 ? (
          artworks.map((art) => <ArtworkCard key={art._id} artwork={art} />)
        ) : (
          <p>No artworks found</p>
        )}
      </div>
    </div>
  );
};

export default Artworks;
