import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  vehicleType: { type: String, enum: ["Taxi", "Tempo", "Auto"], required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  stops: [{ type: String, required: true }],
  frequency: { type: String, required: true },
  fare: { type: Number, required: true },
  estimatedTime: { type: Number, required: true },
  operatingHours: { type: String, required: true },
  standIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stand" }],
});

export default mongoose.model("Route", routeSchema);
