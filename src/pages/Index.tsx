import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Users, Search, Map, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    if (source && destination) {
      navigate(`/route-results?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
    }
  };

  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary rounded-full p-4 shadow-primary-lg">
              <Navigation className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-foreground">
            RouteBuddy
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Your digital guide for shared taxis, tempos & autos
          </p>

          {/* Search Section */}
          <Card className="p-6 shadow-primary-lg border-2">
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-primary" />
                <Input
                  placeholder="Starting point (e.g., Polytechnic)"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="pl-10 h-12 text-base border-2"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-secondary" />
                <Input
                  placeholder="Destination (e.g., Daliganj)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 h-12 text-base border-2"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!source || !destination}
                variant="hero"
                size="lg"
                className="w-full"
              >
                <Search className="mr-2 h-5 w-5" />
                Find Routes
              </Button>
            </div>
          </Card>

          {/* Popular Destinations */}
          <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-3 flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Popular destinations
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-foreground">
            Navigate with Confidence
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-primary-md transition-base border-2 cursor-pointer" onClick={() => navigate("/route-results")}>
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Navigation className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Trip Planner</h3>
              <p className="text-center text-muted-foreground">
                Get optimal routes with step-by-step guidance for multi-leg journeys
              </p>
            </Card>

            <Card className="p-6 hover:shadow-primary-md transition-base border-2 cursor-pointer" onClick={() => navigate("/stands")}>
              <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Map className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Stand Locator</h3>
              <p className="text-center text-muted-foreground">
                Find nearby taxi, tempo & auto stands with exact landmarks
              </p>
            </Card>

            <Card className="p-6 hover:shadow-primary-md transition-base border-2 cursor-pointer" onClick={() => navigate("/community")}>
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Community</h3>
              <p className="text-center text-muted-foreground">
                Contribute routes and stands to help fellow commuters
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="nav" className="h-20" onClick={() => navigate("/route-results")}>
              <div className="text-center">
                <Search className="h-6 w-6 mx-auto mb-1" />
                <span className="text-xs">Search Routes</span>
              </div>
            </Button>
            <Button variant="nav" className="h-20" onClick={() => navigate("/stands")}>
              <div className="text-center">
                <MapPin className="h-6 w-6 mx-auto mb-1" />
                <span className="text-xs">View Stands</span>
              </div>
            </Button>
            <Button variant="nav" className="h-20" onClick={() => navigate("/community")}>
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-1" />
                <span className="text-xs">Contribute</span>
              </div>
            </Button>
            <Button variant="nav" className="h-20" onClick={() => navigate("/navigation")}>
              <div className="text-center">
                <Navigation className="h-6 w-6 mx-auto mb-1" />
                <span className="text-xs">Navigate</span>
              </div>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
