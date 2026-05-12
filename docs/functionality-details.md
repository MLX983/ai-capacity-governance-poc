POC3 — Functionality Details

Concept

This proof of concept shows an AI capacity governance workflow for enterprise teams. When a team approaches or exceeds its weekly AI capacity allocation, certain requests are flagged for review before additional compute is used.

The user is an admin or operations reviewer. Their job is not to generate AI output directly. Their job is to supervise routing decisions: approve the recommended route, choose a lower-cost route, defer work to a batch process, or send the request back for revision.

Core Interaction Model

The POC has two main flows:

Flow 1 — Route to smaller model

1. User starts on AI Capacity by Team.
2. Sales Operations is above its weekly allocation and has flagged requests.
3. User opens the flagged request list.
4. User edits a request’s route.
5. User selects a routing option such as small model, standard model, summarize first, or overnight batch.
6. The request card updates to reflect the selected route.
7. User approves the updated route.
8. The request leaves the active review queue.

Flow 2 — Approve premium route request

1. User opens the flagged request list.
2. A high-priority request requires premium model review.
3. User opens the premium route review screen.
4. User reviews the request summary, why it was flagged, and the suggested route.
5. User can expand the explanation to see additional rationale.
6. User approves the premium route or chooses an alternative route.
7. The request leaves the active review queue.

Functional Behaviors

Screen 1: AI Capacity by Team

- Shows team-level AI capacity status.
- Sales Operations shows high usage and a link to review flagged requests.
- Tapping “Review 8 flagged requests” opens Screen 2.

Screen 2: Flagged Requests

- Shows a list of flagged AI requests for Sales Operations.
- Each request includes title, requestor, estimated use, and recommended route.
- Standard requests allow quick approval or editing.
- Premium requests require a review detail screen before approval.
- Approving a request removes it from the active queue or marks it completed.
- Editing a request opens the routing options panel.

Screen 2: Edit Routing Panel

- Allows the admin to choose an alternate route.
- Model routing options include small model, standard model, premium model, summarize first, and overnight batch.
- Request revision options include narrow scope and split into smaller tasks.
- Selecting a routing option updates the request’s selected route.
- Selecting a request revision option sends the request back rather than approving it.

Screen 3: Premium Route Review

- Shows detail for a request that requires premium model approval.
- Includes request summary, why flagged, suggested route, routing options, and request revision actions.
- “View more” expands additional rationale.
- “View less” collapses the additional rationale.
- Approving the premium route returns the user to the flagged request list with the request completed or removed.

State and Data

- The POC uses static sample data.
- No backend, authentication, real model calls, or persistence are required.
- State changes should be local and visible immediately.
- The main cause/effect moments are:
  - Route changed → request card updates.
  - Request approved → request leaves active queue.
  - Request sent back → request leaves active queue or shows a sent-back state.
  - Premium route opened → reviewer sees why extra approval is required.

Design Intent

The interface should feel like a serious enterprise governance tool, not a chatbot or consumer AI assistant. The visual tone should remain simple, compact, administrative, and mobile-first.

The key story is controlled delegation: AI requests can proceed, but expensive or risky routing decisions require human oversight.