# Initial Cursor Prompt — AI Capacity Governance POC

I’m building a mobile-first React + Vite proof of concept based on the Figma frames and local reference materials in this project folder.

GitHub repo remote:

https://github.com/MLX983/ai-capacity-governance-poc.git

## Important first instruction

Start with a one-pass scaffold.

For the first pass, create the app structure, static data, routing/state model, and unstyled or lightly styled screens first. Do not polish the visual styling yet.

The first milestone should be a working prototype where the interaction logic is clear and the app compiles successfully.

After the scaffold is working, we will apply the Figma tokens and refine the visual styling to match the screenshots.

## Project concept

This POC is an enterprise AI capacity governance workflow.

Teams have weekly AI compute allocations. When a team is above trend or near capacity, certain AI requests are flagged for review before more compute is used.

The user is an admin/reviewer. They are not generating AI content directly. They are supervising routing decisions:

- approve the recommended route
- choose a lower-cost model
- defer work to a batch process
- send the request back for revision

## Design intent

This should feel like a serious enterprise governance/admin tool, not a chatbot, AI assistant, or flashy dashboard.

Preserve the Figma visual direction during the visual refinement pass:

- mobile-first layout
- compact cards
- teal headings
- blue text links
- thin dividers
- lightweight buttons
- generous whitespace
- straightforward administrative controls

Use the Figma Design Tokens page as the source for color, typography, spacing, borders, and component styling where possible.

## Build constraints

- React + Vite
- TypeScript preferred
- No backend
- No authentication
- No real AI/model API calls
- No persistent storage required
- Use local React state and static sample data
- Optimize for a mobile iframe embed
- Keep the implementation simple and readable
- Do not overbuild

## Recommended local structure

Use or adapt this structure:

```text
src/
  App.tsx
  main.tsx
  data/
    requests.ts
  components/
    PageShell.tsx
    CapacityCard.tsx
    RequestCard.tsx
    RoutingPanel.tsx
  screens/
    CapacityScreen.tsx
    FlaggedRequestsScreen.tsx
    PremiumReviewScreen.tsx
  styles/
    tokens.css
    app.css