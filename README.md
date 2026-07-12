# LinkForge

LinkForge is a modern, production-ready, full-stack URL shortening platform. It is designed to offer quick URL redirection, user authentication, link analytics, and customization options using a clean and scalable code structure.

This repository serves as a portfolio-quality template following industry best practices for developers learning React, Express, and MongoDB.

---

## Features

- **Shorten URLs**: Convert long web URLs into short, clean links.
- **Redirects**: Instantly redirect short URLs to their original destinations.
- **User Authentication (JWT)**: Secure registration, login, and protected routes.
- **User Dashboard**: View and manage all shortened links in one place.
- **Custom Aliases**: Allow users to specify custom short slugs (e.g. `/my-custom-slug`).
- **Link Expiration**: Set expiration dates on shortened links.
- **Click Counter & Basic Analytics**: Monitor click counts and link creation dates.
- **QR Code Generation**: Automatically generate QR codes for sharing.
- **Responsive React Frontend**: Mobile-friendly client user interface.
- **REST API**: Clean HTTP endpoints for authentication, url creation, and redirection.
- **Input Validation**: Robust validation using `express-validator`.
- **Proper Error Handling**: Standardized error responses across all endpoints.

---

## Tech Stack

### Frontend
- **React (Vite)**: Modern declarative UI library and fast build environment.
- **React Router**: Client-side routing for page navigation.
- **Axios**: Promised-based HTTP client for calling backend APIs.
- **Tailwind CSS**: Utility-first CSS framework for custom design layouts.

### Backend
- **Node.js & Express.js**: Lightweight JavaScript runtime and API framework.
- **MongoDB & Mongoose**: NoSQL document database and data modeling library.
- **NanoID**: Secure, collision-resistant, URL-friendly unique ID generator.
- **express-validator**: Express middleware for request data validation.
- **dotenv**: Environment variable management.
- **cors**: Middleware to handle Cross-Origin Resource Sharing.
- **helmet**: Secure HTTP header configuration for security.
- **morgan**: HTTP request logger middleware.

### Developer Tools
- **Git**: Version control.
- **ESLint**: Linter for static code analysis.
- **Prettier**: Code formatter for formatting style consistency.
- **Jest & Supertest**: Test runner and HTTP client for integration testing.
- **Nodemon**: Auto-restarts server during development on file changes.

---

## Folder Structure

```
LinkForge/
├── client/                     # Frontend Application (Vite + React)
│   ├── src/
│   │   ├── components/         # Reusable presentation components
│   │   │   ├── common/         # Loaders, Alerts, Modals
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── ui/             # Buttons, Inputs (Design System)
│   │   ├── pages/              # Routing View Pages (Home, Dashboard, Login, Register, Analytics, NotFound)
│   │   ├── layouts/            # Page layouts / Root layout
│   │   ├── hooks/              # Custom React hooks (useAuth, etc.)
│   │   ├── context/            # React Contexts (AuthContext, etc.)
│   │   ├── services/           # Axios API requests (authService, urlService, api)
│   │   ├── utils/              # Client-side helper functions
│   │   ├── styles/             # Tailwind base styles (CSS)
│   │   ├── App.jsx             # Routes declaration and main React app
│   │   └── main.jsx            # Entry point for React DOM
│   ├── package.json            # Client scripts & dependencies
│   └── vite.config.js          # Vite config
│
├── server/                     # Backend Application (Node.js + Express)
│   ├── src/
│   │   ├── config/             # DB configuration
│   │   ├── controllers/        # Express handlers (authController, urlController, analyticsController)
│   │   ├── middleware/         # Custom middlewares (auth, errorHandler, validation)
│   │   ├── models/             # Mongoose schemas (User, Url)
│   │   ├── routes/             # API endpoint definitions (authRoutes, urlRoutes, analyticsRoutes)
│   │   ├── services/           # Logic helpers (shortCodeService, analyticsService)
│   │   ├── utils/              # Helper functions & constants
│   │   ├── app.js              # Express app setup and middleware configuration
│   │   └── server.js           # Database connection & main listener loop
│   ├── tests/                  # Integration tests (auth.test.js, url.test.js)
│   └── package.json            # Server scripts, dependencies & testing configurations
│
├── README.md                   # Project overview and installation guide
├── .gitignore                  # Git untracked pattern definitions
└── LICENSE                     # License specification
```

---

## Installation

Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed and running locally.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/LinkForge.git
   cd LinkForge
   ```

2. **Install dependencies for Client:**
   ```bash
   cd client
   npm install
   ```

3. **Install dependencies for Server:**
   ```bash
   cd ../server
   npm install
   ```

---

## Running Client

Navigate to the `client/` directory and run:

```bash
cd client
npm run dev
```

The frontend will run at `http://localhost:3000`.

---

## Running Server

Navigate to the `server/` directory and run:

```bash
cd server
npm run dev
```

For production execution:
```bash
npm start
```

The backend server will run at `http://localhost:5000`.

---

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Port Configuration
PORT=5000

# MongoDB Connection URI
MONGO_URI=mongodb://localhost:27017/linkforge

# JWT secret key for signing auth tokens
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Frontend URL (For CORS policies configuration)
CLIENT_URL=http://localhost:3000
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
