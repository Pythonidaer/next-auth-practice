# Getting Started

Welcome to the MEATBAG workout application documentation! This guide will help you understand the application and navigate through the documentation effectively.

## About the Application

MEATBAG is a Next.js-based workout tracking application that helps users manage their fitness routines. The application features:

- User authentication via Google OAuth
- Personalized workout plans
- Exercise tracking and progress monitoring
- Responsive design for both desktop and mobile use
- Timer functionality for workout sets

## How to Use This Documentation

This documentation is organized into several sections, each focusing on different aspects of the application. Here's how to navigate and get the most out of each section:

### System Architecture

The `system-architecture` section provides a high-level overview of how the application is structured:

- **High-Level Design**: Explains the overall architecture, component relationships, and data flow
- **Tech Stack**: Details the technologies used and why they were chosen
- **Deployment**: Information about the deployment process and environments

Start here if you want to understand the big picture before diving into specific components.

### Architecture Decision Records (ADR)

The `adr` section contains records of significant architectural decisions made during development:

- Each ADR explains the context, decision, and consequences of important technical choices
- These records help understand why certain approaches were taken over alternatives
- Useful for understanding the evolution of the application's architecture

Refer to this section when you need to understand the reasoning behind specific architectural choices.

### Guides

The `guides` section provides step-by-step instructions for common tasks and workflows:

- **Workout Creation Flow**: How to create and manage workout routines
- **Authentication Flow**: How the authentication process works
- **Development Setup**: How to set up your local development environment

Use these guides when you need practical instructions for specific features or development tasks.

### API

The `api` section documents the application's API endpoints and utilities:

- **Overview**: General information about the API structure and conventions
- **Auth**: Authentication-related endpoints and functionality
- **Routes**: Available API routes and their parameters
- **Utils**: Utility functions used throughout the API

Consult this section when working with the application's backend services or integrating with external systems.

### Database

The `database` section covers the data model and database interactions:

- **Schema**: Database schema definitions and relationships
- **Models**: Data models and their properties

Refer to this section when you need to understand data structures or make database-related changes.

### Tests

The `tests` section documents the testing strategy and specific test suites:

- **Coverage**: Overview of test coverage goals and current status
- **Component Tests**: Documentation of UI component tests
- **App Tests**: Documentation of page and route tests
- **Utility Tests**: Documentation of utility function tests

Use this section to understand how the application is tested and how to write new tests following the established patterns.

## Contributing to Documentation

This documentation is designed to be maintainable and expandable. When adding new documentation:

1. Place files in the appropriate section directory
2. Use clear, concise markdown formatting
3. Update the sidebar in `docs/sidebars.js` to include new files
4. Follow the existing naming and organization patterns

## Future Development Workflow

### Windsurf Rules for Development

To maintain consistency and quality in future development, this project follows a structured workflow defined in the `WINDSURF_RULES.md` file located in the project root. This file serves as the source of truth for development processes when working with Windsurf's Cascade AI assistant.

#### Key Workflow Components

1. **Test-Driven Development (TDD)**

   - All new features begin with test creation
   - Tests follow patterns documented in `docs/docs/tests`
   - Reference `UNIT_TESTING_BEST_PRACTICES.md` for test standards

2. **Feature Implementation**

   - Implement features only after tests are created
   - Follow established patterns in similar components/features
   - Maintain consistent code style and organization

3. **Verification**

   - Manual testing of UI components for visual consistency
   - Code review for maintainability and readability
   - Ensure tests pass and provide adequate coverage

4. **Documentation**
   - Update Docusaurus documentation as the final step
   - Place documentation in the appropriate section
   - Update sidebar.js to include new documentation
   - Follow existing documentation patterns

### Using Windsurf Rules with Cascade

When requesting Cascade to create or modify features:

1. Cascade will first consult `WINDSURF_RULES.md` to understand the workflow
2. Development will follow the TDD approach by default
3. Documentation will be updated as part of the completion criteria
4. The process isn't complete until all steps (tests, implementation, verification, documentation) are finished

This structured approach ensures consistency, maintainability, and comprehensive documentation across all development efforts.
