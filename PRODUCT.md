# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Researchers, educators, and local analysts investigating a physical place and needing to understand whether credible Earth-observation evidence is available for their question.

## Product Purpose

Earth Signal is an evidence-first discovery and investigation workspace for NASA–ISRO NISAR observations. It helps a person move from a place and a question to clear data readiness, method limits, and eventually a reproducible evidence report.

## Positioning

Earth Signal treats uncertainty and unavailable data as first-class outcomes: it shows what the evidence can support before it offers an interpretation.

## Operating Context

People begin with a topic, place, or coordinates; define an area of interest; inspect data readiness and methodological constraints; then review or save an evidence record. The current product is a frontend shell: real catalogues, processing, map data, persistence, and exports are deliberately not connected.

## Capabilities and Constraints

- Topic areas are water, ground movement, forests, farms, ice, and map exploration.
- SME2 and GCOV are the intended first science workflows; GUNW and GOFF remain limited until real-data validation.
- Status labels must remain truthful: ready, limited, no data, incompatible, quality warning, or not implemented.
- No new third-party provider, user-data storage, credential, or paid service may be added without explicit approval.
- The existing React and Vite implementation is the product stack.

## Brand Commitments

The product name is Earth Signal. Its voice is calm, precise, curious, and scientifically candid; it never invents observations, results, regions, or capabilities.

## Evidence on Hand

Product brief: `docs/earth-signal-kit/01_PRODUCT/PRODUCT_BRIEF.md`. Current frontend implementation: `docs/FRONTEND_IMPLEMENTATION.md`. No verified live observation results, curated regions, account data, testimonials, or provider integrations are available to display.

## Product Principles

- Evidence before interpretation.
- A place is the natural starting point.
- Limits are useful product information.
- A reusable method matters more than a persuasive dashboard.

## Accessibility & Inclusion

The web interface must support keyboard navigation, visible focus, reduced motion, responsive layouts, and readable contrast.
