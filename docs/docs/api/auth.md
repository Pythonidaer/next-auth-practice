# API: Auth

This section documents the authentication-related API endpoints for the Meatbag application. Authentication is handled by NextAuth.js, providing secure access and session management for users.

---

## Endpoints

### `GET /api/auth/session`

- **Purpose:** Retrieves the current session data. Used by the frontend to determine if a user is logged in and to get user details.
- **Authentication:** Public (but returns null if not authenticated).
- **Response:** `{ user: { id: string, name: string, email: string }, expires: string }` or `null`.

### `POST /api/auth/signin` (and other OAuth callbacks)

- **Purpose:** Initiates the authentication flow (e.g., Google OAuth).
- **Authentication:** Public.

### `POST /api/auth/signout`

- **Purpose:** Ends the user session.
- **Authentication:** Authenticated.

---

## Implementation Notes

- All authentication logic is managed by NextAuth.js.
- API routes can access the user's session to determine authentication state.
- Most other endpoints require the user to be authenticated before access is granted.
