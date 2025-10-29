import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Users, TrendingUp, Award } from "lucide-react";
import { toast } from "sonner";

const Community = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState<"route" | "stand">("route");

  // Route form state
  const [vehicleType, setVehicleType] = useState<string>("Taxi");
  const [routeStart, setRouteStart] = useState("");
  const [routeEnd, setRouteEnd] = useState("");
  const [fare, setFare] = useState("");
  const [frequency, setFrequency] = useState("");

  // Stand form state
  const [standName, setStandName] = useState("");
  const [landmark, setLandmark] = useState("");
  const [notes, setNotes] = useState("");

  // Helper to get user coordinates
  const getUserLocation = async () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err)
      );
    });
  };

  // =============================
  // 🔹 Submit Route
  // =============================
  const handleSubmitRoute = async (e: React.FormEvent) => {
    e.preventDefault();

    const newRoute = {
      vehicleType,
      start: routeStart,
      end: routeEnd,
      fare: Number(fare),
      frequency,
    };

    try {
      const res = await fetch("http://localhost:5000/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoute),
      });

      if (!res.ok) throw new Error("Failed to submit route");

      toast.success("✅ Route submitted successfully!", {
        description: "Your route will be reviewed and published soon.",
      });

      // Reset form
      setRouteStart("");
      setRouteEnd("");
      setFare("");
      setFrequency("");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to submit route. Please try again.");
    }
  };

  // =============================
  // 🔹 Submit Stand
  // =============================
  const handleSubmitStand = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const coords = await getUserLocation();

      const newStand = {
        name: standName,
        landmark,
        latitude: coords.lat,
        longitude: coords.lng,
      };

      const res = await fetch("/api/stands/createStand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStand),
      });

      if (!res.ok) throw new Error("Failed to submit stand");

      toast.success("✅ Stand added successfully!", {
        description: "Your stand will be verified and added soon.",
      });

      // Reset form
      setStandName("");
      setLandmark("");
      setNotes("");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to get location or submit stand.");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b-2 border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Community Contributions</h1>
              <p className="text-xs text-muted-foreground">
                Help fellow commuters discover routes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center border-2">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">Contributors</p>
          </Card>
          <Card className="p-4 text-center border-2">
            <TrendingUp className="h-6 w-6 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </Card>
          <Card className="p-4 text-center border-2">
            <Award className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </Card>
        </div>

        {/* Form Type Selector */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={formType === "route" ? "hero" : "outline"}
            className="flex-1"
            onClick={() => setFormType("route")}
          >
            Add Route
          </Button>
          <Button
            variant={formType === "stand" ? "hero" : "outline"}
            className="flex-1"
            onClick={() => setFormType("stand")}
          >
            Add Stand
          </Button>
        </div>

        {/* ================= ROUTE FORM ================= */}
        {formType === "route" && (
          <Card className="p-6 border-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary/10 p-2 rounded-full">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Add New Route</h2>
            </div>

            <form onSubmit={handleSubmitRoute} className="space-y-4">
              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select value={vehicleType} onValueChange={(value) => setVehicleType(value)}>
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Taxi">Taxi</SelectItem>
                    <SelectItem value="Tempo">Tempo</SelectItem>
                    <SelectItem value="Auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="routeStart">Starting Point</Label>
                  <Input
                    id="routeStart"
                    placeholder="e.g., Polytechnic"
                    value={routeStart}
                    onChange={(e) => setRouteStart(e.target.value)}
                    required
                    className="border-2"
                  />
                </div>
                <div>
                  <Label htmlFor="routeEnd">Ending Point</Label>
                  <Input
                    id="routeEnd"
                    placeholder="e.g., Daliganj"
                    value={routeEnd}
                    onChange={(e) => setRouteEnd(e.target.value)}
                    required
                    className="border-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fare">Fare (₹)</Label>
                  <Input
                    id="fare"
                    type="number"
                    placeholder="e.g., 20"
                    value={fare}
                    onChange={(e) => setFare(e.target.value)}
                    required
                    className="border-2"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    placeholder="e.g., Every 10 mins"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    required
                    className="border-2"
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" size="lg">
                Submit Route
              </Button>
            </form>
          </Card>
        )}

        {/* ================= STAND FORM ================= */}
        {formType === "stand" && (
          <Card className="p-6 border-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-secondary/10 p-2 rounded-full">
                <Plus className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Add New Stand</h2>
            </div>

            <form onSubmit={handleSubmitStand} className="space-y-4">
              <div>
                <Label htmlFor="standName">Stand Name</Label>
                <Input
                  id="standName"
                  placeholder="e.g., College Gate Stand"
                  value={standName}
                  onChange={(e) => setStandName(e.target.value)}
                  required
                  className="border-2"
                />
              </div>

              <div>
                <Label htmlFor="landmark">Landmark / Location</Label>
                <Input
                  id="landmark"
                  placeholder="e.g., Near City Library"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  required
                  className="border-2"
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any details about timings or specific vehicles"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border-2 min-h-24"
                />
              </div>

              <div className="bg-muted/50 border-2 border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  📍 Your current location will be used as the stand coordinates.
                </p>
                <p className="text-xs text-muted-foreground">
                  Please ensure you're at the stand when submitting.
                </p>
              </div>

              <Button type="submit" variant="hero" className="w-full" size="lg">
                Submit Stand Location
              </Button>
            </form>
          </Card>
        )}

        {/* ================= GUIDELINES ================= */}
        <Card className="p-6 mt-6 border-2 bg-accent/5">
          <h3 className="font-bold mb-3 text-foreground">Contribution Guidelines</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Ensure all information is accurate and up-to-date.</li>
            <li>• Include clear landmarks that are easy to identify.</li>
            <li>• Submissions will be reviewed before publishing.</li>
            <li>• Quality contributions help the whole community.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Community;
