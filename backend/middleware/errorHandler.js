export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: "Route not found." });
};

export const errorHandler = (error, req, res, next) => {
  console.error(`Unhandled ${req.method} ${req.originalUrl}:`, error.message);
  res.status(500).json({ error: "Internal server error." });
};
