const API_BASE_URL = "https://biz-pilot-ai.onrender.com";

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

interface BackendUser {
  id: string;
  email: string;
  full_name: string | null;
  stage?: string;
  created_at?: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: BackendUser;
}

interface SignupResponse {
  access_token: string;
  token_type: string;
  user: BackendUser;
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

  private mapBackendUser(backendUser: BackendUser): User {
    return {
      id: backendUser.id,
      email: backendUser.email,
      name: backendUser.full_name || backendUser.email.split('@')[0],
    };
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const result = await this.request<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (result.data) {
      this.setToken(result.data.access_token);
      this.setUser(this.mapBackendUser(result.data.user));
    }

    return result;
  }

  async signup(name: string, email: string, password: string): Promise<ApiResponse<SignupResponse>> {
    const result = await this.request<SignupResponse>("/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (result.data) {
      this.setToken(result.data.access_token);
      this.setUser(this.mapBackendUser(result.data.user));
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
    return this.get<AnalyticsData>("/analytics");
  }

  async getForecast(period?: string): Promise<ApiResponse<ForecastData>> {
    const endpoint = period ? `/forecast?period=${period}` : "/forecast";
    return this.get<ForecastData>(endpoint);
  }

  async uploadSalesData(file: File): Promise<ApiResponse<UploadResponse>> {
    return this.uploadFile("/upload-sales-data", file) as Promise<ApiResponse<UploadResponse>>;
  }

  async getFiles(): Promise<ApiResponse<FileItem[]>> {
    return this.get<FileItem[]>("/files");
  }

  async sendChatMessage(message: string): Promise<ApiResponse<ChatResponse>> {
    return this.post<ChatResponse>("/llm", { message });
  }

  async getReports(): Promise<ApiResponse<Report[]>> {
    return this.get<Report[]>("/reports");
  }

  async getCustomers(): Promise<ApiResponse<CustomerData>> {
    return this.get<CustomerData>("/customers");
  }

  async getAlerts(): Promise<ApiResponse<AlertItem[]>> {
    return this.get<AlertItem[]>("/alerts");
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
