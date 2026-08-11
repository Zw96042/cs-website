# Design decisions

## Implementation — React and Vite

- Page sections are focused React components under `src/components/`; repeated officers, projects, meeting steps, and questions are data-driven.
- Canvas rendering remains in `site.js`, behind a mount-and-cleanup lifecycle exposed to React through `src/lib/animations.js`.
- The prototype gallery remains a separate static design tool under `proto/` and is available from the Vite development server.

## Homepage — promoted from the original page prototypes

- Direction: Foundry’s restrained dark canvas, asymmetric hero, code-built graph, and editorial pacing.
- Typography: Newsreader for display roles and Geist for interface/body roles; no mixed sans/italic headline treatment.
- Actions: flat typographic links with one clear primary action, not large rounded button blocks.
- Rejected: Index and Workshop were more layout-forward than the club needs; Monolith was too theatrical; the remaining directions were useful explorations but weaker as a durable homepage system.

## Dijkstra hero — decided from `/proto/dijkstra/`

- Direction: Backtrack — compact search, then deliberate G → A predecessor reconstruction.
- Duration: 2500ms total.
- Timeline: 0–12% reveal; 12–58% search; 58–92% backtrack; 92–100% resolved path.
- Easing: linear master timeline; individual edge traces use a strong ease-out.
- Replay: click or tap the graph; reduced motion renders the resolved path immediately.
- Rejected: Frontier made relaxation visible but did less to explain the result; Ledger was the most explicit but too dense for a homepage hero.
