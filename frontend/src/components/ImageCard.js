import React, { useState } from "react";
import axios from "axios";

export default function ImageCard({ img, apiUrl, onDelete, onPreview }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${apiUrl}/images/${img.id}`);
      onDelete(img.id);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="image-card">
        <div className="image-thumb" onClick={onPreview} role="button" title="View">
          <img src={`${apiUrl}/images/${img.id}`} alt={img.filename} />
        </div>

        <div className="meta">
          <div className="name" title={img.filename}>{img.filename.length > 24 ? img.filename.slice(0,24)+"..." : img.filename}</div>

          <div className="actions">
            <button className="theme-toggle" onClick={() => setConfirmOpen(true)} title="Delete">🗑️</button>
          </div>
        </div>
      </div>

      {/* confirmation modal */}
      {confirmOpen && (
        <div className="modal-backdrop" onClick={() => setConfirmOpen(false)}>
          <div className="confirm" onClick={(e) => e.stopPropagation()}>
            <h3 style={{margin:0}}>Delete image?</h3>
            <p style={{color:"var(--muted)",marginTop:8}}>This will permanently remove the image from memory.</p>

            <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:14}}>
              <button className="theme-toggle" onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button className="primary-btn" onClick={remove} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
