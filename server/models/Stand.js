import mongoose from "mongoose";

const standSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  landmark: { type: String, required: true },
  activeRoutes: { type: Number, default: 0 },
});

export default mongoose.model("Stand", standSchema);
