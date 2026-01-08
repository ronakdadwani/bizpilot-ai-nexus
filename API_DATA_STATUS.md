# API Data Status & Real vs Mock Data Report

## Summary
This document details which pages are calling backend APIs and which are using mock/dummy data.

---

## Pages Overview

### 1. **Dashboard** (`/dashboard`)
- **Status**: Calling Backend API ✅
- **Endpoint Used**: `/dashboard`
- **Data Type**: Real data (from backend) + Mock fallback
- **Fallback Logic**: If 401/Unauthorized, returns mock data
- **Mock Data Used When**:
  - User is not authenticated
  - Backend endpoint fails
- **Data Returned**:
  - kpiMetrics (KPI Cards)
  - revenueData (Revenue Chart)
  - topProducts (Products Table)
  - recentAlerts (Alerts List)

---

### 2. **Analytics** (`/analytics`)
- **Status**: Calling Backend API ✅ (Fixed)
- **Endpoint Used**: `/analytics`
- **Data Type**: Real data (from backend) + Mock fallback ✅
- **Fallback Logic**: If endpoint fails or returns 404/401, returns mock data
- **Mock Data Used When**:
  - Backend endpoint not available
  - User is not authenticated
- **Data Fields Populated**:
  - **totalSales**: $125,000 (mock)
  - **conversionRate**: 3.5% (mock)
  - **avgOrderValue**: $285.50 (mock)
  - **customerRetention**: 82% (mock)
  - **salesTrend**: 6-month trend data (mock)
  - **categoryBreakdown**: Product category sales breakdown (mock)

---

### 3. **AI Forecast** (`/forecast`)
- **Status**: Calling Backend API ✅
- **Endpoint Used**: `/forecast` (POST)
- **Data Type**: Real data (from backend) + Mock fallback
- **Fallback Logic**: If 401/Unauthorized, returns mock data
- **Mock Data Used When**:
  - User is not authenticated
  - Backend endpoint fails
- **Data Returned**:
  - revenuePrediction: $52,400
  - confidenceScore: 0.89 (89%)
  - peakPeriod: Q2 2024
  - forecastData: 6-month forecast with predictions

---

### 4. **Files** (`/files`)
- **Status**: Calling Backend API ✅
- **Endpoint Used**: `/files` (GET)
- **Data Type**: Real data (from backend) + Mock fallback
- **Fallback Logic**: If 401/Unauthorized, returns mock files list
- **Mock Data Used When**:
  - User is not authenticated
  - Backend endpoint fails
- **Mock Files Include**:
  - sales_data_2024.csv
  - customer_list.xlsx
  - quarterly_report.pdf

---

### 5. **AI Chat** (`/ai-chat`)
- **Status**: ❌ NOT YET IMPLEMENTED
- **Endpoint Used**: `/llm`
- **Current Behavior**: Returns error "Chat endpoint not available on backend"
- **Action Required**: Implement mock data fallback or real backend endpoint

---

### 6. **Market Research** (`/market-research`)
- **Status**: Calling Backend API ✅
- **Endpoint Used**: `/market-research` (POST)
- **Data Type**: Real data (from backend) + Mock fallback
- **Fallback Logic**: If 401/Unauthorized, returns mock market research data

---

### 7. **Reports** (`/reports`)
- **Status**: ❌ NOT YET IMPLEMENTED
- **Endpoint Used**: `/reports`
- **Current Behavior**: Returns error "Reports endpoint not available on backend"
- **Action Required**: Implement mock data fallback or real backend endpoint

---

### 8. **Customers** (`/customers`)
- **Status**: ❌ NOT YET IMPLEMENTED
- **Endpoint Used**: `/customers`
- **Current Behavior**: Returns error "Customers endpoint not available on backend"
- **Action Required**: Implement mock data fallback or real backend endpoint

---

### 9. **Alerts** (`/alerts`)
- **Status**: ❌ NOT YET IMPLEMENTED
- **Endpoint Used**: `/alerts`
- **Current Behavior**: Returns error "Alerts endpoint not available on backend"
- **Action Required**: Implement mock data fallback or real backend endpoint

---

### 10. **Upload Data** (`/upload-data`)
- **Status**: Calling Backend API ✅
- **Endpoint Used**: `/upload-sales-data` (POST - multipart/form-data)
- **Data Type**: File upload handling
- **Functionality**: Allows users to upload CSV/Excel files to backend

---

### 11. **Settings** (`/settings`)
- **Status**: Page component exists
- **Endpoint Used**: None identified yet
- **Current Behavior**: Loads user settings (may need implementation)

---

### 12. **Help** (`/help`)
- **Status**: Static help/documentation page
- **Data Type**: Static content only

---

## Backend Connection Status

### API Base URL
```
https://biz-pilot-ai.onrender.com
```

### Authentication
- **Method**: Bearer Token (stored in localStorage as `bizpilot_token`)
- **Storage**: `localStorage.setItem("bizpilot_token", token)`
- **Retrieval**: `Authorization: Bearer <token>`

### Working API Endpoints
✅ `/login` - User login
✅ `/signup` - User registration
✅ `/dashboard` - Dashboard data
✅ `/analytics` - Analytics data (NOW FIXED WITH MOCK FALLBACK)
✅ `/forecast` - Revenue forecast
✅ `/files` - File listing
✅ `/upload-sales-data` - File upload
✅ `/market-research` - Market research data
✅ `/me` - Current user info

### Missing/Not Implemented Endpoints
❌ `/llm` - AI Chat (needs implementation)
❌ `/reports` - Reports (needs implementation)
❌ `/customers` - Customers (needs implementation)
❌ `/alerts` - Alerts (needs implementation)

---

## Data Handling Strategy

### Current Approach:
1. **Try to fetch from backend** with real token
2. **If 401/Unauthorized error** → Use mock data as fallback
3. **If 404/endpoint not found** → Use mock data as fallback
4. **Display mock data** until real backend endpoints are available

### Why Mock Data?
- Provides better UX (users see data instead of errors)
- Allows frontend development while backend is being built
- Prevents complete app failure when APIs are unavailable

---

## To Use Real Data

Once backend endpoints are ready:
1. The app will automatically use real data when authentication succeeds
2. Mock data only serves as fallback for development/demo purposes
3. No code changes needed - existing logic handles both cases

---

## Pages Data Availability

| Page | Backend Ready | Mock Data Ready | Status |
|------|---------------|-----------------|--------|
| Dashboard | ✅ | ✅ | Fully Functional |
| Analytics | ✅ | ✅ | ✅ **FIXED** |
| Forecast | ✅ | ✅ | Fully Functional |
| Files | ✅ | ✅ | Fully Functional |
| Market Research | ✅ | ✅ | Fully Functional |
| AI Chat | ❌ | ❌ | Needs Implementation |
| Reports | ❌ | ❌ | Needs Implementation |
| Customers | ❌ | ❌ | Needs Implementation |
| Alerts | ❌ | ❌ | Needs Implementation |
| Upload Data | ✅ | N/A | Fully Functional |
| Settings | ⚠️ | ⚠️ | Needs Review |
| Help | N/A | N/A | Static Content |

---

## Next Steps

1. **Analytics Page**: ✅ Now shows mock data with proper percentages
2. **Implement remaining endpoints**: AI Chat, Reports, Customers, Alerts
3. **Backend Integration**: Once backend is ready, real data will be used automatically
4. **Remove mock data**: After all backend endpoints are live and tested
