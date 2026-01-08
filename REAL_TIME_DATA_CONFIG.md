# Real-Time Data Configuration

## Status: ✅ ENABLED

All pages are now configured to use **REAL-TIME DATA** from the backend. Mock data fallbacks have been completely removed.

## Backend Connection

**API Base URL:** `https://biz-pilot-ai.onrender.com`
**Authentication:** JWT Bearer Token (stored in localStorage)
**Data Refresh:** Real-time (on demand)

---

## Real-Time Data Endpoints

### 1. **Analytics** (`/analytics`) ✅
- **Description:** Real-time sales metrics, trends, and KPIs
- **Pages Using:** Analytics Dashboard
- **Data Fields:**
  - totalSales (current sales total)
  - conversionRate (percentage)
  - avgOrderValue (average order value)
  - customerRetention (retention percentage)
  - salesTrend (historical trend data)
  - categoryBreakdown (sales by category)

### 2. **Forecast** (`/forecast`) ✅
- **Description:** Real-time revenue predictions and trends
- **Pages Using:** AI Forecast Page
- **Data Fields:**
  - revenuePrediction (predicted revenue)
  - confidenceScore (confidence level)
  - peakPeriod (predicted peak period)
  - forecastData (forecasted data points)

### 3. **Customers** (`/customers`) ✅
- **Description:** Real-time customer data and statistics
- **Pages Using:** Customers Page
- **Data Fields:**
  - totalCustomers (total count)
  - activeCustomers (active count)
  - customers[] (list of customers)
  - stats (customer statistics)

### 4. **Files** (`/files`) ✅
- **Description:** Real-time uploaded files and documents
- **Pages Using:** Files Page, Upload Data Page
- **Data Fields:**
  - id (file identifier)
  - name (file name)
  - type (file type: CSV, Excel, PDF)
  - size (file size)
  - uploadedAt (upload date)

### 5. **Reports** (`/reports`) ✅
- **Description:** Real-time generated reports and analytics
- **Pages Using:** Reports Page
- **Data Fields:**
  - id (report identifier)
  - title (report title)
  - type (report type)
  - date (report date)
  - status (report status)

### 6. **Alerts** (`/alerts`) ✅
- **Description:** Real-time system alerts and notifications
- **Pages Using:** Alerts Page, Dashboard
- **Data Fields:**
  - id (alert identifier)
  - title (alert title)
  - description (alert description)
  - severity (success, warning, error, info)
  - timestamp (alert time)

### 7. **AI Chat** (`/llm`) ✅
- **Description:** Real-time AI chat responses
- **Pages Using:** AI Chat Page
- **Data Fields:**
  - response (AI response text)
  - message (message content)

### 8. **Market Research** (`/market-research`) ✅
- **Description:** Real-time market research data
- **Pages Using:** Market Research Page
- **Data Fields:** Varies based on research query

### 9. **Dashboard** (`/dashboard`) ✅
- **Description:** Real-time dashboard metrics
- **Pages Using:** Dashboard Page
- **Data Fields:**
  - kpiMetrics (KPI cards)
  - revenueData (revenue chart)
  - topProducts (top products)
  - recentAlerts (recent alerts)

### 10. **User Profile** (`/me`) ✅
- **Description:** Current user information
- **Pages Using:** Settings, Profile
- **Data Fields:**
  - id (user ID)
  - email (user email)
  - name (user name)

---

## Pages Configuration

| Page | Endpoint | Status | Real-Time |
|------|----------|--------|-----------|
| Dashboard | `/dashboard` | ✅ | Yes |
| Analytics | `/analytics` | ✅ | Yes |
| Forecast | `/forecast` | ✅ | Yes |
| Customers | `/customers` | ✅ | Yes |
| Files | `/files` | ✅ | Yes |
| Reports | `/reports` | ✅ | Yes |
| Alerts | `/alerts` | ✅ | Yes |
| AI Chat | `/llm` | ✅ | Yes |
| Market Research | `/market-research` | ✅ | Yes |
| Upload Data | `/upload-sales-data` | ✅ | Yes |
| Settings | `/me` | ✅ | Yes |
| Help | Static | ✅ | N/A |

---

## Authentication Flow

1. **Login/Signup** → Generate JWT token
2. **Store Token** → localStorage as `bizpilot_token`
3. **API Requests** → Include Bearer token in headers
4. **Authorization** → Backend validates token
5. **Real-Time Data** → Backend returns live data

---

## Error Handling

If the backend returns errors:

```
Status 401 (Unauthorized) → User must log in again
Status 404 (Not Found) → Endpoint not available
Status 500 (Server Error) → Server-side issue
```

Users will see appropriate error messages through the toast notifications system.

---

## Testing Real-Time Data

Run the API dashboard to verify all endpoints are working:

```bash
node api-dashboard.js
```

Expected output:
- ✅ Server Reachable
- ✅ Health Check Passed
- ✅ API Endpoints Configured
- ✅ Auth System Ready
- ✅ Data Endpoints Available

---

## Performance Notes

- All data is fetched on-demand (no continuous polling)
- Authorization tokens are automatically included in all requests
- Network errors are handled gracefully with user-friendly messages
- No caching layer (always fresh data from backend)

---

## Configuration Files Modified

- `src/lib/api.ts` - Removed all mock data fallbacks
- `src/pages/Analytics.tsx` - Now uses real API data only
- `src/pages/Forecast.tsx` - Now uses real API data only
- `src/pages/Customers.tsx` - Now uses real API data only
- `src/pages/Files.tsx` - Now uses real API data only
- `src/pages/Reports.tsx` - Now uses real API data only
- `src/pages/Alerts.tsx` - Now uses real API data only
- `src/pages/AIChat.tsx` - Now uses real API data only
- `src/pages/Dashboard.tsx` - Now uses real API data only

---

## Next Steps

1. ✅ Verified backend is online and responding
2. ✅ Removed all mock data implementations
3. ✅ Configured real-time data for all endpoints
4. 🔄 **Currently:** All pages fetch real data from backend
5. 📊 Monitor data flow and user interactions
6. 🔧 Optimize endpoints as needed

---

## Troubleshooting

**Issue:** Pages show error messages
- **Cause:** Backend endpoint is down or returning errors
- **Solution:** Check backend logs, verify token is valid

**Issue:** No data displayed
- **Cause:** Slow network or server response
- **Solution:** Check network tab in browser DevTools

**Issue:** 401 Unauthorized error
- **Cause:** Invalid or expired token
- **Solution:** Log out and log back in

---

**Last Updated:** January 8, 2026
**Backend Status:** ✅ Connected and Operational
