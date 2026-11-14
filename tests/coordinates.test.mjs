import assert from 'node:assert/strict';
import { parseCoordinatePair } from '../src/services/discovery/coordinates.js';
assert.deepEqual(parseCoordinatePair('22.15', '89.65'), { valid: true, latitude: 22.15, longitude: 89.65 });
assert.equal(parseCoordinatePair('', '89.65').valid, false);
assert.match(parseCoordinatePair('north', '89.65').error, /decimal degrees/i);
assert.match(parseCoordinatePair('91', '89.65').error, /-90 and 90/);
assert.match(parseCoordinatePair('22.15', '181').error, /-180 and 180/);
console.log('Coordinate validation passed.');
