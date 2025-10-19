import Route from "../models/Route.js";

// Get all routes
export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate("standIds");
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new route
export const createRoute = async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(201).json(route);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
