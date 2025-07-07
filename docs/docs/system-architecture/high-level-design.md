# Design Doc

## 1. Overview

This document outlines the high-level architecture design for the Meatbag fitness application. Meatbag aims to build a robust MVP web application that helps gymgoers manage and track their workout routines, share workout plans with others, and maintain a consistent fitness regimen.

This design document addresses the architectural requirements, provides a high-level design, considers alternatives, and outlines a timeline for implementation of the MVP and future enhancements.

## 2. Context

Meatbag's fitness application is designed to solve the common problem of workout planning and tracking in a collaborative environment. The goal is to create an architecture that is simple, user-focused, and maintainable, allowing for efficient development and future scaling as the application grows beyond MVP.

The Meatbag fitness app is part of the **Meatbag System**, which is the software system that allows users to create workout plans, track their progress, share plans with other users, and maintain a record of their fitness journey.

![System Context Diagram](/img/meatbag_context_view.png)

## 3. Goals and Non-Goals

### Goals

- **Usability**: Design an application that clearly shows users what to do next (e.g., today's workout) with minimal UI clutter.
- **Performance**: Optimize the application for quick load times (under 1 second on 4G or broadband) and smooth user interactions, especially on mobile devices.
- **Modifiability**: Ensure the codebase is structured to allow developers to add or update features with confidence.
- **Simplicity**: Maintain a focused, intuitive interface that helps users concentrate on their workouts rather than navigating the app.
- **Timeliness**: Support sequential progression through workout days with reliable persistence of completion state.

### Non-Goals

- **Real-time Synchronization**: The MVP will not include real-time features like chat or push notifications.
- **Advanced Authentication**: The MVP will rely solely on Google OAuth via NextAuth.js, without email-based or credential-based authentication.
- **Native Mobile App Development**: The scope is limited to the web application, and does not include development of native mobile apps.
- **Complex Analytics**: Advanced workout analytics and goal tracking are out of scope for the MVP.

## 4. High Level Design

We're building the Meatbag fitness application as a monolithic server-side rendered React app using Next.js. The app will handle both frontend and backend functionality, including UI rendering, routing, API logic, and server-side authentication. It will communicate with a PostgreSQL database through a planned Prisma ORM integration.

### Container Diagram

![Container Diagram](/img/meatbag_container_view.png)

### Architectural Style

- **Monolithic Web App**: Using Next.js for a unified frontend and backend experience.
- **Client-Server Architecture**: With hybrid rendering (SSR + CSR) for optimal performance.
- **Component-Based UI**: Built with React for reusable, maintainable interface elements.
- **Data-Driven Interaction Model**: Using PostgreSQL for structured data storage.
- **Fullstack Application**: Deployed on Vercel for seamless CI/CD integration.

### Key Components

1. **Authentication Module**: Manages user registration and login via Google OAuth using NextAuth.js.

2. **Workout Program Module**: Handles the creation, editing, and management of workout programs.

3. **Workout Group Module**: Manages the organization of workout days within groups (e.g., weeks).

4. **Workout Day Module**: Controls the display and interaction with individual workout days.

5. **Exercise Module**: Manages exercise details, completion tracking, and performance logging.

6. **Sharing Module**: Facilitates the assignment of workout programs between users.

7. **Dashboard Module**: Provides an overview of the user's workout progress and upcoming activities.

8. **User Profile Module**: Manages user profile information and settings.

### Technology Stack

- **Frontend**: React, Next.js (App Router), React Server Components
- **Backend**: Next.js API routes, NextAuth.js
- **Database**: PostgreSQL
- **ORM**: Prisma (planned)
- **Deployment**: Vercel
- **Documentation**: Docusaurus
- **Testing**: Jest with React Testing Library

## 5. Alternatives Considered

1. **Separate Frontend and Backend**: While splitting the frontend and backend would provide clearer separation of concerns, a monolithic Next.js app was chosen for simplicity, faster development, and easier deployment, especially for the MVP phase.

2. **Tailwind CSS**: Although Tailwind offers rapid UI development, plain CSS was chosen based on the developer's experience and to maintain simplicity in the MVP. This may be reconsidered in future iterations.

3. **TypeScript**: While TypeScript provides better type safety and developer experience, JavaScript was chosen for the MVP to allow for faster iteration. TypeScript adoption is planned post-MVP.

4. **Storybook**: While Storybook would provide better component documentation, it was deferred in favor of manual documentation in Docusaurus for the MVP, with plans to revisit post-MVP.

5. **Real-time Features**: Although real-time updates would enhance user experience, they were deemed unnecessary for the MVP. The architecture is designed to support future integration of polling, SWR, or pub/sub mechanisms.

## 6. Timeline

### Phase 1: MVP Foundation (Current)

- Set up Next.js application with App Router
- Implement Google OAuth authentication via NextAuth.js
- Create basic user profile management
- Develop core workout program creation and editing functionality
- Implement exercise tracking and completion features
- Design and build the dashboard for workout tracking

### Phase 2: Enhanced Features (Post-MVP)

- Integrate Prisma ORM for improved database interactions
- Add more sophisticated workout sharing capabilities
- Implement additional authentication methods (credentials, magic link)
- Enhance the dashboard with more detailed progress tracking
- Add exercise history and performance visualization

### Phase 3: Scaling and Optimization

- Migrate to TypeScript for improved type safety and developer experience
- Implement Storybook for better component documentation
- Consider extracting backend into a separate service as scale grows
- Add more comprehensive testing coverage
- Optimize performance for larger user base

## 7. Risks and Open Questions

### Risks

- **Data Model Complexity**: The nested structure of workout programs (Program → Group → Day → Exercise) may lead to complex queries and potential performance issues.
- **User Experience**: Ensuring the application remains intuitive and focused as features are added could be challenging.
- **Authentication Limitations**: Relying solely on Google OAuth may limit user accessibility.
- **Performance on Mobile**: Ensuring optimal performance on mobile devices, especially for gesture-based navigation.

### Open Questions

- **Workout Progress Tracking**: How detailed should the progress tracking be for the MVP?
- **Exercise Data Structure**: Should exercises have predefined templates or be fully customizable?
- **Sharing Permissions**: What level of control should users have over shared workout programs?
- **Future Scalability**: How will the architecture evolve if user numbers grow significantly?

## 8. Appendix

### References

- [Project Specification](./project-spec.md)
- [Domain Model](./domain-model.md)
- [ERD Diagram](./erd-diagram.md)
- [Architectural Requirements](./requirements.md)
- [Architecture Overview](./overview.md)
- [Authentication Sequence Diagram](../guides/authentication-sequence-diagram.md)
- [Workout Day Navigation Sequence Diagram](../guides/workout-day-navigation-sequence-diagram.md)
- [Exercise Completion Sequence Diagram](../guides/exercise-completion-sequence-diagram.md)
