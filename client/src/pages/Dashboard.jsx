import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getAllUrls, deleteUrl, updateUrl } from "../services/urlService";
import QRModal from "../components/common/QRModal";
import ConfirmModal from "../components/common/ConfirmModal";
import "../styles/dashboard.css";

function Dashboard() {
  const { logout } = useContext(AuthContext);
  const { addToast } = useToast();

  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Inline editing
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Copy feedback
  const [copiedId, setCopiedId] = useState(null);

  // QR modal
  const [qrUrl, setQrUrl] = useState(null);

  // Delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    document.title = "Dashboard | LinkForge";
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllUrls();
      setUrls(data.urls || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch URLs.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const getAbsoluteShortUrl = useCallback((shortCode) => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
    const origin = apiBaseUrl.replace("/api", "");
    return `${origin}/${shortCode}`;
  }, []);

  const getExpirationDetails = useCallback((expiresAt) => {
    if (!expiresAt) return { text: "Never", isExpired: false, statusLabel: "Active" };
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    if (now > expiryDate) return { text: "Expired", isExpired: true, statusLabel: "Expired" };
    const formattedDate = expiryDate.toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
    });
    return { text: `Expires ${formattedDate}`, isExpired: false, statusLabel: "Active" };
  }, []);

  // ─── Derived data (useMemo) ──────────────────────────────────────────────────

  const filteredUrls = useMemo(() => {
    if (!searchQuery.trim()) return urls;
    const q = searchQuery.toLowerCase();
    return urls.filter(
      (u) =>
        u.originalUrl.toLowerCase().includes(q) ||
        u.shortCode.toLowerCase().includes(q) ||
        getAbsoluteShortUrl(u.shortCode).toLowerCase().includes(q)
    );
  }, [urls, searchQuery, getAbsoluteShortUrl]);

  const sortedUrls = useMemo(() => {
    const arr = [...filteredUrls];
    switch (sortOrder) {
      case "oldest":
        return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "most-clicked":
        return arr.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
      case "least-clicked":
        return arr.sort((a, b) => (a.clickCount || 0) - (b.clickCount || 0));
      case "az":
        return arr.sort((a, b) => a.shortCode.localeCompare(b.shortCode));
      case "za":
        return arr.sort((a, b) => b.shortCode.localeCompare(a.shortCode));
      default: // newest
        return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [filteredUrls, sortOrder]);

  const totalLinks = useMemo(() => urls.length, [urls]);
  const totalClicks = useMemo(
    () => urls.reduce((sum, item) => sum + (item.clickCount || 0), 0),
    [urls]
  );

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleCopy = useCallback(async (id, shortCode) => {
    const shortUrl = getAbsoluteShortUrl(shortCode);
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      addToast("Link copied to clipboard!", "success");
    } catch {
      addToast("Failed to copy link.", "error");
    }
  }, [getAbsoluteShortUrl, addToast]);

  const handleDeleteRequest = useCallback((id) => {
    setConfirmDeleteId(id);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setUrls((prev) => prev.filter((u) => u._id !== id));
    try {
      await deleteUrl(id);
      addToast("Link deleted.", "success");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to delete link.";
      addToast(msg, "error");
      fetchUrls();
    }
  }, [confirmDeleteId, addToast]);

  const handleDeleteCancel = useCallback(() => {
    setConfirmDeleteId(null);
  }, []);

  const handleEditStart = useCallback((id, currentOriginalUrl) => {
    setEditingId(id);
    setEditValue(currentOriginalUrl);
  }, []);

  const handleEditSave = useCallback(async (id) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    setIsSaving(true);
    try {
      const response = await updateUrl(id, { originalUrl: trimmed });
      setUrls((prev) =>
        prev.map((u) => (u._id === id ? { ...u, originalUrl: response.url.originalUrl } : u))
      );
      setEditingId(null);
      setEditValue("");
      addToast("Link updated.", "success");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update link.";
      addToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  }, [editValue, addToast]);

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditValue("");
  }, []);

  const handleLogout = useCallback(() => {
    addToast("You've been logged out.", "info");
    setTimeout(() => logout(), 300);
  }, [logout, addToast]);

  // ─── Loading state ───────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div>
        <nav className="navbar">
          <Link to="/" className="logo">LinkForge</Link>
          <button type="button" onClick={handleLogout} className="btn-logout">Logout</button>
        </nav>
        <div className="loading-view">
          <div className="spinner-large"></div>
          <p className="loading-text">Fetching your dashboard…</p>
        </div>
      </div>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────────────────

  return (
    <>
      <div>
        {/* Navbar */}
        <nav className="navbar">
          <Link to="/" className="logo">LinkForge</Link>
          <button type="button" onClick={handleLogout} className="btn-logout">Logout</button>
        </nav>

        <div className="dashboard-container">
          {/* Error Banner */}
          {error && (
            <div className="error-banner" role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Dashboard Title */}
          <div className="dashboard-header">
            <h1>My Links</h1>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-card-icon">🔗</div>
              <h3>Total Links</h3>
              <p className="stats-value">{totalLinks}</p>
            </div>
            <div className="stats-card">
              <div className="stats-card-icon">📈</div>
              <h3>Total Clicks</h3>
              <p className="stats-value">{totalClicks}</p>
            </div>
          </div>

          {/* Links Section */}
          <div className="links-section-header">
            <h2 className="links-section-title">Links</h2>

            {urls.length > 0 && (
              <div className="search-sort-bar">
                {/* Search */}
                <div className="search-wrapper">
                  <span className="search-icon" aria-hidden="true">🔍</span>
                  <input
                    type="search"
                    id="dashboard-search"
                    className="search-input"
                    placeholder="Search links…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search your links"
                  />
                </div>

                {/* Sort */}
                <label htmlFor="sort-order" className="visually-hidden">Sort by</label>
                <select
                  id="sort-order"
                  className="sort-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  aria-label="Sort links"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="most-clicked">Most Clicked</option>
                  <option value="least-clicked">Least Clicked</option>
                  <option value="az">A → Z</option>
                  <option value="za">Z → A</option>
                </select>
              </div>
            )}
          </div>

          {/* Empty state — no links at all */}
          {urls.length === 0 ? (
            <div className="empty-view">
              <div className="empty-icon">🔗</div>
              <h3 className="empty-title">No links yet</h3>
              <p className="empty-description">
                Create your first shortened link and start tracking clicks.
              </p>
              <Link to="/" className="btn-create-first">
                Create your first link
              </Link>
            </div>
          ) : sortedUrls.length === 0 ? (
            /* Empty state — no search results */
            <div className="empty-view">
              <div className="empty-icon">🔍</div>
              <h3 className="empty-title">No matching links</h3>
              <p className="empty-description">
                No results for <strong>"{searchQuery}"</strong>. Try a different term.
              </p>
              <button
                type="button"
                className="btn-create-first"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="links-list">
              {sortedUrls.map((item) => {
                const exp = getExpirationDetails(item.expiresAt);
                return (
                  <div
                    key={item._id}
                    className={`url-card ${exp.isExpired ? "url-card-expired" : ""}`}
                  >
                    {editingId === item._id ? (
                      /* ── Edit Mode ── */
                      <div className="edit-form">
                        <label htmlFor={`edit-input-${item._id}`} className="visually-hidden">
                          Edit destination URL
                        </label>
                        <input
                          id={`edit-input-${item._id}`}
                          type="url"
                          className="edit-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleEditSave(item._id)}
                          disabled={isSaving}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleEditSave(item._id)}
                          className="btn-action btn-edit-save"
                          disabled={isSaving}
                          aria-label="Save changes"
                        >
                          {isSaving ? <span className="spinner-inline" /> : null}
                          {isSaving ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={handleEditCancel}
                          className="btn-action"
                          disabled={isSaving}
                          aria-label="Cancel editing"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      /* ── View Mode ── */
                      <>
                        <div className="url-info">
                          <div className="short-url-container">
                            <a
                              href={getAbsoluteShortUrl(item.shortCode)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="short-url-link"
                            >
                              {getAbsoluteShortUrl(item.shortCode)}
                            </a>
                            <span className={`alias-badge ${item.isCustom ? "custom-badge" : "auto-badge"}`}>
                              {item.isCustom ? "Custom" : "Auto"}
                            </span>
                            <span className={`status-badge ${exp.isExpired ? "status-expired" : "status-active"}`}>
                              {exp.statusLabel}
                            </span>
                            <span className="click-badge">
                              {item.clickCount || 0} clicks
                            </span>
                          </div>
                          <p className="original-url">{item.originalUrl}</p>

                          <div className="url-metadata">
                            <div className="meta-item">
                              <span aria-hidden="true">📅</span>
                              <span>Created: {new Date(item.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                            </div>
                            <div className="meta-item">
                              <span aria-hidden="true">🕒</span>
                              <span>Last Visited: {item.lastVisited ? new Date(item.lastVisited).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "Never"}</span>
                            </div>
                            <div className="meta-item">
                              <span aria-hidden="true">⏳</span>
                              <span>Expiration: {exp.text}</span>
                            </div>
                          </div>
                        </div>

                        <div className="url-actions">
                          <button
                            type="button"
                            onClick={() => handleCopy(item._id, item.shortCode)}
                            className={`btn-action btn-action-copy ${copiedId === item._id ? "btn-action-copied" : ""}`}
                            aria-label={copiedId === item._id ? "Copied!" : "Copy short URL"}
                          >
                            {copiedId === item._id ? "✓ Copied!" : "Copy"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setQrUrl(getAbsoluteShortUrl(item.shortCode))}
                            className="btn-action"
                            aria-label="View QR code"
                          >
                            View QR
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditStart(item._id, item.originalUrl)}
                            className="btn-action"
                            aria-label="Edit destination URL"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRequest(item._id)}
                            className="btn-action btn-action-delete"
                            aria-label="Delete this link"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {qrUrl && (
        <QRModal url={qrUrl} onClose={() => setQrUrl(null)} />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <ConfirmModal
          message="Are you sure you want to permanently delete this link?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
}

export default Dashboard;
