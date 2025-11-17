import React, { useState } from "react";
import ImageCard from "./ImageCard";

/**
 * ImageGallery - shows skeletons if loading, else grid of ImageCard
 * supports story modal (preview carousel)
 */

export default function ImageGallery({ images = [], loading, apiUrl, onDelete, refresh }) {
  const [storyIndex, setStoryIndex] = useState(-1);

  if (loading) {
    // show 6 skeletons
    return (
      <div className="gallery-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="gallery-grid">
        {images.length === 0 ? (
          <div style={{gridColumn:"1/-1", textAlign:"center", padding:40, color:"var(--muted)"}}>
            No images yet. Click <strong>Upload</strong> to add one.
          </div>
        ) : (
          images.map((img, idx) => (
            <ImageCard
              key={img.id}
              img={img}
              apiUrl={apiUrl}
              onDelete={onDelete}
              onPreview={() => setStoryIndex(idx)}
            />
          ))
        )}
      </div>

      {/* story modal (carousel) */}
      {storyIndex >= 0 && (
        <div className="story-backdrop" onClick={() => setStoryIndex(-1)}>
          <div className="story-slider" onClick={(e) => e.stopPropagation()}>
            <button
              style={{position:"absolute",left:20,top:"50%",transform:"translateY(-50%)",zIndex:90}}
              onClick={() => setStoryIndex((i) => (i - 1 + images.length) % images.length)}
            >
              ◀
            </button>

            <div className="story-slide">
              <img src={`${apiUrl}/images/${images[storyIndex].id}`} alt={images[storyIndex].filename} />
            </div>

            <button
              style={{position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",zIndex:90}}
              onClick={() => setStoryIndex((i) => (i + 1) % images.length)}
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </>
  );
}
