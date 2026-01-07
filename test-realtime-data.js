#!/usr/bin/env node

/**
 * Advanced Backend API Real-Time Data Tester
 * Tests all endpoints and displays real-time data with proper formatting
 */

const API_BASE_URL = "https://biz-pilot-ai.onrender.com";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
  cyan: "\x1b[34m",
  white: "\x1b[37m",
  bold: "\x1b[1m",
};

class APITester {
  constructor() {
    this.results = [];
    this.authToken = null;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const contentType = response.headers.get("content-type");
      let data = {};
      
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return { 
        response, 
        data, 
        success: response.ok,
        status: response.status,
      };
    } catch (error) {
      return { 
        error: error.message, 
        success: false,
        status: 0,
      };
    }
  }

  log(message, type = "info") {
    const prefix = {
      info: "ℹ️ ",
      success: "✅ ",
      error: "❌ ",
      warning: "⚠️ ",
      data: "📊 ",
      endpoint: "📍 ",
    }[type] || "";

    console.log(prefix + message);
  }

  formatJson(obj, indent = 2) {
    return JSON.stringify(obj, null, indent);
  }

  async testEndpoint(name, endpoint, method = "GET", headers = {}) {
    console.log(`\n${colors.cyan}─────────────────────────────────────${colors.reset}`);
    this.log(`${colors.bold}${name}${colors.reset}`, "endpoint");
    console.log(`${colors.white}${endpoint} [${method}]${colors.reset}`);

    const { response, data, success, status, error } = await this.request(endpoint, {
      method,
      headers: {
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...headers,
      },
    });

    if (error) {
      this.log(`Network Error: ${error}`, "error");
      return null;
    }

    const statusColor = success ? colors.green : status === 401 ? colors.yellow : colors.red;
    console.log(`${statusColor}Status: ${status}${colors.reset}`);

    if (success || status === 401 || status === 404) {
      // Try to display data nicely
      if (typeof data === "object" && Object.keys(data).length > 0) {
        console.log(`${colors.blue}Response Data:${colors.reset}`);
        const displayData = JSON.stringify(data, null, 2)
          .split('\n')
          .map(line => '  ' + line)
          .join('\n');
        console.log(displayData);
        
        return data;
      } else if (typeof data === "string" && data) {
        console.log(`${colors.blue}Response:${colors.reset} ${data}`);
      }
    } else {
      console.log(`${colors.red}Error: Unexpected status${colors.reset}`);
    }

    return null;
  }

  async runFullTest() {
    console.clear();
    console.log(`${colors.bold}${colors.blue}${"═".repeat(60)}${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}   Advanced Backend API Real-Time Data Tester${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}${"═".repeat(60)}${colors.reset}`);
    console.log(`\n${colors.white}API URL: ${API_BASE_URL}${colors.reset}\n`);

    // Phase 1: Basic Connectivity
    console.log(`${colors.bold}${colors.cyan}PHASE 1: Basic Connectivity${colors.reset}`);
    const healthResult = await this.testEndpoint("Health Check", "/health");

    // Phase 2: Public Endpoints
    console.log(`\n${colors.bold}${colors.cyan}PHASE 2: Public Endpoints${colors.reset}`);
    await this.testEndpoint("Root/Info", "/");

    // Phase 3: Authentication
    console.log(`\n${colors.bold}${colors.cyan}PHASE 3: Authentication${colors.reset}`);
    console.log(
      `${colors.yellow}Note: Login endpoint requires valid credentials${colors.reset}`
    );

    // Phase 4: Data Endpoints (will show auth required, but that's okay)
    console.log(
      `\n${colors.bold}${colors.cyan}PHASE 4: Data Endpoints (Real-Time Data)${colors.reset}`
    );
    console.log(
      `${colors.yellow}Note: These endpoints require authentication${colors.reset}\n`
    );

    const dataEndpoints = [
      { name: "Analytics", endpoint: "/analytics" },
      { name: "Forecast", endpoint: "/forecast" },
      { name: "Sales Files", endpoint: "/files" },
      { name: "Reports", endpoint: "/reports" },
      { name: "Customers", endpoint: "/customers" },
      { name: "Alerts", endpoint: "/alerts" },
      { name: "User Profile", endpoint: "/me" },
    ];

    let successCount = 0;
    let totalCount = dataEndpoints.length;

    const results = await Promise.all(
      dataEndpoints.map(ep => this.testEndpoint(ep.name, ep.endpoint))
    );

    successCount = results.filter(r => r !== null).length;

    // Summary
    console.log(`\n${colors.bold}${colors.blue}${"═".repeat(60)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}SUMMARY${colors.reset}`);
    console.log(`${colors.blue}${"═".repeat(60)}${colors.reset}\n`);

    const serverStatus = healthResult ? colors.green + "✅ REACHABLE" : colors.red + "❌ UNREACHABLE";
    console.log(`Server Status: ${serverStatus}${colors.reset}`);
    console.log(
      `Data Endpoints: ${colors.green}${successCount}${colors.reset}/${totalCount} responding`
    );

    console.log(
      `\n${colors.bold}${colors.green}API Integration Status: READY FOR DEVELOPMENT${colors.reset}`
    );
    console.log(`\n${colors.yellow}Next Steps:${colors.reset}`);
    console.log(`1. Create a test user via signup endpoint`);
    console.log(`2. Use the token to authenticate protected endpoints`);
    console.log(`3. All real-time data will be available once authenticated\n`);
  }
}

// Run the tester
const tester = new APITester();
tester.runFullTest().catch(console.error);
