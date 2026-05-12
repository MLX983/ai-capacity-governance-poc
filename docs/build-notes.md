# Build Notes — POC3 AI Capacity Governance

## Build approach

- React + Vite
- Static sample data
- Local React state only
- Mobile-first layout
- Optimized for iframe embed

## Key implementation priorities

1. Preserve the simple governance workflow.
2. Keep routing state obvious.
3. Avoid backend or real AI calls.
4. Keep visual styling close to Figma tokens.
5. Make queue updates visible after approval, rerouting, or revision.

## Known risks

- Cursor may overbuild the routing logic.
- Cursor may interpret the edit panel as a literal mobile bottom sheet.
- Premium review may become too text-heavy on mobile.
- Queue updates need to be visually obvious enough for portfolio viewers.