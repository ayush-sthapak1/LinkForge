import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createShortUrl } from "../services/urlService";
import "../styles/home.css";

function Home() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { addToast } = useToast();

  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiration, setExpiration] = useState("never");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const urlInputRef = useRef(null);

  useEffect(() => {
    document.title = "Home | LinkForge";
    urlInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const trimmedUrl = url.trim();
    const trimmedAlias = customAlias.trim();

    if (!trimmedUrl) return;

    setIsLoading(true);
    setError(null);
    setSuccessData(null);

    try {
      const data = await createShortUrl(trimmedUrl, trimmedAlias, expiration);
      setSuccessData(data);
      setUrl("");
      setCustomAlias("");
      setExpiration("never");
      addToast("Short URL created!", "success");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An unexpected error occurred.";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!successData?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(successData.shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      addToast("Link copied to clipboard!", "success");
    } catch {
      addToast("Failed to copy link.", "error");
    }
  };

  const handleLogout = () => {
    addToast("You've been logged out.", "info");
    setTimeout(() => logout(), 300);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">LinkForge</Link>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
              <button type="button" onClick={handleLogout} className="btn btn-primary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container">
        {/* Hero */}
        <section className="hero">
          <h1>Shorten your URLs instantly.</h1>
          <p>Create clean, shareable links and track them effortlessly.</p>
        </section>

        {/* Shortener Card */}
        <div className="shortener-card">
          <form className="shortener-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group-wrapper">
              <div className="input-group">
                <label className="input-label" htmlFor="destination-url">Destination URL</label>
                <input
                  id="destination-url"
                  ref={urlInputRef}
                  type="url"
                  className="url-input"
                  placeholder="Paste your long URL here…"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="url"
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="custom-alias">Custom Alias (Optional)</label>
                <input
                  id="custom-alias"
                  type="text"
                  className="url-input"
                  placeholder="my-link"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  disabled={isLoading}
                  autoComplete="off"
                />
                <span className="input-help-text">Leave blank to generate a random code automatically.</span>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="expiration">Expiration</label>
                <select
                  id="expiration"
                  className="url-input select-input"
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="never">Never</option>
                  <option value="1day">1 Day</option>
                  <option value="7days">7 Days</option>
                  <option value="30days">30 Days</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-shorten"
              disabled={isLoading || !url.trim()}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-inline" aria-hidden="true"></span>
                  <span>Shortening…</span>
                </>
              ) : (
                "Shorten URL"
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="error-message" role="alert">
              <span aria-hidden="true">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Result Area */}
          <div className="result-section">
            {successData ? (
              <div className="success-card">
                <p className="success-message">
                  <span aria-hidden="true">🎉</span>
                  <span>{successData.message || "Short URL created successfully!"}</span>
                </p>
                <div className="result-display">
                  <a
                    href={successData.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="short-url-link"
                  >
                    {successData.shortUrl}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`btn-copy ${isCopied ? "copied" : ""}`}
                    aria-label={isCopied ? "Copied!" : "Copy short URL"}
                  >
                    {isCopied ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="placeholder-text">No URL generated yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
