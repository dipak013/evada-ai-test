# API Routes Configuration

## Overview

This document explains the centralized API routes configuration pattern, similar to Django's `urls.py` file. All API endpoints are now defined in a single location: [src/config/api-routes.ts](../src/config/api-routes.ts).

## Benefits

### 1. **Single Source of Truth**
All API endpoints are defined in one file, making it easy to:
- See all available endpoints at a glance
- Understand the complete API surface
- Find conflicting or duplicate routes

### 2. **Easy Refactoring**
Change an endpoint URL once in `api-routes.ts` and it's updated everywhere:
```typescript
// Old way (scattered):
// - Fixed one URL in login.tsx: "/auth/login/"
// - Fixed another URL in auth.service.ts: "/auth/login/"
// - Fixed another URL in api-utils.ts: "/auth/login/"

// New way (centralized):
// - Change once in api-routes.ts → automatically updated everywhere
export const AUTH_ROUTES = {
  login: "/auth/login/", // ← Change once here
};
```

### 3. **Consistency**
- All routes follow the same patterns and naming conventions
- Easier to detect typos or inconsistencies
- Type-safe routes using TypeScript

### 4. **Documentation**
Routes are self-documenting with organized sections and comments:
```typescript
// ============================================================================
// SCHEDULE ROUTES
// ============================================================================
export const SCHEDULE_ROUTES = {
  list: "/schedules/",
  create: "/schedules/",
  detail: (id: number) => `/schedules/${id}/`,
  // ... etc
} as const;
```

### 5. **Version Management**
Easy to support multiple API versions in the future:
```typescript
// Could easily extend to support /v2/ routes
export const SCHEDULE_ROUTES_V2 = {
  list: "/v2/schedules/",
  // ... etc
};
```

## Structure

### Route Groups

Routes are organized by domain/feature:

```typescript
// Authentication
AUTH_ROUTES = {
  login, logout, me, register, csrf, oauthExchange, oauthAuthorize
}

// Applications  
APPLICATION_ROUTES = {
  list, create, detail(id), update(id), toggleStatus(id), delete(id)
}

// Scanning
SCAN_ROUTES = {
  start, run, upload, history, results(appId), network, latestScan(appUuid)
}

// Scheduling
SCHEDULE_ROUTES = {
  list, create, delete(id), detail(id), update(id), byApplication(id), 
  byClient(id, type), byClientAndAgent(clientId, agentId, type)
}

// Dashboard & Analytics
DASHBOARD_ROUTES = {
  alerts, sentinelStats, pastScanStats, cveRemediation
}

// Agent Management
AGENT_ROUTES = {
  upload(os), download(os)
}

// Sidebar
SIDEBAR_ROUTES = {
  clients
}

// Tenant Management
TENANT_ROUTES = {
  users, invite
}

// Jobs & Uploads
JOB_ROUTES = {
  pending, uploadScan
}

// Health Checks
HEALTH_ROUTES = {
  health
}
```

## Usage Examples

### Basic Usage
```typescript
import { AUTH_ROUTES } from "@/config/api-routes";

// Get a static route
const loginUrl = AUTH_ROUTES.login; // "/auth/login/"
```

### Dynamic Routes
```typescript
import { APPLICATION_ROUTES } from "@/config/api-routes";

// Call a function to build dynamic routes
const appDetailUrl = APPLICATION_ROUTES.detail(123); // "/application-configs/123/"
const deleteUrl = APPLICATION_ROUTES.delete(456);     // "/application-configs/456/delete/"
```

### In the Unified API Service
```typescript
// src/services/unified-api.service.ts

import { AUTH_ROUTES, SCAN_ROUTES } from "@/config/api-routes";

export const UnifiedAPIService = {
  auth: {
    login: (credentials: LoginRequest) =>
      api.post<LoginResponse>(AUTH_ROUTES.login, credentials),
  },
  
  scan: {
    startScan: (payload: ScanPayload) =>
      api.post<ScanResult>(SCAN_ROUTES.start, payload),
    
    getLatestScan: (appUuid: string) =>
      api.get<LatestScanResponse>(SCAN_ROUTES.latestScan(appUuid)),
  },
};
```

### Type-Safe Route Usage
```typescript
import { AUTH_ROUTES } from "@/config/api-routes";
import type { AuthRoute } from "@/config/api-routes";

// Type-safe function that accepts only valid auth routes
function makeAuthRequest<T>(route: AuthRoute, method: "GET" | "POST", data?: any): Promise<T> {
  return fetch(`/api${route}`, {
    method,
    body: data ? JSON.stringify(data) : undefined,
  }).then(r => r.json());
}

// ✅ Valid - route exists
makeAuthRequest("/auth/login/", "POST", { email, password });

// ❌ TypeScript error - route doesn't exist
makeAuthRequest("/auth/invalid/", "POST");
```

### Debugging - List All Routes
```typescript
import { getAllRoutes, API_ROUTES } from "@/config/api-routes";

// Get all routes for debugging
console.log(getAllRoutes());

// Output:
// {
//   "auth.login": "/auth/login/",
//   "auth.logout": "/auth/logout/",
//   "applications.list": "/application-configs/",
//   ...
// }

// Or access grouped:
console.log(API_ROUTES.auth);
console.log(API_ROUTES.scan);
```

## Migration Guide

### Before (Scattered Routes)
```typescript
// src/app/(auth)/login/page.tsx
const response = await api.post("/auth/login/", credentials);

// src/services/auth.service.ts
export const logout = () => api.post("/auth/logout/");

// src/components/ConfigureApplicationModal.tsx
const response = await api.get("/application-configs/");

// src/app/(dashboard)/scan/page.tsx
const result = await api.get(`/scan-history/`);
```

### After (Centralized Routes)
```typescript
// src/config/api-routes.ts (single source of truth)
export const AUTH_ROUTES = {
  login: "/auth/login/",
  logout: "/auth/logout/",
};

export const APPLICATION_ROUTES = {
  list: "/application-configs/",
};

export const SCAN_ROUTES = {
  history: "/scan-history/",
};

// All component files now reference these constants:
import { AUTH_ROUTES, APPLICATION_ROUTES, SCAN_ROUTES } from "@/config/api-routes";

// src/app/(auth)/login/page.tsx
const response = await api.post(AUTH_ROUTES.login, credentials);

// src/services/auth.service.ts (via UnifiedAPIService)
UnifiedAPIService.auth.logout();

// src/components/ConfigureApplicationModal.tsx
const response = await api.get(APPLICATION_ROUTES.list);

// src/app/(dashboard)/scan/page.tsx
const result = await api.get(SCAN_ROUTES.history);
```

## Best Practices

### 1. Use Constants, Not Strings
```typescript
// ❌ Bad - scattered magic strings
const response = await api.post("/auth/login/", data);

// ✅ Good - use centralized constant
import { AUTH_ROUTES } from "@/config/api-routes";
const response = await api.post(AUTH_ROUTES.login, data);
```

### 2. Import Only What You Need
```typescript
// ❌ Importing everything (wasteful)
import * as APIRoutes from "@/config/api-routes";

// ✅ Import specific routes (clean)
import { AUTH_ROUTES, SCAN_ROUTES } from "@/config/api-routes";
```

### 3. Dynamic Routes Require Function Calls
```typescript
// ❌ Don't manually construct dynamic routes
const url = `/schedules/${id}/`;

// ✅ Use the route function
import { SCHEDULE_ROUTES } from "@/config/api-routes";
const url = SCHEDULE_ROUTES.detail(id);
```

### 4. Add Comments for Complex Routes
```typescript
// Good practice in api-routes.ts:
export const SCHEDULE_ROUTES = {
  // Get schedule by specific client, agent, and scan type
  // Used in: src/app/(dashboard)/schedule-setup/page.tsx
  byClientAndAgent: (clientId: number, agentId: number, typeOfScan: string) =>
    `/schedules/client/${clientId}/agent/${agentId}/type/${typeOfScan}/`,
};
```

## Adding New Routes

When adding a new endpoint:

1. **Define the route** in [src/config/api-routes.ts](../src/config/api-routes.ts):
   ```typescript
   export const MY_FEATURE_ROUTES = {
     list: "/my-feature/",
     detail: (id: number) => `/my-feature/${id}/`,
     create: "/my-feature/",
   } as const;
   ```

2. **Add type definitions** in [src/config/api-routes.ts](../src/config/api-routes.ts):
   ```typescript
   export type MyFeatureRoute = typeof MY_FEATURE_ROUTES[keyof typeof MY_FEATURE_ROUTES];
   ```

3. **Use in UnifiedAPIService**:
   ```typescript
   import { MY_FEATURE_ROUTES } from "@/config/api-routes";
   
   export const UnifiedAPIService = {
     myFeature: {
       getAll: () => api.get(MY_FEATURE_ROUTES.list),
     },
   };
   ```

4. **Use in components**:
   ```typescript
   import { UnifiedAPIService } from "@/services";
   
   const data = await UnifiedAPIService.myFeature.getAll();
   ```

## Comparison with Django's urls.py

### Django Backend
```python
# backend/urls.py
urlpatterns = [
    path("auth/login/", AuthLoginView.as_view(), name="auth-login"),
    path("auth/logout/", AuthLogoutView.as_view(), name="auth-logout"),
    path("application-configs/", AppConfigListView.as_view(), name="app-list"),
    path("application-configs/<int:pk>/", AppConfigDetailView.as_view(), name="app-detail"),
]
```

### Frontend Equivalent
```typescript
// src/config/api-routes.ts
export const AUTH_ROUTES = {
  login: "/auth/login/",
  logout: "/auth/logout/",
};

export const APPLICATION_ROUTES = {
  list: "/application-configs/",
  detail: (id: number) => `/application-configs/${id}/`,
};
```

Both patterns provide:
- ✅ Single source of truth
- ✅ Easy refactoring
- ✅ Clear API definitions
- ✅ Organizational clarity

## Testing

Routes can be validated using the helper function:

```typescript
import { validateRoute, getAllRoutes } from "@/config/api-routes";

// Check if a route exists
console.log(validateRoute("/auth/login/")); // true
console.log(validateRoute("/invalid/")); // false

// Get all routes for test fixtures
const allRoutes = getAllRoutes();
```

## See Also

- [Unified API Service](./API_MIGRATION_GUIDE.md) - Complete service consolidation guide
- [src/config/api-routes.ts](../src/config/api-routes.ts) - Full routes configuration
- [src/services/unified-api.service.ts](../src/services/unified-api.service.ts) - Service using these routes
