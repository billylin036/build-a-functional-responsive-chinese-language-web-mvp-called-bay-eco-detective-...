const PI = Math.PI;
const SEMI_MAJOR_AXIS = 6_378_245;
const ECCENTRICITY_SQUARED = 0.006693421622965943;

function isOutsideMainlandChina(latitude: number, longitude: number) {
  return longitude < 72.004 || longitude > 137.8347 || latitude < 0.8293 || latitude > 55.8271;
}

function latitudeOffset(longitude: number, latitude: number) {
  let result =
    -100 +
    2 * longitude +
    3 * latitude +
    0.2 * latitude * latitude +
    0.1 * longitude * latitude +
    0.2 * Math.sqrt(Math.abs(longitude));
  result += ((20 * Math.sin(6 * longitude * PI) + 20 * Math.sin(2 * longitude * PI)) * 2) / 3;
  result += ((20 * Math.sin(latitude * PI) + 40 * Math.sin((latitude / 3) * PI)) * 2) / 3;
  result += ((160 * Math.sin((latitude / 12) * PI) + 320 * Math.sin((latitude * PI) / 30)) * 2) / 3;
  return result;
}

function longitudeOffset(longitude: number, latitude: number) {
  let result =
    300 +
    longitude +
    2 * latitude +
    0.1 * longitude * longitude +
    0.1 * longitude * latitude +
    0.1 * Math.sqrt(Math.abs(longitude));
  result += ((20 * Math.sin(6 * longitude * PI) + 20 * Math.sin(2 * longitude * PI)) * 2) / 3;
  result += ((20 * Math.sin(longitude * PI) + 40 * Math.sin((longitude / 3) * PI)) * 2) / 3;
  result +=
    ((150 * Math.sin((longitude / 12) * PI) + 300 * Math.sin((longitude / 30) * PI)) * 2) / 3;
  return result;
}

/**
 * Converts source WGS84 coordinates to the GCJ-02 system used by mainland
 * Chinese online basemaps such as Gaode. The source values remain unchanged
 * in the data cards; this conversion is only used for visual alignment.
 */
export function wgs84ToGcj02(latitude: number, longitude: number): [number, number] {
  if (isOutsideMainlandChina(latitude, longitude)) return [latitude, longitude];

  const latitudeRadians = (latitude / 180) * PI;
  const magic = 1 - ECCENTRICITY_SQUARED * Math.sin(latitudeRadians) ** 2;
  const sqrtMagic = Math.sqrt(magic);
  const deltaLatitude =
    (latitudeOffset(longitude - 105, latitude - 35) * 180) /
    (((SEMI_MAJOR_AXIS * (1 - ECCENTRICITY_SQUARED)) / (magic * sqrtMagic)) * PI);
  const deltaLongitude =
    (longitudeOffset(longitude - 105, latitude - 35) * 180) /
    ((SEMI_MAJOR_AXIS / sqrtMagic) * Math.cos(latitudeRadians) * PI);

  return [latitude + deltaLatitude, longitude + deltaLongitude];
}
