# Supabase configuration

Owner explicitly selected the existing **Rountable Ai Project**, ref `ezhbazkusalcladzlhci`, on 15 November 2026. The paused project was restored; its existing tables/data were not replaced or renamed.

The additive `earth_signal_collections` table stores account-owned place/topic/investigation IDs. RLS is enabled; authenticated CRUD requires `auth.uid() = user_id`. Anonymous table access is revoked. The migration source is in `supabase/migrations/202611150001_earth_signal_collections.sql`.

Public project URL and publishable key are configured locally and on Vercel. No Supabase service-role credential is used. My Earth exposes email/password sign-in and signup plus explicit merge actions: add browser saves to cloud, or merge cloud saves into this browser. Existing local saves remain available. Cloud additions are upserts; deleting local bookmarks does not delete cloud copies.

Verification: restored project status, migration/table/policy inspection and anonymous read/write denial. Full email-confirmation and authenticated two-user UI journeys need user-controlled accounts; no test confirmation email was sent automatically.

Auth setup to review in Supabase Dashboard: set production Site URL to `https://earth-signal-seven.vercel.app` and allow local development URLs if needed. The SDK uses email/password flows. Existing project's email provider and confirmation settings are retained. Do not weaken RLS or disable confirmation to work around setup errors.

Earthdata and Cesium credentials were also configured. Earthdata is server-only; Cesium is deliberately public client configuration. Rotate the Earthdata token shared in chat using provider settings.
