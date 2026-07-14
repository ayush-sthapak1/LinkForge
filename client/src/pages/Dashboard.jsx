import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAllUrls, deleteUrl, updateUrl } from "../services/urlService";
import "../styles/dashboard.css";

function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for inline editing
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  
  // State for copy feedbacks
  const [copiedId, setCopiedId] = useState(null);

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

  const getAbsoluteShortUrl = (shortCode) => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
    const origin = apiBaseUrl.replace("/api", "");
    return `${origin}/${shortCode}`;
  };

  const handleCopy = async (id, shortCode) => {
    const shortUrl = getAbsoluteShortUrl(shortCode);
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleDelete = async (id) => {
    // Immediately remove from UI
    setUrls(urls.filter((u) => u._id !== id));
    try {
      await deleteUrl(id);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to delete URL.";
      setError(msg);
      // Re-fetch to sync state in case of failure
      fetchUrls();
    }
  };

  const handleEditStart = (id, currentOriginalUrl) => {
    setEditingId(id);
    setEditValue(currentOriginalUrl);
  };

  const handleEditSave = async (id) => {
    if (!editValue.trim()) return;
    try {
      const response = await updateUrl(id, { originalUrl: editValue });
      // Update original URL in local state
      setUrls(urls.map((u) => (u._id === id ? { ...u, originalUrl: response.url.originalUrl } : u)));
      setEditingId(null);
      setEditValue("");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update URL.";
      setError(msg);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  // Compute stats
  const totalLinks = urls.length;
  const totalClicks = urls.reduce((sum, item) => sum + (item.clickCount || 0), 0);

  if (isLoading) {
    return (
      <div>
        <nav className="navbar">
          <Link to="/" className="logo">LinkForge</Link>
          <button onClick={logout} className="btn-logout">Logout</button>
        </nav>
        <div className="loading-view">
          <div className="spinner-large"></div>
          <p className="loading-text">Fetching your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">LinkForge</Link>
        <button onClick={logout} className="btn-logout">Logout</button>
      </nav>

      <div className="dashboard-container">
        {/* Error Banner */}
        {error && (
          <div className="error-banner">
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
            <h3>Total Links</h3>
            <p className="stats-value">{totalLinks}</p>
          </div>
          <div className="stats-card">
            <h3>Total Clicks</h3>
            <p className="stats-value">{totalClicks}</p>
          </div>
        </div>

        {/* Links List Section */}
        <h2 className="links-section-title">Links</h2>

        {urls.length === 0 ? (
          <div className="empty-view">
            <p>You haven't created any links yet.</p>
            <Link to="/" className="btn-create-first">
              Create your first link
            </Link>
          </div>
        ) : (
          <div className="links-list">
            {urls.map((item) => (
              <div key={item._id} className="url-card">
                {editingId === item._id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      className="edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      required
                    />
                    <button
                      onClick={() => handleEditSave(item._id)}
                      className="btn-action btn-edit-save"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="btn-action"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
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
                        <span className="click-badge">
                          {item.clickCount || 0} clicks
                        </span>
                      </div>
                      <p className="original-url">{item.originalUrl}</p>
                      
                      <div className="url-metadata">
                        <div className="meta-item">
                          <span>📅</span>
                          <span>Created: {new Date(item.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                        </div>
                        <div className="meta-item">
                          <span>🕒</span>
                          <span>Last Visited: {item.lastVisited ? new Date(item.lastVisited).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "Never"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="url-actions">
                      <button
                        onClick={() => handleCopy(item._id, item.shortCode)}
                        className={`btn-action btn-action-copy ${copiedId === item._id ? "btn-action-copied" : ""}`}
                      >
                        {copiedId === item._id ? "✓ Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => handleEditStart(item._id, item.originalUrl)}
                        className="btn-action"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn-action btn-action-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
