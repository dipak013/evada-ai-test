# Unified API Service Migration Guide

## Overview

All API calls have been consolidated into a single, well-organized service file: `src/services/unified-api.service.ts`. This provides:

- **Centralized API management** - All endpoints in one place
- **Type safety** - Comprehensive TypeScript interfaces
- **Consistency** - Uniform pattern across all calls
- **Maintainability** - Easier to update and debug
- **Backward compatibility** - Old service imports still work via `src/services/index.ts`

## Quick Start

### Option 1: Use the Unified Service (Recommended)

```typescript
import { UnifiedAPIService } from "@/services/unified-api.service";

// Authentication
await UnifiedAPIService.auth.login({ email, password });
await UnifiedAPIService.auth.logout();
await UnifiedAPIService.auth.me();

// Applications
await UnifiedAPIService.applications.getAll();
await UnifiedAPIService.applications.create(config);
await UnifiedAPIService.applications.update(id, config);
await UnifiedAPIService.applications.toggleStatus(id, isActive);

// Scanning
await UnifiedAPIService.scan.startScan({ app_uuid });
await UnifiedAPIService.scan.uploadFile(file, appId);
await UnifiedAPIService.scan.getScanHistory(query);
await UnifiedAPIService.scan.getLatestScan(appUuid);

// Scheduling
await UnifiedAPIService.schedule.getAll();
await UnifiedAPIService.schedule.create(scheduleData);
await UnifiedAPIService.schedule.getByApplication(appId);
await UnifiedAPIService.schedule.update(scheduleId, data);
await UnifiedAPIService.schedule.toggleStatus(scheduleId, isActive);
await UnifiedAPIService.schedule.delete(scheduleId);

// Dashboard
await UnifiedAPIService.dashboard.getAlerts(query);
await UnifiedAPIService.dashboard.getSentinelStats(query);
await UnifiedAPIService.dashboard.getPastScanStats(query);
await UnifiedAPIService.dashboard.getCVERemediation(query);

// Agents
await UnifiedAPIService.agent.upload(file, os);
await UnifiedAPIService.agent.download(os);

// Sidebar
await UnifiedAPIService.sidebar.getClients();

// Network Scan
await UnifiedAPIService.networkScan.scan(payload);
```

### Option 2: Use Backward Compatible Imports (During Migration)

Old imports still work through compatibility shims:

```typescript
// These still work and are automatically forwarded to UnifiedAPIService
import { AuthService, ScanService, ScheduleService } from "@/services";

await AuthService.login/me/logout();
await ScanService.startScan();
await ScheduleService.upsertSchedule();
```

## Service Organization

The Unified API Service is organized into logical domains:

```typescript
UnifiedAPIService.{
  auth,              // Authentication: login, logout, me, oauth
  applications,      // App config: CRUD operations
  scan,             // Scanning: start, upload, history, latest
  networkScan,      // Network scanning
  schedule,         // Schedule management: CRUD, status, queries
  dashboard,        // Dashboards: alerts, stats, remediation
  agent,            // Agent management: upload, download
  sidebar,          // Sidebar data: clients
}
```

## Full API Endpoint Matrix

| Domain | Method | Endpoint | Service Function |
|--------|--------|----------|------------------|
| **Auth** | POST | `/auth/login/` | `auth.login(credentials)` |
| | GET | `/auth/me/` | `auth.me()` |
| | POST | `/auth/logout/` | `auth.logout()` |
| | POST | `/oauth/exchange/` | `auth.oauthExchange(data)` |
| **Apps** | GET | `/application-configs/` | `applications.getAll()` |
| | POST | `/configure-new-app/` | `applications.create(config)` |
| | PUT | `/application-configs/{id}/` | `applications.update(id, config)` |
| | PATCH | `/application-configs/{id}/toggle-status/` | `applications.toggleStatus(id, isActive)` |
| | DELETE | `/application-configs/{id}/delete/` | `applications.delete(id)` |
| **Scan** | POST | `/scan/` | `scan.startScan(payload)` |
| | POST | `/upload/` | `scan.uploadFile(file, appId)` |
| | GET | `/scan-history/` | `scan.getScanHistory(query)` |
| | GET | `/applications/{uuid}/latest-scan/` | `scan.getLatestScan(uuid)` |
| **Network** | POST | `/scan-network` | `networkScan.scan(payload)` |
| **Schedule** | GET | `/schedules/` | `schedule.getAll()` |
| | POST | `/schedules/` | `schedule.create(data)` |
| | GET | `/schedules/application/{id}/` | `schedule.getByApplication(id)` |
| | PUT | `/schedules/{id}/` | `schedule.update(id, data)` |
| | PATCH | `/schedules/{id}/` | `schedule.toggleStatus(id, isActive)` |
| | DELETE | `/schedules/{id}/` | `schedule.delete(id)` |
| | GET | `/schedules/client/{cid}/agent/{aid}/type/{type}/` | `schedule.getByClientAgentAndType(...)` |
| **Dashboard** | GET | `/dashboard-alerts/` | `dashboard.getAlerts(query)` |
| | GET | `/sentinel-stats/` | `dashboard.getSentinelStats(query)` |
| | GET | `/past-scan-stats/` | `dashboard.getPastScanStats(query)` |
| | GET | `/cve-remediation/` | `dashboard.getCVERemediation(query)` |
| **Agent** | POST | `/agent-upload/{os}/` | `agent.upload(file, os)` |
| | GET | `/agent-download/{os}/` | `agent.download(os)` |
| **Sidebar** | GET | `/clients/sidebar/` | `sidebar.getClients()` |

## Migration Examples

### Before (Scattered across multiple services and files)
```typescript
// From multiple files...
import { AuthService } from "@/services/auth.service";
import { ScanService } from "@/services/scan.service";
import { ScheduleService } from "@/services/schedule.service";

const logout = () => await fetch(`${BASE_URL}/api/auth/logout/`, {...});
const scan = () => await api.post("/scan/", payload);
const schedule = () => await api.post("/schedules/", data);
```

### After (Centralized and consistent)
```typescript
// One import for everything
import { UnifiedAPIService } from "@/services/unified-api.service";

const logout = () => UnifiedAPIService.auth.logout();
const scan = () => UnifiedAPIService.scan.startScan(payload);
const schedule = () => UnifiedAPIService.schedule.create(data);
```

## TypeScript Support

Full type safety with proper interfaces:

```typescript
import { UnifiedAPIService, LoginRequest, ApplicationConfig, ScheduleData } from "@/services/unified-api.service";

// Properly typed
const loginRequest: LoginRequest = { email: "...", password: "..." };
await UnifiedAPIService.auth.login(loginRequest);

const config: ApplicationConfig = { ... };
await UnifiedAPIService.applications.update(1, config);

const schedule: ScheduleData = { schedule_type: "once", ... };
await UnifiedAPIService.schedule.create(schedule);
```

## Using in Components

### React Component Example
```typescript
"use client";
import { useState } from "react";
import { UnifiedAPIService } from "@/services/unified-api.service";

export default function MyComponent() {
  const [apps, setApps] = useState([]);

  const loadApplications = async () => {
    try {
      const response = await UnifiedAPIService.applications.getAll();
      setApps(response.data.configurations);
    } catch (error) {
      console.error("Failed to load apps:", error);
    }
  };

  return (
    <button onClick={loadApplications}>Load Apps</button>
  );
}
```

### React Query Integration
```typescript
import { useQuery } from "@tanstack/react-query";
import { UnifiedAPIService } from "@/services/unified-api.service";

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: () => UnifiedAPIService.applications.getAll(),
  });
}
```

## Error Handling

```typescript
try {
  await UnifiedAPIService.applications.getAll();
} catch (error: any) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 404) {
    // Handle not found
  } else {
    // Handle other errors
  }
}
```

## Benefits

✅ **Single source of truth** - All API calls in one file  
✅ **Easier maintenance** - Update endpoints in one place  
✅ **Better discoverability** - See all available endpoints  
✅ **Type safety** - Full TypeScript support  
✅ **Consistency** - Uniform patterns across all services  
✅ **Backward compatible** - Existing code still works  
✅ **Well organized** - Grouped by domain/feature  

## Files Updated

- ✅ Created: `src/services/unified-api.service.ts` - Unified service
- ✅ Created: `src/services/index.ts` - Backward compatibility exports
- ✅ Updated: `src/lib/axios.ts` - Base URL includes `/api` prefix
- ✅ Updated: All API endpoints to use `/api/` prefix pattern

## Migration Path

**Phase 1 (Current):** 
- Unified service created
- Backward compatibility layer in place
- Existing code continues to work

**Phase 2 (Gradual):**
- Update files as you work on them
- Use `UnifiedAPIService` in new code
- Old imports still work (just deprecated)

**Phase 3 (Future):**
- Remove old service files
- Remove backward compatibility layer
- All code using unified service

## Questions?

Refer to `src/services/unified-api.service.ts` for complete endpoint definitions and types.
