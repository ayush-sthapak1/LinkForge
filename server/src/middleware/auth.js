// TODO: Implement JWT verification middleware
const auth = (req, res, next) => {
  // TODO: Extract token, verify signature, attach user context
  next();
};

module.exports = auth;
