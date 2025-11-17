import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

/**
 * ImageUpload - supports:
 * - shown as modal when visible
 * - drag & drop + file input
 * - preview image
 * - size/type validation
 * - upload progress
 */

const ALLOWED = ["image/png", "image/jpeg"];
const MAX = 3 * 1024 * 1024; // 3MB

export default function ImageUpload({ visible, onClose, apiUrl, onUploadSuccess }) {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    return () => reader.abort && reader.abort();
  }, [file]);

  useEffect(() => {
    if (!visible) {
      // reset when closed
      setFile(null);
      setPreview(null);
      setProgress(0);
      setErr("");
      setBusy(false);
    }
  }, [visible]);

  const validateAndSet = (f) => {
    setErr("");
    if (!f) return;
    if (!ALLOWED.includes(f.type)) {
      setErr("Only JPEG and PNG allowed.");
      return;
    }
    if (f.size > MAX) {
      setErr("Max file size is 3MB.");
      return;
    }
    setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    validateAndSet(f);
  };

  const upload = async () => {
    if (!file) { setErr("Pick an image first"); return; }
    try {
      setBusy(true);
      setProgress(0);
      const form = new FormData();
      form.append("image", file);
      const res = await axios.post(`${apiUrl}/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          if (ev.total) setProgress(Math.round((ev.loaded * 100) / ev.total));
        },
      });
      onUploadSuccess(res.data);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.error || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-backdrop" onClick={() => !busy && onClose()}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{margin:0}}>Upload Image</h3>
        <p style={{marginTop:6,color:"var(--muted)"}}>JPEG / PNG — max 3MB</p>

        <div
          className={`drop-area ${drag ? "dragover" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            style={{display:"none"}}
            onChange={(e) => validateAndSet(e.target.files?.[0])}
          />
          <div style={{padding:"12px"}}>
            <div style={{fontWeight:800,fontSize:18}}>Drag & Drop or Click to select</div>
            <div style={{marginTop:6,color:"var(--muted)"}}>Your image will show here before uploading</div>
            {preview && <img src={preview} alt="preview" className="preview-img" style={{marginTop:12}} />}
          </div>
        </div>

        {err && <div style={{color:"var(--danger)",marginTop:10,fontWeight:700}}>{err}</div>}

        {progress > 0 && (
          <div style={{marginTop:12}}>
            <div className="progress"><div className="fill" style={{width:`${progress}%`}} /></div>
            <div style={{fontSize:12, marginTop:6}}>{progress}%</div>
          </div>
        )}

        <div style={{display:"flex",gap:10,marginTop:18,justifyContent:"flex-end"}}>
          <button onClick={() => { if (!busy) { setFile(null); setPreview(null); inputRef.current.value = ""; } }} className="theme-toggle">Clear</button>

          <button onClick={upload} className="primary-btn" disabled={busy}>
            {busy ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
