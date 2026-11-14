export const topics = [
  { id: 'water', title: 'Water and wetlands', icon: 'waves', readiness: 'not_implemented', product: 'GCOV', description: 'Explore water extent, wetland dynamics, and inundation-related radar observations.', limitation: 'Backscatter change alone cannot establish flooding, cause, or impact.' },
  { id: 'ground-movement', title: 'Ground movement', icon: 'move', readiness: 'limited', product: 'GUNW', description: 'Understand whether line-of-sight surface displacement can be investigated.', limitation: 'Line-of-sight displacement is not vertical movement without a defensible conversion.' },
  { id: 'forests', title: 'Forests and vegetation', icon: 'trees', readiness: 'not_implemented', product: 'GCOV', description: 'Explore calibrated radar-response patterns associated with vegetation and surface disturbance.', limitation: 'A radar response change is not automatically deforestation or fire damage.' },
  { id: 'farms', title: 'Farms and soil', icon: 'sprout', readiness: 'limited', product: 'SME2 + GCOV', description: 'Explore soil-moisture conditions and agricultural surface dynamics.', limitation: 'Soil moisture does not by itself diagnose irrigation, crop stress, or rainfall cause.' },
  { id: 'ice', title: 'Ice and glaciers', icon: 'snowflake', readiness: 'limited', product: 'GOFF + GUNW', description: 'Explore suitable motion and change observations across ice-covered regions.', limitation: 'Motion requires verified offset variables, quality layers, and coordinate conventions.' },
  { id: 'explore', title: 'Explore any area', icon: 'map', readiness: 'not_implemented', product: 'Product-dependent', description: 'Find which NISAR products and evidence paths may be available for a location.', limitation: 'Availability must be assessed for the exact area, dates, and product.' },
];

export const readinessCopy = {
  ready: 'Ready',
  limited: 'Limited data',
  no_data: 'No data found',
  incompatible: 'Incompatible',
  quality_warning: 'Quality warning',
  not_implemented: 'Analysis unavailable',
};

export function findTopic(id) {
  return topics.find((topic) => topic.id === id) || topics[5];
}
