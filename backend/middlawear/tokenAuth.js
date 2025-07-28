const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const owner = jwt.verify(token, process.env.TokenSecret);
    if(!owner) return res.status(401).json({ error: "Unauthorized" });
    req.owner = owner;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

