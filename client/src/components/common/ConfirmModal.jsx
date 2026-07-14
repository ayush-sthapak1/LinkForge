import { useEffect } from "react";
import "../../styles/confirmmodal.css";

function ConfirmModal({ message, onConfirm, onCancel }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div
      className="confirm-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="confirm-modal">
        <div className="confirm-icon">🗑️</div>
        <h2 id="confirm-title" className="confirm-title">Delete Link</h2>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-btn confirm-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-btn confirm-btn-delete"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
