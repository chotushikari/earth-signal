# Earth Signal Design System

## Design intent

Earth Signal is a precise scientific workspace, not a decorative satellite dashboard. The application remains readable for a non-specialist while allowing experts to inspect provenance and method.

## Tokens

| Token | Value | Use |
|---|---|---|
| Canvas | `#F5F6F3` | Application workspace target for V2 map/product shell |
| Surface | `#FFFFFF` | Panels and forms |
| Text | `#18231F` | Primary reading text |
| Secondary | `#68746D` | Supporting text |
| Brand | `#315F4A` | Enabled primary actions |
| Caution | `#B98238` | Limited or observation state |
| Water | `#397FAD` | Water data/layers only |
| Risk | `#BA514C` | Failure or significant quality issue |
| Border | `#E3E7E1` | Structure, not decoration |

## Interaction rules

- Use an 8px spacing rhythm, thin borders and minimal shadows.
- Status always includes plain-language meaning and is never color-only.
- The map may use a dark data canvas, while controls preserve readable application contrast.
- Loading, empty, partial, invalid, API failure, authentication failure and processing failure are explicit states.
- Respect keyboard focus and reduced motion. Do not hide essential status on mobile.
- Avoid decorative gradients, glass, generic geospatial imagery, fake telemetry and card-grid marketing patterns.
