# Discover motion and source attribution

The user requested a rotating Earth, changing headline, reference navigation and authentic clickable mission-source marks. The existing light/forest-green system is retained.

- Three.js is loaded lazily for a textured Earth. Rotation is capped near 30 fps and stops updating rotation when paused, offscreen, hidden or reduced motion is requested. Resize/visibility observers and GPU resources are cleaned up on unmount.
- The headline cycles three words on a fixed-width inline slot. The visible Pause animations control stops the globe and headline; the screen-reader heading remains stable.
- Agency/source marks are locally stored with attribution. Hover and keyboard focus disclose concise roles. Clicks open `/sources` at the relevant section. Copy distinguishes the live ASF integration from the currently unconnected Bhoonidhi route.
- Discover's left rail includes Data Readiness, topic navigation, methodology and data sources, following the supplied reference hierarchy.
- Earthdata remains a server-only configuration. Cesium is an intentionally public client token. No credentials belong in committed files. Local configuration is gitignored.

Verified: production build; detector on new UI targets; desktop and narrow view inspection; loaded globe and all three logos; narrow viewport overflow check; source review and fix-list verdict. Supabase project configuration remains pending successful connector access.
