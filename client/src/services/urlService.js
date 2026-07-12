import api from './api';

/**
 * URL Shortening API interactions handler
 * 
 * TODO:
 * - Implement shortenUrl(originalUrl) -> POST /api/urls.
 * - Implement getUserUrls() -> GET /api/urls.
 * - Implement deleteUrl(id) -> DELETE /api/urls/:id.
 * - Implement getUrlAnalytics(id) -> GET /api/urls/:id/analytics.
 */
const urlService = {
  shorten: async (originalUrl, customAlias) => {
    // TODO: POST /urls
    return null;
  },

  getAll: async () => {
    // TODO: GET /urls
    return [];
  },

  delete: async (id) => {
    // TODO: DELETE /urls/:id
    return null;
  },

  getAnalytics: async (id) => {
    // TODO: GET /urls/:id/analytics
    return null;
  },
};

export default urlService;
