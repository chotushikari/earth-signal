import rawCatalog from '../../../resources/asf-results-2026-10-08_23-06-00.json' with { type: 'json' };
import { normalizeCatalog } from '../../features/explorer/catalog.js';

export const DISCOVERY_SOURCE = Object.freeze({
  SNAPSHOT: 'snapshot',
  LIVE: 'live',
  UNAVAILABLE: 'unavailable',
});

const TOPIC_REQUIREMENTS = Object.freeze({
  water: ['GCOV'],
  'ground-movement': ['GUNW'],
  forests: ['GCOV'],
  farms: ['SME2', 'GCOV'],
  ice: ['GOFF', 'GUNW'],
  explore: [],
});

function sourceRecords(input) {
  if (!Array.isArray(input)) return [];
  return Array.isArray(input[0]) ? input[0] : input;
}

function isoDate(value) {
  const timestamp = Date.parse(value ?? '');
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function dateRange(features) {
  const dates = features
    .map((feature) => isoDate(feature.properties?.startTime))
    .filter(Boolean)
    .sort();
  return dates.length ? { start: dates[0], end: dates.at(-1) } : null;
}

/**
 * Builds a source-labelled discovery summary. It does not evaluate a user AOI
 * or assert scientific readiness; topic state remains `needs_location` until
 * a location-aware provider response is checked by the readiness engine.
 */
export function createDiscoverySummary(records, { source, sourceLabel, fetchedAt = null } = {}) {
  const normalized = normalizeCatalog(sourceRecords(records));
  const productFamilies = [...new Set(
    normalized.features.map((feature) => feature.properties?.processingLevel).filter(Boolean),
  )].sort();

  return {
    source: source ?? DISCOVERY_SOURCE.UNAVAILABLE,
    sourceLabel: sourceLabel ?? 'No discovery source configured',
    fetchedAt: fetchedAt ?? null,
    observationCount: normalized.features.length,
    dateRange: dateRange(normalized.features),
    productFamilies,
    rejectedRecordCount: normalized.errors.length,
    topicAvailability: Object.entries(TOPIC_REQUIREMENTS).map(([topicId, requiredProducts]) => ({
      topicId,
      requiredProducts,
      matchingProductFamilies: requiredProducts.length
        ? requiredProducts.filter((product) => productFamilies.includes(product))
        : productFamilies,
      state: 'needs_location',
      reason: 'A location and date range are required before data readiness can be assessed.',
    })),
  };
}

export function getBundledDiscoverySummary() {
  return createDiscoverySummary(rawCatalog, {
    source: DISCOVERY_SOURCE.SNAPSHOT,
    sourceLabel: 'Bundled ASF catalog snapshot (2026-10-08)',
  });
}
