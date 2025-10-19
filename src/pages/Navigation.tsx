import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  MapPin, 
  Navigation as NavigationIcon, 
  CheckCircle2, 
  Circle,
  ArrowRight,
  Car,
  Bus,
  Zap,
  AlertCircle
} from "lucide-react";

// Types
interface Stand {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  landmark: string;
}

export type VehicleType = "Taxi" | "Tempo" | "Auto";

interface TripLeg {
  routeId: string;
  vehicleType: VehicleType;
  start: string;
  end: string;
  standId: string;
  fare: number;
  duration: number;
  distance: string;
}

interface PlannedTrip {
  id: string;
  source: string;
  destination: string;
  legs: TripLeg[];
  totalFare: number;
  totalTime: number;
  transfers: number;
}

// Vehicle icon helper
const getVehicleIcon = (type: VehicleType) => {
  switch (type) {
    case "Taxi":
      return <Car className="h-6 w-6" />;
    case "Tempo":
      return <Bus className="h-6 w-6" />;
    case "Auto":
      return <Zap className="h-6 w-6" />;
  }
};

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const source = searchParams.get("source") || "";
  const destination = searchParams.get("destination") || "";

  const [trip, setTrip] = useState<PlannedTrip | null>(null);
  const [stands, setStands] = useState<Stand[]>([]);
  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Fetch trips & stands from backend
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`/api/trips/plan?source=${source}&destination=${destination}`);
        if (!source || !destination) return;
        const data: PlannedTrip[] = await res.json();
        setTrip(data[0] || null); // Use the first trip
      } catch (err) {
        console.error("Failed to fetch trip:", err);
      }
    };

    const fetchStands = async () => {
      try {
        const res = await fetch("/api/stands");
        const data: Stand[] = await res.json();
        setStands(data);
      } catch (err) {
        console.error("Failed to fetch stands:", err);
      }
    };

    fetchTrip();
    fetchStands();
  }, [source, destination]);

  // Progress simulation
  useEffect(() => {
    if (!trip) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentLegIndex < trip.legs.length - 1) {
            setCurrentLegIndex(currentLegIndex + 1);
            return 0;
          }
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [trip, currentLegIndex]);

  if (!trip) return null;

  const currentLeg = trip.legs[currentLegIndex];
  const isLastLeg = currentLegIndex === trip.legs.length - 1;
  const isCompleted = isLastLeg && progress >= 100;
  const stand = stands.find(s => s._id === currentLeg.standId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b-2 border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/route-results" + location.search)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-bold text-foreground">Navigation Active</h2>
              <p className="text-xs text-muted-foreground">
                Leg {currentLegIndex + 1} of {trip.legs.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Current Leg Progress */}
        <Card className="p-6 mb-6 border-2 shadow-primary-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              {getVehicleIcon(currentLeg.vehicleType)}
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2">{currentLeg.vehicleType}</Badge>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-foreground">{currentLeg.start}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-bold text-lg text-foreground">{currentLeg.end}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Duration</p>
              <p className="font-semibold text-foreground">{currentLeg.duration} minutes</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Fare</p>
              <p className="font-semibold text-foreground">₹{currentLeg.fare}</p>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 mb-6 border-2 bg-primary/5">
          <div className="flex items-start gap-3">
            <div className="bg-primary rounded-full p-2">
              <NavigationIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-2 text-foreground">Current Step</h3>
              {progress < 30 && (
                <div>
                  <p className="mb-2 text-foreground">Walk to the stand:</p>
                  <div className="flex items-start gap-2 bg-card p-3 rounded-lg border border-border">
                    <MapPin className="h-5 w-5 text-secondary mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">{stand?.name}</p>
                      <p className="text-sm text-muted-foreground">{stand?.landmark}</p>
                    </div>
                  </div>
                </div>
              )}
              {progress >= 30 && progress < 70 && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-accent" />
                  <p className="text-foreground">Board {currentLeg.vehicleType} heading to {currentLeg.end}</p>
                </div>
              )}
              {progress >= 70 && !isCompleted && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-foreground">Get ready to alight at {currentLeg.end}</p>
                </div>
              )}
              {isCompleted && (
                <div className="flex items-center gap-2 text-secondary">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-semibold">You've arrived at {trip.destination}!</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Journey Overview */}
        <Card className="p-6 border-2">
          <h3 className="font-bold mb-4 text-foreground">Journey Overview</h3>
          <div className="space-y-4">
            {trip.legs.map((leg, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  {index < currentLegIndex ? (
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                  ) : index === currentLegIndex ? (
                    <div className="h-5 w-5 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  {index < trip.legs.length - 1 && (
                    <div className={`w-0.5 h-12 ${index < currentLegIndex ? "bg-secondary" : "bg-border"}`} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant={index <= currentLegIndex ? "default" : "outline"}
                      className="text-xs"
                    >
                      {leg.vehicleType}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {leg.duration} min • ₹{leg.fare}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {leg.start} → {leg.end}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Button */}
        {isCompleted && (
          <Button
            variant="hero"
            size="lg"
            className="w-full mt-6"
            onClick={() => navigate("/")}
          >
            Plan Another Trip
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navigation;
