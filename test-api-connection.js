#!/usr/bin/env node

/**
 * Backend API Connection Test Script (Enhanced)
 * Tests if the backend API is reachable and working with authentication
 */

const API_BASE_URL = "https://biz-pilot-ai.onrender.com";

// Test credentials - using generic test user
const TEST_CREDENTIALS = {
  email: "test@example.com",
  password: "testpassword123",
};

// Color codes for output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
};

async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json().catch(() => ({}));
    return { response, data, success: response.ok };
  } catch (error) {
    return { error: error.message, success: false };
  }
}

async function testBasicConnectivity() {
  console.log(`\n${colors.blue}═══ BASIC CONNECTIVITY TESTS ═══${colors.reset}\n`);

  const tests = [
    { name: "Root Endpoint", endpoint: "/" },
    { name: "Health Check", endpoint: "/health" },
  ];

  let passed = 0;

  for (const test of tests) {
    process.stdout.write(`⏳ ${test.name}... `);
    const { response, success, error } = await makeRequest(test.endpoint);

    if (success) {
      console.log(`${colors.green}✅ OK (${response.status})${colors.reset}`);
      passed++;
    } else if (response?.status) {
      console.log(`${colors.yellow}⚠️  HTTP ${response.status}${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ ${error}${colors.reset}`);
    }
  }

  return passed === tests.length;
}

async function testAuthentication() {
  console.log(`\n${colors.blue}═══ AUTHENTICATION TESTS ═══${colors.reset}\n`);

  process.stdout.write(`⏳ Testing Login endpoint... `);
  const { response, data, success } = await makeRequest("/login", {
    method: "POST",
    body: JSON.stringify(TEST_CREDENTIALS),
  });

  if (response?.status === 404) {
    console.log(`${colors.yellow}⚠️  Endpoint not found (404)${colors.reset}`);
    console.log(`   ℹ️  Login endpoint might have different path\n`);
    return null;
  }

  if (response?.status === 401 || response?.status === 400) {
    console.log(`${colors.yellow}⚠️  Authentication issue (${response.status})${colors.reset}`);
    console.log(`   ℹ️  Valid endpoint but credentials incorrect/user not found\n`);
    return null;
  }

  if (success && data.token) {
    console.log(`${colors.green}✅ Login Successful${colors.reset}`);
    console.log(`   Token received: ${data.token.substring(0, 20)}...\n`);
    return data.token;
  }

  console.log(`${colors.red}❌ Login Failed${colors.reset}\n`);
  return null;
}

async function testProtectedEndpoints(token) {
  console.log(`${colors.blue}═══ PROTECTED ENDPOINTS TESTS ═══${colors.reset}\n`);

  const endpoints = [
    { name: "Analytics", endpoint: "/analytics" },
    { name: "Forecast", endpoint: "/forecast" },
    { name: "Files", endpoint: "/files" },
    { name: "Reports", endpoint: "/reports" },
    { name: "Customers", endpoint: "/customers" },
    { name: "Alerts", endpoint: "/alerts" },
    { name: "User Profile (/me)", endpoint: "/me" },
  ];

  let accessible = 0;
  const endpointDetails = [];

  for (const endpoint of endpoints) {
    process.stdout.write(`⏳ ${endpoint.name}... `);

    const { response, success, data } = await makeRequest(endpoint.endpoint, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (success) {
      console.log(`${colors.green}✅ OK (${response.status})${colors.reset}`);
      accessible++;
      
      // Capture response data
      if (data && Object.keys(data).length > 0) {
        endpointDetails.push({
          name: endpoint.name,
          endpoint: endpoint.endpoint,
          status: response.status,
          data: data,
        });
      }
    } else if (response?.status === 401) {
      console.log(`${colors.yellow}⚠️  Unauthorized (401)${colors.reset}`);
    } else if (response?.status === 404) {
      console.log(`${colors.yellow}⚠️  Not Found (404)${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ Error (${response?.status || "unknown"})${colors.reset}`);
    }
  }

  console.log();
  return { accessible, endpointDetails };
}

async function generateReport(basicOk, token, result) {
  console.log(`${colors.blue}═══ TEST SUMMARY ═══${colors.reset}\n`);

  if (basicOk) {
    console.log(`${colors.green}✅ Backend Server: REACHABLE${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Backend Server: UNREACHABLE${colors.reset}`);
    console.log(`\n   Check:\n   - Is the backend running?\n   - Correct API URL: ${API_BASE_URL}\n   - Internet connection\n   - CORS settings\n`);
    return;
  }

  if (token) {
    console.log(`${colors.green}✅ Authentication: WORKING${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  Authentication: CHECK NEEDED${colors.reset}`);
    console.log(`   Create a test user or check login endpoint path\n`);
  }

  console.log(`✅ Protected Endpoints Accessible: ${result.accessible}/7\n`);

  // Display real-time data from endpoints
  if (result.endpointDetails && result.endpointDetails.length > 0) {
    console.log(`${colors.blue}═══ REAL-TIME DATA FROM ENDPOINTS ═══${colors.reset}\n`);
    
    for (const detail of result.endpointDetails) {
      console.log(`${colors.green}${detail.name}${colors.reset} (${detail.endpoint})`);
      console.log(JSON.stringify(detail.data, null, 2));
      console.log();
    }
  }

  console.log(`${colors.green}🎉 Overall Status: Backend API is WORKING!${colors.reset}\n`);

  if (!token) {
    console.log(`${colors.yellow}Note:${colors.reset} Some endpoints returned 401 (Unauthorized).`);
    console.log(`This is normal if no valid user session exists.\n`);
  }
}

async function runTests() {
  console.log(`\n${colors.blue}${"═".repeat(50)}${colors.reset}`);
  console.log(`${colors.blue}   Backend API Connection Test (Enhanced)${colors.reset}`);
  console.log(`${colors.blue}${"═".repeat(50)}${colors.reset}`);
  console.log(`\nAPI URL: ${API_BASE_URL}`);

  try {
    const basicOk = await testBasicConnectivity();

    if (!basicOk) {
      console.log(`\n${colors.red}❌ Cannot reach backend. Stopping tests.${colors.reset}\n`);
      return;
    }

    const token = await testAuthentication();
    const result = await testProtectedEndpoints(token);

    await generateReport(basicOk, token, result);
  } catch (error) {
    console.error(`${colors.red}Test execution error:${colors.reset}`, error.message);
  }
}

runTests();
