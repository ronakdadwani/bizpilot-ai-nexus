#!/usr/bin/env node

/**
 * Backend Route Discovery Tool
 * Attempts to discover actual backend routes and HTTP methods
 */

const API_BASE_URL = "https://biz-pilot-ai.onrender.com";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
  bold: "\x1b[1m",
};

// Common endpoint patterns to try
const COMMON_ROUTES = [
  // Auth routes
  "/login", "/signup", "/logout", "/auth", "/auth/login", "/auth/signup",
  
  // API v1 routes
  "/api", "/api/login", "/api/signup", "/api/analytics", "/api/forecast",
  "/api/customers", "/api/files", "/api/reports", "/api/alerts", "/api/me",
  
  // Direct routes
  "/analytics", "/forecast", "/customers", "/files", "/reports", "/alerts", "/me",
  
  // LLM/Chat
  "/llm", "/chat", "/api/llm", "/api/chat",
  
  // Data upload
  "/upload", "/upload-sales-data", "/api/upload-sales-data",
  
  // Admin/Info routes
  "/", "/health", "/status", "/api/status", "/docs", "/api/docs",
];

// HTTP methods to try
const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];

class RouteDiscovery {
  constructor() {
    this.discoveredRoutes = [];
    this.failedRoutes = [];
  }

  async testRoute(route, method = "GET") {
    try {
      const response = await fetch(`${API_BASE_URL}${route}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // We're interested in any response that's NOT a network error
      // 404 means route doesn't exist
      // 405 means route exists but method not allowed
      // 401 means route exists but needs auth
      // 200/201/etc means route works

      return {
        status: response.status,
        method,
        exists: response.status !== 404,
        methodAllowed: response.status !== 405,
        requiresAuth: response.status === 401,
      };
    } catch (error) {
      return {
        status: 0,
        method,
        error: error.message,
        exists: false,
      };
    }
  }

  async discoverRoutes() {
    console.log(`${colors.bold}${colors.blue}Route Discovery in Progress...${colors.reset}\n`);
    console.log(`Testing ${COMMON_ROUTES.length} routes with multiple HTTP methods...\n`);

    const results = {};

    for (const route of COMMON_ROUTES) {
      process.stdout.write(`Testing ${route}... `);
      
      let foundMethod = false;
      const methods = [];

      for (const method of HTTP_METHODS) {
        const result = await this.testRoute(route, method);
        
        if (result.exists && result.methodAllowed) {
          methods.push(method);
          foundMethod = true;
        }
      }

      if (foundMethod) {
        console.log(`${colors.green}✅ Found [${methods.join(", ")}]${colors.reset}`);
        results[route] = methods;
        this.discoveredRoutes.push({ route, methods });
      } else {
        console.log(`${colors.red}❌ Not found${colors.reset}`);
        this.failedRoutes.push(route);
      }
    }

    return results;
  }

  displayResults() {
    console.log(`\n${colors.bold}${colors.blue}${"═".repeat(60)}${colors.reset}`);
    console.log(`${colors.bold}DISCOVERED ROUTES:${colors.reset}\n`);

    if (this.discoveredRoutes.length === 0) {
      console.log(`${colors.red}No routes discovered!${colors.reset}`);
      console.log(`${colors.yellow}This might mean:${colors.reset}`);
      console.log(`  1. Backend uses a different API version (e.g., /api/v1/)`);
      console.log(`  2. Routes require authentication`);
      console.log(`  3. Backend has strict CORS policies`);
      return;
    }

    this.discoveredRoutes.forEach((item, index) => {
      console.log(`${colors.green}${index + 1}. ${item.route}${colors.reset}`);
      console.log(`   Methods: ${colors.blue}${item.methods.join(", ")}${colors.reset}\n`);
    });

    // Suggest mapping
    console.log(`${colors.bold}${colors.blue}${"═".repeat(60)}${colors.reset}`);
    console.log(`${colors.bold}SUGGESTED API CLIENT MAPPING:${colors.reset}\n`);

    const mapping = {
      login: this.discoveredRoutes.find(r => r.route.includes("login")),
      signup: this.discoveredRoutes.find(r => r.route.includes("signup")),
      analytics: this.discoveredRoutes.find(r => r.route.includes("analytics")),
      forecast: this.discoveredRoutes.find(r => r.route.includes("forecast")),
      customers: this.discoveredRoutes.find(r => r.route.includes("customers")),
      files: this.discoveredRoutes.find(r => r.route.includes("files")),
      reports: this.discoveredRoutes.find(r => r.route.includes("reports")),
      alerts: this.discoveredRoutes.find(r => r.route.includes("alerts")),
    };

    Object.entries(mapping).forEach(([key, route]) => {
      if (route) {
        console.log(`${colors.green}✓${colors.reset} ${key}: ${colors.cyan}${route.route}${colors.reset} [${route.methods.join(", ")}]`);
      } else {
        console.log(`${colors.red}✗${colors.reset} ${key}: ${colors.yellow}NOT FOUND${colors.reset}`);
      }
    });
  }
}

async function main() {
  console.clear();
  console.log(`${colors.bold}${colors.blue}${"═".repeat(60)}${colors.reset}`);
  console.log(`${colors.bold}Backend Route Discovery Tool${colors.reset}`);
  console.log(`${colors.blue}${"═".repeat(60)}${colors.reset}\n`);
  console.log(`API Base: ${API_BASE_URL}\n`);

  const discovery = new RouteDiscovery();
  await discovery.discoverRoutes();
  discovery.displayResults();

  console.log(`\n${colors.yellow}Note:${colors.reset} If no routes found, check your backend logs or documentation`);
  console.log(`for the correct API structure.\n`);
}

main().catch(console.error);
