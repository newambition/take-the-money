---
description: 
globs: 
alwaysApply: false
---
# Naming Conventions

This document outlines the naming conventions used in this project.

## Authentication (Auth0)

**Environment Variables:**

Credentials in .env:

-   `REACT_APP_AUTH0_DOMAIN`: Auth0 domain for tenant.
-   `REACT_APP_AUTH0_CLIENT_ID`: The Client ID 
-   `REACT_APP_AUTH0_AUDIENCE`: API identifier

**Components:***

Components in the `src/components/Auth/` directory.

-   `[LoginButton.js](mdc:src/components/Auth/LoginButton.js)`: Component for user login.
-   `[LogoutButton.js](mdc:src/components/Auth/LogoutButton.js)`: Component for user logout.
-   `[Profile.js](mdc:src/components/Auth/Profile.js)`: Component to display the authenticated user's profile.

**Configuration:**

- Auth0 provider is configured in `[src/index.js](mdc:src/index.js)`
- Aapplication is wrapped in the `Auth0Provider`.
