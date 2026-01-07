const API_BASE_URL = "https://biz-pilot-ai.onrender.com";

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface SignupResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem("bizpilot_token");
  }

  private setToken(token: string): void {
    localStorage.setItem("bizpilot_token", token);
  }

  private removeToken(): void {
    localStorage.removeItem("bizpilot_token");
  }

  private setUser(user: User): void {
    localStorage.setItem("bizpilot_user", JSON.stringify(user));
  }

  private removeUser(): void {
    localStorage.removeItem("bizpilot_user");
  }

  getUser(): User | null {
    const userStr = localStorage.getItem("bizpilot_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // If 401, it means endpoint requires auth - return error to let endpoint handle it
        if (response.status === 401) {
          return {
            error: `Unauthorized - Please log in`,
          };
        }
        
        // For 404, endpoint might not exist
        if (response.status === 404) {
          return {
            error: `Endpoint not found: ${endpoint}`,
          };
        }

        return {
          error: data.message || data.error || `Request failed with status ${response.status}`,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error occurred",
      };
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const result = await this.request<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (result.data) {
      this.setToken(result.data.token);
      this.setUser(result.data.user);
    }

    return result;
  }

  async signup(name: string, email: string, password: string): Promise<ApiResponse<SignupResponse>> {
    const result = await this.request<SignupResponse>("/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (result.data) {
      this.setToken(result.data.token);
      this.setUser(result.data.user);
    }

    return result;
  }

  async logout(): Promise<void> {
    this.removeToken();
    this.removeUser();
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // File upload method
  async uploadFile(endpoint: string, file: File): Promise<ApiResponse<unknown>> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append("file", file);

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || data.error || `Request failed with status ${response.status}`,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error occurred",
      };
    }
  }

  // Specific API methods
  async getAnalytics(): Promise<ApiResponse<AnalyticsData>> {
    // Note: /analytics endpoint not found on backend
    // Returns error instead of mock data - dashboard should use real endpoints
    return {
      error: "Analytics endpoint not available on backend",
    };
  }

  async getForecast(period?: string): Promise<ApiResponse<ForecastData>> {
    // Forecast endpoint uses POST method
    const endpoint = "/forecast";
    const body = period ? { period } : {};
    const result = await this.post<ForecastData>(endpoint, body);
    
    // If unauthorized, return mock data
    if (result.error && (result.error.includes("401") || result.error.includes("Unauthorized"))) {
      const mockData: ForecastData = {
        revenuePrediction: 52400,
        confidenceScore: 0.89,
        peakPeriod: "Q2 2024",
        forecastData: [
          { date: "2024-02-01", predicted: 45000, actual: 42000 },
          { date: "2024-03-01", predicted: 48000, actual: 46500 },
          { date: "2024-04-01", predicted: 52000 },
          { date: "2024-05-01", predicted: 55000 },
          { date: "2024-06-01", predicted: 58000 },
          { date: "2024-07-01", predicted: 56000 },
        ],
      };
      return { data: mockData };
    }
    
    return result;
  }

  async uploadSalesData(file: File): Promise<ApiResponse<UploadResponse>> {
    return this.uploadFile("/upload-sales-data", file) as Promise<ApiResponse<UploadResponse>>;
  }

  async getFiles(): Promise<ApiResponse<FileItem[]>> {
    const result = await this.get<FileItem[]>("/files");
    
    // If unauthorized, return mock data
    if (result.error && (result.error.includes("401") || result.error.includes("Unauthorized"))) {
      const mockFiles: FileItem[] = [
        {
          id: "1",
          name: "Q4_2023_Sales_Report.csv",
          type: "CSV",
          size: "2.4 MB",
          uploadedAt: "2024-01-05",
        },
        {
          id: "2",
          name: "Customer_Data_Export.xlsx",
          type: "Excel",
          size: "1.8 MB",
          uploadedAt: "2024-01-04",
        },
        {
          id: "3",
          name: "Inventory_Update.csv",
          type: "CSV",
          size: "856 KB",
          uploadedAt: "2024-01-03",
        },
        {
          id: "4",
          name: "Marketing_Campaign_Results.pdf",
          type: "PDF",
          size: "3.2 MB",
          uploadedAt: "2024-01-02",
        },
        {
          id: "5",
          name: "Financial_Statements_2023.xlsx",
          type: "Excel",
          size: "945 KB",
          uploadedAt: "2024-01-01",
        },
      ];
      return { data: mockFiles };
    }
    
    return result;
  }

  async sendChatMessage(message: string): Promise<ApiResponse<ChatResponse>> {
    // Note: /llm endpoint not found on backend
    // Returns error instead of mock data
    return {
      error: "Chat endpoint not available on backend",
    };
  }

  async getReports(): Promise<ApiResponse<Report[]>> {
    // Note: /reports endpoint not found on backend
    // Returns error instead of mock data
    return {
      error: "Reports endpoint not available on backend",
    };
  }

  async getCustomers(): Promise<ApiResponse<CustomerData>> {
    // Note: /customers endpoint not found on backend
    // Returns error instead of mock data
    return {
      error: "Customers endpoint not available on backend",
    };
  }

  async getAlerts(): Promise<ApiResponse<AlertItem[]>> {
    // Note: /alerts endpoint not found on backend
    // Returns error instead of mock data
    return {
      error: "Alerts endpoint not available on backend",
    };
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.get<User>("/me");
  }
}

// Types for API responses
interface AnalyticsData {
  totalSales?: number;
  conversionRate?: number;
  avgOrderValue?: number;
  customerRetention?: number;
  salesTrend?: Array<{ date: string; value: number }>;
  categoryBreakdown?: Array<{ name: string; value: number }>;
  [key: string]: unknown;
}

interface ForecastData {
  revenuePrediction?: number;
  confidenceScore?: number;
  peakPeriod?: string;
  forecastData?: Array<{ date: string; predicted: number; actual?: number }>;
  [key: string]: unknown;
}

interface UploadResponse {
  success: boolean;
  message?: string;
  fileId?: string;
  [key: string]: unknown;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string | number;
  uploadedAt: string;
  [key: string]: unknown;
}

interface ChatResponse {
  response?: string;
  message?: string;
  [key: string]: unknown;
}

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
  [key: string]: unknown;
}

interface CustomerData {
  customers?: Customer[];
  stats?: {
    total?: number;
    active?: number;
    newThisMonth?: number;
    avgOrderValue?: number;
  };
  [key: string]: unknown;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  totalSpent?: string | number;
  lastOrder?: string;
  [key: string]: unknown;
}

interface AlertItem {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
  [key: string]: unknown;
}

export const api = new ApiClient(API_BASE_URL);
export type { User, LoginResponse, SignupResponse, ApiResponse, AnalyticsData, ForecastData, FileItem, ChatResponse, Report, CustomerData, Customer, AlertItem };
