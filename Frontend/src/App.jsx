import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Artworks from "./pages/Artworks";
import ArtworkDetails from "./pages/ArtworkDetails";
import Profile from "./pages/Profile";
import Comments from "./pages/Comments";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <>
      {/* Show Navbar only when user is logged in */}
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Redirect root to login if not authenticated */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        {isAuthenticated && (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/artworks" element={<Artworks />} />
            <Route path="/artworks/:id" element={<ArtworkDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/comments/:id" element={<Comments />} />
          </>
        )}

        {/* Catch-all: redirect to login if not authenticated */}
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </>
  );
}

export default App;
