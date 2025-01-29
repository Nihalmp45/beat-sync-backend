// import axios from "axios";

// export const weatherData = async (req, res) => {
//   const { city } = req.query;

//   if (!city) {
//     return res.status(400).json({ error: "City name is required" });
//   }

//   // Define a dictionary to map city names to their coordinates
//   const cityCoordinates = {
//     "san francisco": { latitude: 37.7749, longitude: -122.4194 },
//     "new york": { latitude: 40.7128, longitude: -74.0060 },
//     "los angeles": { latitude: 34.0522, longitude: -118.2437 },
//     "chicago": { latitude: 41.8781, longitude: -87.6298 },
//   };

//   const cityKey = city.toLowerCase();

//   if (!cityCoordinates[cityKey]) {
//     return res
//       .status(400)
//       .json({ error: "City not found in the predefined list" });
//   }

//   const { latitude, longitude } = cityCoordinates[cityKey];

//   try {
//     // Call Open-Meteo API with latitude and longitude
//     const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
//       params: {
//         latitude,
//         longitude,
//         current_weather: true,
//       },
//     });

//     const weatherData = response.data;

//     // Map weather codes to recommendations
//     const recommendations = {
//       clear_sky: "It's a great time to walk!",
//       partly_cloudy: "It's a great time to walk!",
//       overcast: "A cozy day for a warm drink indoors.",
//       rain: "Don't forget your umbrella!",
//       snow: "Stay warm, it's snowing outside!",
//       storm: "Better to stay indoors during the storm.",
//     };

//     // Map Open-Meteo weather codes to descriptive labels
//     const weatherCodeMap = {
//       0: "clear_sky",
//       1: "partly_cloudy",
//       2: "partly_cloudy",
//       3: "overcast",
//       61: "rain",
//       71: "snow",
//       95: "storm",
//     };

//     // Extract weather code and determine recommendation
//     const weatherCode = weatherData.current_weather.weathercode;
//     const recommendation =
//       recommendations[weatherCodeMap[weatherCode]] || "Enjoy your day!";

//     // Transform response data for the frontend
//     const transformedData = {
//       city: cityKey,
//       coordinates: {
//         latitude,
//         longitude,
//       },
//       temperature: weatherData.current_weather.temperature,
//       wind_speed: weatherData.current_weather.windspeed,
//       weather_code: weatherCode,
//       recommendation,
//     };

//     res.json(transformedData);
//   } catch (error) {
//     console.error("Error fetching weather data:", error.message);
//     res.status(500).json({ error: "Failed to fetch weather data" });
//   }
// };
