const axios = require("axios");

async function geocodeAddress(address) {
  const url = "https://nominatim.openstreetmap.org/search";

  const res = await axios.get(url, {
    params: {
      q: address,
      format: "json",
      limit: 1,
    },
    headers: {
      "User-Agent": "verification-app",
    },
  });

  if (!res.data || res.data.length === 0) {
    throw new Error("Address not found");
  }

  return {
    lat: parseFloat(res.data[0].lat),
    lng: parseFloat(res.data[0].lon),
  };
}

module.exports = geocodeAddress;
