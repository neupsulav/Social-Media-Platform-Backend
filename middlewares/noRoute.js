const noRoute = (req, res) => {
  res.status(404).send("Route doesn't exist");
};

module.exports = noRoute;
