#!/usr/bin/env node

import https from 'https';
import { URL } from 'url';

// Backend configuration
const BACKEND_URL = "https://biz-pilot-ai.onrender.com";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzViNTJjZWQtNjQ1Ny00YjU4LWFlMDItOTIxYzI4MmY4MTUyIiwiZXhwIjoxNzY3OTQyMjQ2fQ.iQ3UNXlMySO2589tDf8aSwds3d5C6qN-AcnTN_JziY4";

// List of endpoints to test
const endpoints = [
  { method: 'GET', path: '/health', requiresAuth: false },
  { method: 'GET', path: '/me', requiresAuth: true },
  { method: 'GET', path: '/analytics', requiresAuth: true },
  { method: 'GET', path: '/forecast', requiresAuth: true },
  { method: 'GET', path: '/customers', requiresAuth: true },
  { method: 'GET', path: '/reports', requiresAuth: true },
  { method: 'GET', path: '/alerts', requiresAuth: true },
  { method: 'GET', path: '/files', requiresAuth: true },
  { method: 'GET', path: '/dashboard', requiresAuth: true },
];

function makeRequest(method, path, requiresAuth, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BACKEND_URL + path);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (requiresAuth) {
      options.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
    }

    const request = https.request(url, options, (response) => {
      let data = '';
      
      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: response.statusCode,
            statusText: response.statusMessage,
            data: parsed,
            error: null
          });
        } catch (e) {
          resolve({
            status: response.statusCode,
            statusText: response.statusMessage,
            data: data,
            error: 'Failed to parse JSON'
          });
        }
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    if (body) {
      request.write(JSON.stringify(body));
    }

    request.end();
  });
}

// Helper: format results nicely

async function testAllEndpoints() {
  console.log('\n' + '='.repeat(80));
  console.log('BACKEND ENDPOINT TEST REPORT');
  console.log('='.repeat(80));
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Test Date: ${new Date().toISOString()}`);
  console.log('='.repeat(80) + '\n');

  const results = [];
  
  for (const endpoint of endpoints) {
    const { method, path, requiresAuth, body } = endpoint;
    
    try {
      process.stdout.write(`Testing: ${method.padEnd(6)} ${path.padEnd(30)} ... `);
      
      const result = await makeRequest(method, path, requiresAuth, body);
      
      const statusColor = result.status < 400 ? '✅' : result.status < 500 ? '⚠️' : '❌';
      console.log(`${statusColor} ${result.status}`);
      
      results.push({
        method,
        path,
        status: result.status,
        success: result.status < 400,
        hasData: result.data ? true : false
      });

      // Show data preview for successful requests
      if (result.status < 400 && result.data) {
        const preview = JSON.stringify(result.data).substring(0, 80);
        console.log(`   └─ Data: ${preview}...`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      results.push({
        method,
        path,
        status: 0,
        success: false,
        error: error.message
      });
    }
  }

  // Summary
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  
  const working = results.filter(r => r.status < 400);
  const notFound = results.filter(r => r.status === 404);
  const unauthorized = results.filter(r => r.status === 401);
  const errors = results.filter(r => r.status >= 500 || r.status === 0);

  console.log(`✅ Working (200-399):   ${working.length} endpoints`);
  console.log(`⚠️  Not Found (404):      ${notFound.length} endpoints`);
  console.log(`🔐 Unauthorized (401):   ${unauthorized.length} endpoints`);
  console.log(`❌ Server Errors:        ${errors.length} endpoints`);
  
  console.log('\n' + '='.repeat(80));
  console.log('ENDPOINTS INVENTORY');
  console.log('='.repeat(80) + '\n');

  working.forEach(r => console.log(`✅ ${r.method.padEnd(6)} ${r.path.padEnd(30)} - READY`));
  
  if (notFound.length > 0) {
    console.log('\n⚠️  ENDPOINTS TO IMPLEMENT:');
    notFound.forEach(r => console.log(`   ${r.method.padEnd(6)} ${r.path.padEnd(30)} - 404 Not Found`));
  }

  console.log('\n' + '='.repeat(80));
  console.log('RECOMMENDATIONS');
  console.log('='.repeat(80));
  
  console.log(`
✅ Working Endpoints (${working.length}):
   These endpoints are ready and returning data correctly.

❌ Missing Endpoints (${notFound.length}):
   These endpoints need to be implemented in the backend:
   ${notFound.map(r => `- ${r.method} ${r.path}`).join('\n   ')}

📋 Next Steps:
   1. Implement missing endpoints on backend
   2. Ensure all endpoints return proper response format: { data: {...} }
   3. Include proper error handling (401 for auth, 404 for not found, etc.)
   4. Test each endpoint after implementation
  `);

  console.log('='.repeat(80) + '\n');
}

testAllEndpoints().catch(console.error);
