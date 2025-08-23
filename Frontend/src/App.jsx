import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Artworks from "./pages/Artworks";
import ArtworkDetails from "./pages/ArtworkDetails";
import Profile from "./pages/Profile";
import Comments from "./pages/Comments";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // Listen for token changes in localStorage
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkAuth);
    checkAuth();

    return () => window.removeEventListener("storage", checkAuth);
  }, [location]);

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
        <Route path="/login" element={<Login onAuth={() => setIsAuthenticated(true)} />} />
        <Route path="/register" element={<Register onAuth={() => setIsAuthenticated(true)} />} />

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
