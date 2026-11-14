const DECIMAL_NUMBER = /^[-+]?(?:\d+\.?\d*|\.\d+)$/;

export function parseCoordinatePair(latitudeInput, longitudeInput) {
  const latitudeText = String(latitudeInput ?? '').trim();
  const longitudeText = String(longitudeInput ?? '').trim();
  if (!latitudeText || !longitudeText) return { valid: false, error: 'Enter both latitude and longitude to continue.' };
  if (!DECIMAL_NUMBER.test(latitudeText) || !DECIMAL_NUMBER.test(longitudeText)) return { valid: false, error: 'Use decimal degrees, for example 22.15 and 89.65.' };
  const latitude = Number(latitudeText);
  const longitude = Number(longitudeText);
  if (latitude < -90 || latitude > 90) return { valid: false, error: 'Latitude must be between -90 and 90.' };
  if (longitude < -180 || longitude > 180) return { valid: false, error: 'Longitude must be between -180 and 180.' };
  return { valid: true, latitude, longitude };
}

export function formatCoordinatePair(latitude, longitude) { return `${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}`; }
