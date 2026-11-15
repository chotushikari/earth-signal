// Metadata availability is distinct from science readiness; QA remains worker-owned.
import { normalizeCatalog } from '../../features/explorer/catalog.js';
export function assessReadiness(records, product, {error = '', location = false} = {}) {
  const matching=records.filter(record=>String(record.processingLevel).toUpperCase()===product);
  const dates=[...new Set(matching.map(record=>record.startTime?.slice(0,10)).filter(Boolean))].sort();
  const validGeometry=normalizeCatalog(matching).features.length;
  return {product,count:matching.length,dates,validGeometry,status:error?'error':matching.length?'limited':'no_data',reason:error||(!location?'Choose a location to assess local availability.':!matching.length?'No observations returned for this query.':'Catalog observations found. Pixel quality, variables and scientific compatibility require validation.'),scienceReady:false};
}
