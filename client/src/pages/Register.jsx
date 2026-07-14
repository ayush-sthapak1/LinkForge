import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { register as registerApi } from "../services/authService";
import "../styles/register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  useEffect(() => {
    document.title = "Register | LinkForge";
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await registerApi(username, email, password);
      login(data.user, data.token);
      addToast(`Welcome to LinkForge, ${data.user.username}!`, "success");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An unexpected error occurred.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <Link to="/" className="auth-logo">LinkForge</Link>
          <h2>Create your account</h2>

          {error && (
            <div className="auth-error" role="alert">
              <span aria-hidden="true">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                ref={usernameRef}
                type="text"
                className="auth-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn-auth"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-inline" aria-hidden="true"></span>
                  <span>Creating account…</span>
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
