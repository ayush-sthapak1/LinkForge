import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createShortUrl } from "../services/urlService";
import "../styles/home.css";

function Home() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessData(null);

    try {
      const data = await createShortUrl(url);
      setSuccessData(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An unexpected error occurred.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!successData?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(successData.shortUrl);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL to clipboard:", err);
    }
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
              <button onClick={logout} className="btn btn-primary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="container">
        {/* Hero Section */}
        <section className="hero">
          <h1>Shorten your URLs instantly.</h1>
          <p>Create clean, shareable links and track them effortlessly.</p>
        </section>

        {/* Shortener Card */}
        <div className="shortener-card">
          <form className="shortener-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="url-input"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              className="btn btn-primary btn-shorten"
              disabled={isLoading}
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </button>
          </form>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Result Area */}
          <div className="result-section">
            {successData ? (
              <div className="success-card">
                <p className="success-message">{successData.message || "Short URL created successfully!"}</p>
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
                    onClick={handleCopy}
                    className={`btn-copy ${isCopied ? "copied" : ""}`}
                  >
                    {isCopied ? "Copied!" : "Copy"}
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
