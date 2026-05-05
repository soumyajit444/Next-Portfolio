const protect = (req, res, next) => {
  const secret = req.query.secret;

  if (secret !== process.env.SECRET_KEY) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  next();
};

module.exports = protect;
