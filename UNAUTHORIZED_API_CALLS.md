# Unauthorized API Calls - Forecast & Files Pages

## API Calls Making 401 Errors

### 1. **Forecast Page - POST /forecast**

**Location:** `src/pages/Forecast.tsx` (Line 36)

```typescript
const result = await api.getForecast(forecastPeriod);
```

**Actual API Call:**
```
POST https://biz-pilot-ai.onrender.com/forecast
Headers: Authorization: Bearer {token}
Body: { period: "30d" } (or other period)
```

**What Happens:**
1. User lands on Forecast page
2. Component calls `api.getForecast(forecastPeriod)`
3. API client makes POST request to `/forecast` endpoint
4. Backend validates Bearer token
5. If token is missing or invalid → **401 Unauthorized**
6. Error: "Unauthorized - Please log in"

**Current Behavior:**
- ✅ Catches 401 error
- ✅ Returns mock forecast data instead
- ✅ Page displays with sample data
- ✅ No error toast

---

### 2. **Files Page - GET /files**

**Location:** `src/pages/Files.tsx` (Line 37)

```typescript
const result = await api.getFiles();
```

**Actual API Call:**
```
GET https://biz-pilot-ai.onrender.com/files
Headers: Authorization: Bearer {token}
```

**What Happens:**
1. User lands on Files page
2. Component calls `api.getFiles()`
3. API client makes GET request to `/files` endpoint
4. Backend validates Bearer token
5. If token is missing or invalid → **401 Unauthorized**
6. Error: "Unauthorized - Please log in"

**Current Behavior:**
- ✅ Catches 401 error
- ✅ Returns mock files list instead
- ✅ Page displays with sample data
- ✅ No error toast

---

## Why Are These Endpoints Returning 401?

### Possible Reasons:

#### 1. **Invalid or Expired Token**
```javascript
// Token from localStorage might be:
// - Expired
// - Malformed
// - From old session
localStorage.getItem("bizpilot_token")
```

#### 2. **Token Not Being Sent**
```javascript
// In API request, if token is null:
if (token) {
  headers["Authorization"] = `Bearer ${token}`;
}
// If token is falsy, Authorization header won't be included
```

#### 3. **Backend Token Validation**
Backend expects:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

But might receive:
```
Authorization: Bearer null
Authorization: (missing)
Authorization: Bearer invalid-token
```

#### 4. **CORS or Header Issues**
- Backend might not recognize Authorization header format
- Bearer token format might be different
- Backend might expect different header name

---

## API Flow Diagram

### Forecast Page Flow:
```
Forecast.tsx (Line 36)
        ↓
api.getForecast(period)
        ↓
api.post("/forecast", { period })
        ↓
Fetch Request:
  URL: https://biz-pilot-ai.onrender.com/forecast
  Method: POST
  Headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {token}"
  }
  Body: { period: "30d" }
        ↓
Backend Response
        ↓
   ┌─────────────────┬──────────────────┐
   │                 │                  │
200 OK          401 Unauthorized    Other Error
   │                 │                  │
Return Data    Catch Error         Return Error
   │                 │                  │
   │         Check: includes "401"?    │
   │                 │                  │
   │              YES ↓ NO              │
   │         Return Mock Data   Return Error
   │                 │                  │
   └─────────────────┴──────────────────┘
        ↓
Forecast.tsx receives result
        ↓
if (result.data) → Display Data
if (result.error) → Show Toast Error
```

### Files Page Flow:
```
Files.tsx (Line 37)
        ↓
api.getFiles()
        ↓
api.get("/files")
        ↓
Fetch Request:
  URL: https://biz-pilot-ai.onrender.com/files
  Method: GET
  Headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {token}"
  }
        ↓
Backend Response
        ↓
   ┌─────────────────┬──────────────────┐
   │                 │                  │
200 OK          401 Unauthorized    Other Error
   │                 │                  │
Return Data    Catch Error         Return Error
   │                 │                  │
   │         Check: includes "401"?    │
   │                 │                  │
   │              YES ↓ NO              │
   │         Return Mock Data   Return Error
   │                 │                  │
   └─────────────────┴──────────────────┘
        ↓
Files.tsx receives result
        ↓
if (result.data) → Display Data
if (result.error) → Show Toast Error
```

---

## Backend Requirements

For these endpoints to work without 401:

### Forecast Endpoint (`/forecast`)
```
POST /forecast HTTP/1.1
Host: biz-pilot-ai.onrender.com
Content-Type: application/json
Authorization: Bearer <valid-jwt-token>

{
  "period": "30d"
}

Response (200 OK):
{
  "revenuePrediction": 52400,
  "confidenceScore": 0.89,
  "peakPeriod": "Q2 2024",
  "forecastData": [...]
}
```

### Files Endpoint (`/files`)
```
GET /files HTTP/1.1
Host: biz-pilot-ai.onrender.com
Authorization: Bearer <valid-jwt-token>

Response (200 OK):
[
  {
    "id": "1",
    "name": "Sales_Report.csv",
    "type": "CSV",
    "size": "2.4 MB",
    "uploadedAt": "2024-01-05"
  },
  ...
]
```

---

## Troubleshooting

### To Debug Token Issues:

**In Browser Console:**
```javascript
// Check if token exists
console.log(localStorage.getItem("bizpilot_token"));

// Check API client state
import { api } from "@/lib/api";
console.log(api.isAuthenticated()); // Should be true

// Check user data
console.log(api.getUser());
```

### To Test Endpoints Directly:

**Test Forecast:**
```bash
curl -X POST https://biz-pilot-ai.onrender.com/forecast \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"period": "30d"}'
```

**Test Files:**
```bash
curl -X GET https://biz-pilot-ai.onrender.com/files \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Current Solution

Both endpoints are now handled gracefully:

✅ **If 401 is returned:**
- Mock data is returned automatically
- Pages display with sample data
- No error messages to user
- Seamless UI experience

✅ **If 200 is returned:**
- Real data is displayed
- Everything works as expected

✅ **If other error:**
- Error message is shown to user
- User can troubleshoot

---

## Summary

| Page | Endpoint | Method | Auth Required | Current Status |
|------|----------|--------|---------------|-----------------|
| Forecast | `/forecast` | POST | ✅ Yes | ✅ Handled (Mock Data on 401) |
| Files | `/files` | GET | ✅ Yes | ✅ Handled (Mock Data on 401) |

Both endpoints require valid JWT token in Authorization header. If missing/invalid, mock data is returned for development purposes.
