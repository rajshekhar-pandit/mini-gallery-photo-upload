import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageGallery from "./components/ImageGallery";
import ImageUpload from "./components/ImageUpload";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );

  // load images
  useEffect(() => {
    fetchImages();
    // apply theme class
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  // eslint-disable-next-line
  }, [dark]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/images`);
      // show newest first
      setImages(res.data.slice().reverse());
    } catch (err) {
      console.error("Fetch images error:", err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (imgMeta) => {
    // push at top
    setImages((prev) => [imgMeta, ...prev]);
    setShowUploadModal(false);
  };

  const handleDelete = (id) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleTheme = () => setDark((d) => !d);

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">
          <div className="logo">📸</div>
          <div className="title">Pandit Gallery</div>
        </div>

        <div className="top-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle light/dark"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <button
            className="upload-float-btn small"
            onClick={() => setShowUploadModal(true)}
            title="Upload image"
            aria-label="Open upload"
          >
            ⬆️
          </button>
        </div>
      </header>

      <main className="main-container">
        <section className="hero">
          <div>
            <h1 className="hero-title">Mini Image Gallery</h1>
            <p className="hero-sub">
              Upload beautiful moments. Rounded cards, smooth animations.
            </p>
          </div>

          <div className="hero-actions">
            <button
              className="primary-btn"
              onClick={() => setShowUploadModal(true)}
            >
              <span className="plus">＋</span> Upload Image
            </button>
          </div>
        </section>

        <ImageUpload
          visible={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          apiUrl={API}
          onUploadSuccess={handleUploadSuccess}
        />

        <ImageGallery
          images={images}
          loading={loading}
          apiUrl={API}
          onDelete={handleDelete}
          refresh={fetchImages}
        />
      </main>
{/* 
      <footer className="footer">
        <small>Built with ❤️ — Foresight Gallery</small>
      </footer> */}

      {/* floating upload button bottom-right */}
      <button
        className="upload-float-btn"
        onClick={() => setShowUploadModal(true)}
        title="Upload"
      >
        ⬆️
      </button>
    </div>
  );
}

export default App;
