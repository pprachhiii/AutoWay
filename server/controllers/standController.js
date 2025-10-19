import Stand from "../models/Stand.js";

// Get all stands
export const getStands = async (req, res) => {
  try {
    const stands = await Stand.find();
    res.json(stands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new stand
export const createStand = async (req, res) => {
  try {
    const stand = new Stand(req.body);
    await stand.save();
    res.status(201).json(stand);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
