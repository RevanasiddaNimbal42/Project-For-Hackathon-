import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/api";
import ArtworkCard from "../components/ArtworkCard/ArtworkCard";

const Artworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await axios.get(`/artworks${query ? `?q=${query}` : ""}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setArtworks(res.data.items || res.data.artworks || res.data);
      } catch (err) {
        console.error(
          "Error fetching artworks:",
          err.response?.data || err.message
        );
      }
    };
    fetchArtworks();
  }, [query]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image) {
      alert("Title and image are required!");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("image", form.image);

    setLoading(true);
    try {
      await axios.post("/artworks", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const res = await axios.get("/artworks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setArtworks(res.data.items || res.data.artworks || res.data);
      setForm({ title: "", description: "", image: null });
    } catch (err) {
      console.error(
        "Error uploading artwork:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Failed to upload artwork");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
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
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Artwork"}
        </button>
      </form>

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
