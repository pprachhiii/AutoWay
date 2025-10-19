import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Navigation, Clock, DollarSign, ArrowRight, Car, Bus, Zap } from "lucide-react";

// Types
interface TripLeg {
  routeId: string;
  vehicleType: "Taxi" | "Tempo" | "Auto";
  start: string;
  end: string;
  standId?: string;
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
const getVehicleIcon = (type: TripLeg["vehicleType"]) => {
  switch (type) {
    case "Taxi":
      return <Car className="h-5 w-5" />;
    case "Tempo":
      return <Bus className="h-5 w-5" />;
    case "Auto":
      return <Zap className="h-5 w-5" />;
  }
};

const RouteResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState<PlannedTrip[]>([]);
  const [loading, setLoading] = useState(false);

  const source = searchParams.get("source") || "";
  const destination = searchParams.get("destination") || "";

  // Fetch trips from backend
  useEffect(() => {
    if (!source || !destination) return;

    const fetchTrips = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/trips/plan?source=${encodeURIComponent(
            source
          )}&destination=${encodeURIComponent(destination)}`
        );
        if (!res.ok) throw new Error("Failed to fetch trips");
        const data: PlannedTrip[] = await res.json();
        setTrips(data);
      } catch (err) {
        console.error(err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [source, destination]);

  const handleStartNavigation = (trip: PlannedTrip) => {
    navigate(`/navigation?tripId=${trip.id}`, { state: { trip } });
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
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-foreground">{source}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">{destination}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {loading
                  ? "Loading routes..."
                  : `${trips.length} route${trips.length !== 1 ? "s" : ""} found`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <Card className="p-8 text-center border-2">
            <p className="text-muted-foreground">Fetching routes...</p>
          </Card>
        ) : trips.length === 0 ? (
          <Card className="p-8 text-center border-2">
            <p className="text-muted-foreground mb-4">No routes found for this journey</p>
            <Button variant="outline" onClick={() => navigate("/")}>
              Try Different Locations
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <Card key={trip.id} className="p-6 border-2 hover:shadow-primary-md transition-base">
                {/* Trip Summary */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">{trip.totalTime} min</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="h-5 w-5 text-secondary mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">₹{trip.totalFare}</p>
                    </div>
                    {trip.transfers > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {trip.transfers} transfer{trip.transfers > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  <Button variant="hero" onClick={() => handleStartNavigation(trip)}>
                    <Navigation className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                </div>

                {/* Trip Legs */}
                <div className="space-y-3">
                  {trip.legs.map((leg, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {getVehicleIcon(leg.vehicleType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {leg.vehicleType}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {leg.duration} min • {leg.distance}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-foreground">{leg.start}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium text-foreground">{leg.end}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">₹{leg.fare}</p>
                        </div>
                      </div>
                      {index < trip.legs.length - 1 && (
                        <div className="flex items-center gap-2 py-2 pl-8 text-xs text-muted-foreground">
                          <div className="h-6 w-0.5 bg-border ml-4"></div>
                          <span>Transfer at {trip.legs[index + 1].start}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteResults;
