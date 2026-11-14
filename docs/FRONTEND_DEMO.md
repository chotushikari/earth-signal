# Frontend demonstration

The reference design now extends through Discover, the catalog map, the investigation library and comparison workspace, My Earth, and the report library/preview. All pages use the shared paper, white and forest-green system.

The investigation route is explicitly a frontend demonstration. Its comparison uses the same NASA Earth Observatory context image with display styling; it contains no computed change measurements. The timeline selects demonstration frames. Scientific quality and processing remain unassessed.

My Earth stores selected curated place IDs and followed topics in browser localStorage. This is local device persistence without an account or remote database. Monitoring and activity explain their pending API state. Report previews print through the browser as demonstration reports.

Production host: https://earth-signal-seven.vercel.app

Next integration work: location search, source catalog requests, observation raster loading, compatible comparison pairs, validated processing outputs, evidence exports, and account persistence.
