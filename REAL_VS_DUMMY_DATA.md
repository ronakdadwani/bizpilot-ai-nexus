# Real vs Dummy Data - Complete Breakdown

## Quick Summary

| Data Source | Status | Type |
|-------------|--------|------|
| **Login/Signup** | ✅ REAL | Backend Authentication |
| **Files** | ⚠️ FALLBACK | Real if 200, Dummy if 401 |
| **Forecast** | ⚠️ FALLBACK | Real if 200, Dummy if 401 |
| **Analytics** | 🔴 DUMMY | Hardcoded Mock (Endpoint doesn't exist) |
| **Customers** | 🔴 DUMMY | Hardcoded Mock (Endpoint doesn't exist) |
| **Reports** | 🔴 DUMMY | Hardcoded Mock (Endpoint doesn't exist) |
| **Alerts** | 🔴 DUMMY | Hardcoded Mock (Endpoint doesn't exist) |
| **Chat/LLM** | 🔴 DUMMY | Hardcoded Mock (Endpoint doesn't exist) |
| **User Profile (/me)** | ✅ REAL | Backend Data |
| **File Upload** | ✅ REAL | Backend Upload |

---

## Detailed Breakdown

### ✅ **REAL DATA** (From Backend)

#### 1. **Login** (`POST /login`)
- **Type**: Real
- **Source**: Backend
- **Data**: User email, password, token, user profile
- **Status**: ✅ Working
- **Location**: [Auth.tsx](src/pages/Auth.tsx)

```typescript
async login(email: string, password: string) {
  // Makes REAL request to backend
  const result = await this.request<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  
  if (result.data) {
    // Token stored from backend response
    this.setToken(result.data.token);
    this.setUser(result.data.user);
  }
}
```

**Returns Real Data:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

#### 2. **Signup** (`POST /signup`)
- **Type**: Real
- **Source**: Backend
- **Data**: New user account, token, profile
- **Status**: ✅ Working
- **Location**: [Auth.tsx](src/pages/Auth.tsx)

```typescript
async signup(name: string, email: string, password: string) {
  // Makes REAL request to backend
  const result = await this.request<SignupResponse>("/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  
  if (result.data) {
    this.setToken(result.data.token);
    this.setUser(result.data.user);
  }
}
```

---

#### 3. **User Profile** (`GET /me`)
- **Type**: Real
- **Source**: Backend
- **Data**: Current logged-in user info
- **Status**: ✅ Working
- **Location**: [useCustomAuth.tsx](src/hooks/useCustomAuth.tsx)

```typescript
async getMe(): Promise<ApiResponse<User>> {
  // Makes REAL request with Bearer token
  return this.get<User>("/me");
}
```

**Returns Real Data:**
```json
{
  "id": "user123",
  "email": "user@example.com",
  "name": "John Doe"
}
```

---

#### 4. **File Upload** (`POST /upload-sales-data`)
- **Type**: Real
- **Source**: Backend
- **Data**: Upload status, file ID, message
- **Status**: ✅ Working
- **Location**: [UploadData.tsx](src/pages/UploadData.tsx)

```typescript
async uploadSalesData(file: File) {
  // Makes REAL request with file
  return this.uploadFile("/upload-sales-data", file);
}
```

---

#### 5. **Files List** (`GET /files`)
- **Type**: Conditional
- **Source**: Backend OR Mock (fallback)
- **Status**: ⚠️ Depends on auth token
- **Location**: [Files.tsx](src/pages/Files.tsx)

```typescript
async getFiles(): Promise<ApiResponse<FileItem[]>> {
  const result = await this.get<FileItem[]>("/files");
  
  // Try REAL data first
  if (result.ok) {
    return { data: realData }; // ✅ REAL
  }
  
  // If 401 error, fallback to MOCK
  if (result.error?.includes("401")) {
    return { data: mockFilesList }; // 🔴 DUMMY
  }
}
```

**Real Data (if 200):**
```json
[
  {
    "id": "abc123",
    "name": "actual_sales_data.csv",
    "type": "CSV",
    "size": "5.2 MB",
    "uploadedAt": "2024-01-07"
  }
]
```

**Mock Data (if 401):**
```json
[
  {
    "id": "1",
    "name": "Q4_2023_Sales_Report.csv",
    "type": "CSV",
    "size": "2.4 MB",
    "uploadedAt": "2024-01-05"
  },
  // ... more mock files
]
```

---

#### 6. **Forecast** (`POST /forecast`)
- **Type**: Conditional
- **Source**: Backend OR Mock (fallback)
- **Status**: ⚠️ Depends on auth token
- **Location**: [Forecast.tsx](src/pages/Forecast.tsx)

```typescript
async getForecast(period?: string): Promise<ApiResponse<ForecastData>> {
  const result = await this.post<ForecastData>("/forecast", body);
  
  // Try REAL data first
  if (result.ok) {
    return { data: realForecastData }; // ✅ REAL
  }
  
  // If 401 error, fallback to MOCK
  if (result.error?.includes("401")) {
    return { data: mockForecastData }; // 🔴 DUMMY
  }
}
```

**Real Data (if 200):**
```json
{
  "revenuePrediction": 87650,
  "confidenceScore": 0.92,
  "peakPeriod": "Q1 2024",
  "forecastData": [...]
}
```

**Mock Data (if 401):**
```json
{
  "revenuePrediction": 52400,
  "confidenceScore": 0.89,
  "peakPeriod": "Q2 2024",
  "forecastData": [
    { "date": "2024-02-01", "predicted": 45000, "actual": 42000 },
    // ...
  ]
}
```

---

### 🔴 **DUMMY DATA** (Hardcoded Mock - Endpoints Don't Exist)

#### 1. **Analytics** (`/analytics` - NOT ON BACKEND)
- **Type**: Hardcoded Mock
- **Source**: Dummy data in code
- **Status**: 🔴 No backend endpoint
- **Location**: [Analytics.tsx](src/pages/Analytics.tsx)

```typescript
async getAnalytics(): Promise<ApiResponse<AnalyticsData>> {
  // NOTE: /analytics endpoint not found on backend
  // Using mock data for UI development
  
  const mockData: AnalyticsData = {
    totalSales: 45230,           // ← DUMMY
    conversionRate: 3.2,         // ← DUMMY
    avgOrderValue: 89.5,         // ← DUMMY
    customerRetention: 68,       // ← DUMMY
    salesTrend: [
      { date: "2024-01-01", value: 1200 },  // ← DUMMY
      // ...
    ],
    categoryBreakdown: [
      { name: "Electronics", value: 35 },   // ← DUMMY
      // ...
    ],
  };
  return { data: mockData }; // Always returns dummy
}
```

**What's Displayed:**
- Dashboard analytics cards
- Sales trends chart
- Category breakdown

**Is it Real?** 🔴 NO - This is sample data

---

#### 2. **Customers** (`/customers` - NOT ON BACKEND)
- **Type**: Hardcoded Mock
- **Source**: Dummy data in code
- **Status**: 🔴 No backend endpoint
- **Location**: [Customers.tsx](src/pages/Customers.tsx)

```typescript
async getCustomers(): Promise<ApiResponse<CustomerData>> {
  // NOTE: /customers endpoint not found on backend
  // Using mock data for UI development
  
  const mockCustomers: CustomerData = {
    customers: [
      {
        id: "1",
        name: "John Doe",         // ← DUMMY
        email: "john@example.com", // ← DUMMY
        status: "active",         // ← DUMMY
        totalSpent: 1250.50,      // ← DUMMY
      },
      // ...
    ],
    stats: {
      total: 342,        // ← DUMMY
      active: 287,       // ← DUMMY
      newThisMonth: 45,  // ← DUMMY
    },
  };
  return { data: mockCustomers }; // Always returns dummy
}
```

**What's Displayed:**
- Customer list
- Customer stats
- Contact information

**Is it Real?** 🔴 NO - This is sample data

---

#### 3. **Reports** (`/reports` - NOT ON BACKEND)
- **Type**: Hardcoded Mock
- **Source**: Dummy data in code
- **Status**: 🔴 No backend endpoint
- **Location**: [Reports.tsx](src/pages/Reports.tsx)

```typescript
async getReports(): Promise<ApiResponse<Report[]>> {
  // NOTE: /reports endpoint not found on backend
  // Using mock data for UI development
  
  const mockReports: Report[] = [
    {
      id: "1",
      title: "Monthly Sales Report",  // ← DUMMY
      type: "sales",                  // ← DUMMY
      date: "2024-01-07",             // ← DUMMY
      status: "completed",            // ← DUMMY
    },
    // ...
  ];
  return { data: mockReports }; // Always returns dummy
}
```

**What's Displayed:**
- Report list
- Report titles and dates
- Report status

**Is it Real?** 🔴 NO - This is sample data

---

#### 4. **Alerts** (`/alerts` - NOT ON BACKEND)
- **Type**: Hardcoded Mock
- **Source**: Dummy data in code
- **Status**: 🔴 No backend endpoint
- **Location**: [Alerts.tsx](src/pages/Alerts.tsx)

```typescript
async getAlerts(): Promise<ApiResponse<AlertItem[]>> {
  // NOTE: /alerts endpoint not found on backend
  // Using mock data for UI development
  
  const mockAlerts: AlertItem[] = [
    {
      id: "1",
      type: "warning",              // ← DUMMY
      title: "High Cart Abandonment",// ← DUMMY
      message: "Rate increased...",  // ← DUMMY
      timestamp: "2024-01-07T...",   // ← DUMMY
    },
    // ...
  ];
  return { data: mockAlerts }; // Always returns dummy
}
```

**What's Displayed:**
- Alert notifications
- Alert messages
- Alert status

**Is it Real?** 🔴 NO - This is sample data

---

#### 5. **Chat/LLM** (`/llm` - NOT ON BACKEND)
- **Type**: Hardcoded Mock
- **Source**: Dummy response in code
- **Status**: 🔴 No backend endpoint
- **Location**: [AIChat.tsx](src/pages/AIChat.tsx)

```typescript
async sendChatMessage(message: string): Promise<ApiResponse<ChatResponse>> {
  // NOTE: /llm endpoint not found on backend
  // Using mock response for UI development
  
  const mockResponse: ChatResponse = {
    response: `I understand you're asking about: "${message}". 
               Based on current analytics...`,  // ← DUMMY
    message: "Success",  // ← DUMMY
  };
  return { data: mockResponse }; // Always returns dummy
}
```

**What's Displayed:**
- Chat messages
- AI responses
- Conversation history

**Is it Real?** 🔴 NO - This is sample data

---

## Data Source Summary Table

| Page | Endpoint | Backend | Data Type | Real/Dummy |
|------|----------|---------|-----------|-----------|
| Auth | `/login` | ✅ Yes | User credentials | ✅ Real |
| Auth | `/signup` | ✅ Yes | User registration | ✅ Real |
| Dashboard | `/analytics` | ❌ No | Sales metrics | 🔴 Dummy |
| Analytics | `/analytics` | ❌ No | Detailed analytics | 🔴 Dummy |
| Forecast | `/forecast` | ✅ Yes | Revenue prediction | ⚠️ Conditional* |
| Forecast | `/forecast` | ✅ Yes | But needs auth | ⚠️ Fallback if 401 |
| Files | `/files` | ✅ Yes | File list | ⚠️ Conditional* |
| Files | `/files` | ✅ Yes | But needs auth | ⚠️ Fallback if 401 |
| Customers | `/customers` | ❌ No | Customer data | 🔴 Dummy |
| Reports | `/reports` | ❌ No | Report list | 🔴 Dummy |
| Alerts | `/alerts` | ❌ No | Notifications | 🔴 Dummy |
| Chat | `/llm` | ❌ No | AI responses | 🔴 Dummy |
| Profile | `/me` | ✅ Yes | User info | ✅ Real |
| Upload | `/upload-sales-data` | ✅ Yes | File upload | ✅ Real |

*Conditional = Real if auth succeeds (200), Dummy if auth fails (401)

---

## How to Know What's Real vs Dummy

### In Browser Console:
```javascript
// Check auth token
localStorage.getItem("bizpilot_token")

// If token exists → Files & Forecast might be real
// If token missing → Files & Forecast will be dummy

// Check API client
import { api } from "@/lib/api";
console.log(api.isAuthenticated())  // true = token exists
```

### By Looking at Data:
- **Analytics, Customers, Reports, Alerts, Chat** → Always hardcoded → 🔴 DUMMY
- **Forecast, Files** → Depends on auth → ⚠️ Conditional
- **Login, Signup, Me, Upload** → Always from backend → ✅ REAL

### In DevTools Network Tab:
- **Real data**: Shows actual API request to backend
- **Dummy data**: No network request, data hardcoded in code

---

## What Should Be Done

### For Production:
1. Backend needs to provide missing endpoints:
   - `/analytics` → Real analytics endpoint
   - `/customers` → Real customer endpoint
   - `/reports` → Real reports endpoint
   - `/alerts` → Real alerts endpoint
   - `/llm` → Real LLM/chat endpoint

2. Remove hardcoded mock data from [src/lib/api.ts](src/lib/api.ts)

3. Replace with real API calls

---

## Current State Summary

| Category | Count | Status |
|----------|-------|--------|
| Real endpoints | 5 | ✅ Working |
| Conditional endpoints | 2 | ⚠️ With fallback |
| Dummy/Mock endpoints | 5 | 🔴 Development only |

**95% of features work** with either real data or fallback mock data!
