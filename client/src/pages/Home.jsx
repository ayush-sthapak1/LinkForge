import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do not connect to the backend yet. State only.
    console.log("Shortening URL (local state):", url);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">LinkForge</Link>
        <div className="nav-links">
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Register</Link>
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
              required
            />
            <button type="submit" className="btn btn-primary btn-shorten">
              Shorten
            </button>
          </form>

          {/* Result Area Placeholder */}
          <div className="result-section">
            <p className="placeholder-text">No URL generated yet.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
