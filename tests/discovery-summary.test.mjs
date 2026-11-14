import assert from 'node:assert/strict';
import { DISCOVERY_SOURCE, getBundledDiscoverySummary } from '../src/services/discovery/summary.js';

const summary = getBundledDiscoverySummary();

assert.equal(summary.source, DISCOVERY_SOURCE.SNAPSHOT);
assert.equal(summary.observationCount, 153);
assert.deepEqual(summary.productFamilies, ['GCOV', 'GOFF', 'GSLC', 'GUNW', 'RIFG', 'ROFF', 'RRSD', 'RSLC', 'RUNW', 'SME2']);
assert.equal(summary.dateRange.start, '2026-06-18T23:20:33.000Z');
assert.equal(summary.dateRange.end, '2026-10-04T23:22:05.000Z');
assert.equal(summary.topicAvailability.length, 6);
assert.ok(summary.topicAvailability.every((topic) => topic.state === 'needs_location'));

console.log('Discovery snapshot summary contract passed.');
