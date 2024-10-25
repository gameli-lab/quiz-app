const redisclient = require("../utils/redis");

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-token"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - missing token" });
  }

  const key = `auth_${token}`;
  const userId = await redisclient.get(key);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - invalid token" });
  }

  req.userId = userId;
  next();
};

module.exports = verifyToken;
