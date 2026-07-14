import { useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../../styles/qrmodal.css";

function QRModal({ url, onClose }) {
  const canvasRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleDownload = () => {
    // Find the canvas rendered by QRCodeCanvas
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="qr-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="qr-modal">
        {/* Header */}
        <div className="qr-modal-header">
          <h2>QR Code</h2>
          <button className="qr-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* QR Code */}
        <div className="qr-code-wrapper" ref={canvasRef}>
          <QRCodeCanvas
            value={url}
            size={220}
            level="H"
            marginSize={1}
            bgColor="#ffffff"
            fgColor="#0f172a"
          />
        </div>

        {/* Short URL */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="qr-short-url"
        >
          {url}
        </a>

        {/* Actions */}
        <div className="qr-actions">
          <button className="qr-btn qr-btn-download" onClick={handleDownload}>
            ↓ Download PNG
          </button>
          <button className="qr-btn qr-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRModal;
