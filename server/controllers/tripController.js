import Route from "../models/Route.js";

// Plan trips from source to destination
export const planTrip = async (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res.status(400).json({ error: "Missing source or destination" });
  }

  try {
    const routes = await Route.find().populate("standIds");

    const trips = [];

    // Direct routes
    const directRoutes = routes.filter(
      (r) =>
        r.start.toLowerCase().includes(source.toLowerCase()) &&
        r.end.toLowerCase().includes(destination.toLowerCase())
    );

    directRoutes.forEach((route) => {
      trips.push({
        id: `trip-${trips.length + 1}`,
        source,
        destination,
        legs: [
          {
            routeId: route._id,
            vehicleType: route.vehicleType,
            start: route.start,
            end: route.end,
            standId: route.standIds[0]?._id,
            fare: route.fare,
            duration: route.estimatedTime,
            distance: `${Math.round(route.estimatedTime / 3)} km`,
          },
        ],
        totalFare: route.fare,
        totalTime: route.estimatedTime,
        transfers: 0,
      });
    });

    // Routes with one transfer
    routes.forEach((firstRoute) => {
      if (!firstRoute.start.toLowerCase().includes(source.toLowerCase()))
        return;

      routes.forEach((secondRoute) => {
        if (
          secondRoute.start
            .toLowerCase()
            .includes(firstRoute.end.toLowerCase()) &&
          secondRoute.end.toLowerCase().includes(destination.toLowerCase())
        ) {
          trips.push({
            id: `trip-${trips.length + 1}`,
            source,
            destination,
            legs: [
              {
                routeId: firstRoute._id,
                vehicleType: firstRoute.vehicleType,
                start: firstRoute.start,
                end: firstRoute.end,
                standId: firstRoute.standIds[0]?._id,
                fare: firstRoute.fare,
                duration: firstRoute.estimatedTime,
                distance: `${Math.round(firstRoute.estimatedTime / 3)} km`,
              },
              {
                routeId: secondRoute._id,
                vehicleType: secondRoute.vehicleType,
                start: secondRoute.start,
                end: secondRoute.end,
                standId: secondRoute.standIds[0]?._id,
                fare: secondRoute.fare,
                duration: secondRoute.estimatedTime,
                distance: `${Math.round(secondRoute.estimatedTime / 3)} km`,
              },
            ],
            totalFare: firstRoute.fare + secondRoute.fare,
            totalTime: firstRoute.estimatedTime + secondRoute.estimatedTime + 5,
            transfers: 1,
          });
        }
      });
    });

    // Sort trips by total time
    trips.sort((a, b) => a.totalTime - b.totalTime);

    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
