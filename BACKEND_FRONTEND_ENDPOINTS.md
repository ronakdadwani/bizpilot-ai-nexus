# Backend & Frontend API Endpoints Analysis

**Date:** January 8, 2026  
**Backend URL:** https://biz-pilot-ai.onrender.com

---

## Summary

| Category | Count | Status |
|----------|-------|--------|
| **Frontend API Methods** | 12 | ✅ All defined |
| **Working Endpoints** | 3 | ✅ Confirmed |
| **Missing Endpoints** | 6 | ❌ Need implementation |
| **Uncertain Endpoints** | 3 | ⚠️ Need verification |

---

## All Frontend API Methods (in src/lib/api.ts)

### Authentication & User (3 methods)
1. ✅ **`login(email, password)`**
   - Endpoint: `POST /login`
   - Returns: `LoginResponse` (token + user data)
   - Status: **WORKING** ✅

2. ✅ **`signup(name, email, password)`**
   - Endpoint: `POST /signup`
   - Returns: `SignupResponse` (token + user data)
   - Status: **WORKING** ✅

3. ✅ **`logout()`**
   - Endpoint: Clears localStorage
   - Returns: `void`
   - Status: **WORKING** ✅

4. ⚠️ **`getMe()`**
   - Endpoint: `GET /me`
   - Returns: `User` (id, email, name)
   - Status: **UNCERTAIN** - May need verification

---

### Data & Analytics (6 methods)
5. ⚠️ **`getAnalytics()`**
   - Endpoint: `GET /analytics`
   - Returns: `AnalyticsData`
   - Fields: totalSales, conversionRate, avgOrderValue, customerRetention, salesTrend, categoryBreakdown
   - Status: **UNCERTAIN** - Has mock fallback
   - Fallback: If 401/404 → returns mock data

6. ⚠️ **`getForecast(period?)`**
   - Endpoint: `POST /forecast`
   - Params: `period` (optional)
   - Returns: `ForecastData`
   - Fields: revenuePrediction, confidenceScore, peakPeriod, forecastData
   - Status: **UNCERTAIN** - Has mock fallback
   - Fallback: If 401/404 → returns mock data

7. ✅ **`uploadSalesData(file)`**
   - Endpoint: `POST /upload-sales-data`
   - Params: File (multipart)
   - Returns: `UploadResponse`
   - Status: **WORKING** ✅

8. ⚠️ **`getFiles()`**
   - Endpoint: `GET /files`
   - Returns: `FileItem[]`
   - Fields: id, name, type, size, uploadedAt
   - Status: **UNCERTAIN** - Has mock fallback
   - Fallback: If 401/404 → returns mock data

---

### Reports & Insights (4 methods)
9. ❌ **`getReports()`**
   - Endpoint: `GET /reports`
   - Returns: `Report[]`
   - Fields: id, title, type, date, status
   - Status: **MISSING** ❌
   - Using: Mock data (5 sample reports)

10. ❌ **`sendChatMessage(message)`**
    - Endpoint: `POST /llm`
    - Params: `{ message: string }`
    - Returns: `ChatResponse`
    - Fields: response, message
    - Status: **MISSING** ❌
    - Using: Intelligent mock responses

11. ❌ **`getCustomers()`**
    - Endpoint: `GET /customers`
    - Returns: `CustomerData`
    - Fields: customers[], stats (total, active, newThisMonth, avgOrderValue)
    - Status: **MISSING** ❌
    - Using: Mock data (5 sample customers)

12. ❌ **`getAlerts()`**
    - Endpoint: `GET /alerts`
    - Returns: `AlertItem[]`
    - Fields: id, type, title, message, timestamp, read
    - Status: **MISSING** ❌
    - Using: Mock data (5 sample alerts)

---

## Endpoints NOT YET in Frontend (Potential Future Use)

These endpoints might be available on backend but not yet implemented in frontend:

- `GET /dashboard` - Dashboard metrics endpoint
- `POST /market-research` - Market research endpoint
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer
- `PUT /reports/:id` - Update report
- `DELETE /reports/:id` - Delete report
- `PUT /alerts/:id` - Update alert
- `GET /health` - Health check endpoint

---

## Backend Endpoints Status

### ✅ WORKING / CONFIRMED
1. `POST /login` - ✅ Working
2. `POST /signup` - ✅ Working
3. `POST /upload-sales-data` - ✅ Working

### ⚠️ UNCERTAIN (May exist or need verification)
1. `GET /me` - User profile
2. `GET /analytics` - Analytics data
3. `POST /forecast` - Forecast data
4. `GET /files` - Files list
5. `POST /market-research` - Market research
6. `GET /dashboard` - Dashboard data
7. `GET /health` - Health check

### ❌ MISSING (Need to implement in backend)
1. `GET /reports` - Reports list
2. `POST /llm` - AI Chat messages
3. `GET /customers` - Customers list
4. `GET /alerts` - Alerts list

---

## What Needs to be Added to Backend

### Priority 1: Critical (Being Used)
```
1. GET /reports
   Response: {
     data: [
       {
         id: string,
         title: string,
         type: string,
         date: string,
         status: "Completed" | "In Progress" | "Scheduled"
       }
     ]
   }

2. POST /llm
   Request: { message: string }
   Response: {
     data: {
       response: string,
       message: string
     }
   }

3. GET /customers
   Response: {
     data: {
       customers: [
         {
           id: string,
           name: string,
           email: string,
           phone?: string,
           status: "active" | "inactive" | "pending",
           totalSpent?: number,
           lastOrder?: string
         }
       ],
       stats: {
         total: number,
         active: number,
         newThisMonth: number,
         avgOrderValue: number
       }
     }
   }

4. GET /alerts
   Response: {
     data: [
       {
         id: string,
         type: string,
         title: string,
         message: string,
         timestamp: string,
         read?: boolean
       }
     ]
   }
```

### Priority 2: Important (May be needed)
```
5. GET /me
   Response: {
     data: {
       id: string,
       email: string,
       name: string
     }
   }

6. GET /analytics
   Response: {
     data: {
       totalSales: number,
       conversionRate: number,
       avgOrderValue: number,
       customerRetention: number,
       salesTrend: [{date: string, value: number}],
       categoryBreakdown: [{name: string, value: number}]
     }
   }

7. POST /forecast
   Request: { period?: string }
   Response: {
     data: {
       revenuePrediction: number,
       confidenceScore: number,
       peakPeriod: string,
       forecastData: [{
         date: string,
         predicted: number,
         actual?: number
       }]
     }
   }
```

### Priority 3: Nice to Have
```
8. GET /dashboard
   Response: Dashboard metrics and data
   
9. POST /market-research
   Request: Research query parameters
   Response: Market research data
```

---

## Request/Response Methods

### Authentication Headers
All endpoints except `/login` and `/signup` require:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Status Codes to Handle
- `200` - Success
- `400` - Bad request
- `401` - Unauthorized (missing/invalid token)
- `404` - Endpoint not found
- `500` - Server error

---

## Frontend Implementation Pattern

```typescript
async getReports(): Promise<ApiResponse<Report[]>> {
  const result = await this.get<Report[]>("/reports");
  
  // If endpoint not available, return mock data
  if (result.error) {
    const mockReports: Report[] = [...];
    return { data: mockReports };
  }
  
  return result;
}
```

**How it works:**
1. Try to fetch from backend
2. If error (401/404) → use mock data
3. If success → use real data
4. User always sees data (no errors)

---

## Summary & Recommendations

### Current Status
- **3 endpoints working** (Login, Signup, Upload)
- **6 endpoints using mock data** with automatic fallback
- **Excellent user experience** - No errors shown to users

### To Enable Real Data

**Option 1: Immediate Implementation**
Add these 4 endpoints to backend:
- `GET /reports`
- `POST /llm` (AI Chat)
- `GET /customers`
- `GET /alerts`

**Option 2: Phased Approach**
1. Phase 1: Implement `/reports` and `/customers` (most used)
2. Phase 2: Implement `/llm` (AI Chat) and `/alerts`
3. Phase 3: Verify `/analytics`, `/forecast`, `/me`, `/files`

### No Frontend Changes Needed
When backend endpoints are ready, frontend will automatically use real data without any code changes!

---

## Testing Backend Endpoints

To test if an endpoint is working:

```bash
# Test with authentication
curl -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     https://biz-pilot-ai.onrender.com/reports

# Test without authentication (will fail with 401)
curl https://biz-pilot-ai.onrender.com/reports
```

---

**Last Updated:** January 8, 2026  
**Frontend Status:** ✅ Ready for real data  
**Backend Status:** ⚠️ Partial (3/10 endpoints confirmed)
