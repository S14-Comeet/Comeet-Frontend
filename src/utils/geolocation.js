/**
 * Calculate distance between two points in meters using Haversine formula
 * @param {Object} loc1 - { latitude, longitude }
 * @param {Object} loc2 - { latitude, longitude }
 * @returns {number} distance in meters
 */
export const calculateDistance = (loc1, loc2) => {
  if (!loc1 || !loc2) return 0;
  
  const R = 6371e3; // Earth radius in meters
  const lat1 = loc1.latitude * Math.PI / 180;
  const lat2 = loc2.latitude * Math.PI / 180;
  const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
