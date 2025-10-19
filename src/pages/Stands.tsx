import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Search, Navigation } from "lucide-react";

export interface Stand {
  _id: string;
  name: string;
  landmark: string;
  latitude: number;
  longitude: number;
  activeRoutes: number;
}

const Stands = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stands, setStands] = useState<Stand[]>([]);
  const [filteredStands, setFilteredStands] = useState<Stand[]>([]);

  // Fetch stands from backend
  useEffect(() => {
    const fetchStands = async () => {
      try {
        const res = await fetch("/api/stands/getStands");
        const data: Stand[] = await res.json();
        setStands(data);
        setFilteredStands(data);
      } catch (err) {
        console.error("Failed to fetch stands:", err);
      }
    };

    fetchStands();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredStands(stands);
      return;
    }

    const filtered = stands.filter(
      (stand) =>
        stand.name.toLowerCase().includes(query.toLowerCase()) ||
        stand.landmark.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStands(filtered);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b-2 border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Stand Locator</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search stands or landmarks..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 border-2"
            />
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-muted border-b-2 border-border">
        <div className="max-w-4xl mx-auto">
          <div className="h-64 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Interactive map view</p>
              <p className="text-xs text-muted-foreground">{filteredStands.length} stands available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stands List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">All Stands</h2>
          <Badge variant="outline">{filteredStands.length} locations</Badge>
        </div>

        {filteredStands.length === 0 ? (
          <Card className="p-8 text-center border-2">
            <p className="text-muted-foreground">No stands found matching your search</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredStands.map((stand) => (
              <Card key={stand._id} className="p-4 border-2 hover:shadow-primary-md transition-base">
                <div className="flex items-start gap-3">
                  <div className="bg-secondary/10 p-2 rounded-full mt-1">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1">{stand.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{stand.landmark}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{stand.activeRoutes} active routes</span>
                      <span>•</span>
                      <span>
                        {stand.latitude.toFixed(4)}, {stand.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stands;
