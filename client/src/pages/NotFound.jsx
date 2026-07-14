import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/notfound.css";

function NotFound() {
  useEffect(() => {
    document.title = "404 | LinkForge";
  }, []);

  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <h1 className="notfound-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <Link to="/" className="btn-home">
          Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
