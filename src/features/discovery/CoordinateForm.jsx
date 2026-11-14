import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { formatCoordinatePair, parseCoordinatePair } from '../../services/discovery/coordinates';

export default function CoordinateForm({ onSubmit }) {
  const [latitude, setLatitude] = useState(''); const [longitude, setLongitude] = useState(''); const [error, setError] = useState('');
  const submit = (event) => { event.preventDefault(); const parsed = parseCoordinatePair(latitude, longitude); if (!parsed.valid) { setError(parsed.error); return; } setError(''); onSubmit({ ...parsed, label: formatCoordinatePair(parsed.latitude, parsed.longitude) }); };
  return <form className="discovery-coordinate-form" onSubmit={submit} noValidate><div className="coordinate-fields"><label><span>Latitude</span><input value={latitude} onChange={(event) => setLatitude(event.target.value)} inputMode="decimal" placeholder="22.1500" aria-describedby={error ? 'coordinate-error' : undefined} /></label><label><span>Longitude</span><input value={longitude} onChange={(event) => setLongitude(event.target.value)} inputMode="decimal" placeholder="89.6500" aria-describedby={error ? 'coordinate-error' : undefined} /></label></div>{error && <p className="coordinate-error" id="coordinate-error" role="alert">{error}</p>}<button className="coordinate-submit" type="submit">Assess this location <ArrowUpRight size={17} aria-hidden="true" /></button><p className="coordinate-help">Decimal degrees only. Location assessment opens in the map workspace.</p></form>;
}
