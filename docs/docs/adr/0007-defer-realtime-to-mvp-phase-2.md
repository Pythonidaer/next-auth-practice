# ADR 0007: Defer Real-time Features and Push Notifications to Post-MVP

## Status

Accepted

## Context

The Meatbag app is being built as a fitness platform with user-authored and shareable workout plans.

There are use cases where a real-time user experience could enhance usability:

- A user sends a workout plan to another user and expects it to appear instantly
- A trainee receives updates or messages without refreshing
- Collaborative or time-sensitive interactions

We explored real-time delivery options like:

- WebSockets or Server-Sent Events
- Push notification systems
- Third-party services (e.g., Pusher, Ably, Supabase Realtime)

These systems add:

- Infrastructure complexity (event-driven, pub/sub, connection management)
- Vendor integration or cost (some services have free tiers with usage limits)
- Testing complexity and new failure modes

## Decision

We will **not implement real-time features or push notifications** in the MVP.

Instead, we will:

- Use **manual refresh** or **auto-polling** with a free data-fetching library (SWR or React Query)
- Structure our database to support "new" or "unseen" content flags (e.g., `viewed: false`)
- Design the UI to make updates discoverable (e.g., badges, refresh indicators)

This aligns with our goals for:

- Simplicity
- Low cost
- Faster delivery
- User expectations at MVP stage

## Consequences

- Users may need to manually refresh the dashboard or rely on polling to see new workout plans
- No in-browser or device push notifications in MVP
- The system architecture remains simpler and easier to maintain early on
- We'll revisit this ADR once user feedback or scaling needs indicate the need for stronger real-time UX

## Future Considerations

If demand increases or real-time UX becomes critical, we may:

- Adopt [Pusher Channels](https://pusher.com/channels/) or [Supabase Realtime](https://supabase.com/realtime)
- Use polling now with a toggleable abstraction to support pub/sub later
- Introduce server-side events (SSE) or background job orchestration for notification delivery

---

_Created: 2025-06-20_
