const verifyToken = async (req, res, next) => {
  const token = req.headers["x-token"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const key = `auth_${token}`;
  const userId = await redisclient.get(key);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.userId = userId;
  next();
};

module.exports = verifyToken;
