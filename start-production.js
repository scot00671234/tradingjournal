#!/usr/bin/env node

// Production startup script for CoinFeedly
// This script starts both Node.js server and Caddy reverse proxy

import { spawn } from 'child_process';
import { createServer } from 'http';

console.log('🚀 Starting CoinFeedly Production Server...');

// Set environment variables
process.env.NODE_ENV = 'production';
process.env.PORT = '3000';

console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${process.env.PORT}`);
console.log(`Database URL present: ${!!process.env.DATABASE_URL}`);

// Function to check if Node.js app is responding
function checkNodeApp() {
  return new Promise((resolve) => {
    const req = createServer().listen(0, () => {
      const testPort = req.address().port;
      req.close();
      
      const testReq = createServer().listen(testPort, () => {
        testReq.close();
        
        // Try to connect to the Node.js app
        const http = require('http');
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: '/',
          method: 'GET',
          timeout: 2000
        };

        const req = http.request(options, (res) => {
          resolve(true);
        });

        req.on('error', () => {
          resolve(false);
        });

        req.on('timeout', () => {
          req.destroy();
          resolve(false);
        });

        req.end();
      });
    });
  });
}

// Start Node.js application
console.log('📱 Starting Node.js application...');
const nodeProcess = spawn('node', ['dist/index.js'], {
  stdio: ['inherit', 'inherit', 'inherit'],
  env: { ...process.env }
});

// Handle Node.js process errors
nodeProcess.on('error', (err) => {
  console.error('❌ Failed to start Node.js application:', err);
  process.exit(1);
});

nodeProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Node.js application exited with code ${code}`);
    process.exit(1);
  }
});

// Wait for Node.js app to be ready
let attempts = 0;
const maxAttempts = 15;

const waitForNode = async () => {
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`⏳ Checking Node.js app (attempt ${attempts}/${maxAttempts})...`);
    
    const isReady = await checkNodeApp();
    if (isReady) {
      console.log('✅ Node.js application is responding on port 3000');
      break;
    }
    
    if (attempts >= maxAttempts) {
      console.error('❌ Node.js application is not responding after maximum attempts');
      nodeProcess.kill();
      process.exit(1);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Start Caddy
  console.log('🌐 Starting Caddy reverse proxy...');
  const caddyProcess = spawn('caddy', ['run', '--config', '/assets/Caddyfile', '--adapter', 'caddyfile'], {
    stdio: ['inherit', 'inherit', 'inherit']
  });

  caddyProcess.on('error', (err) => {
    console.error('❌ Failed to start Caddy:', err);
    nodeProcess.kill();
    process.exit(1);
  });

  caddyProcess.on('exit', (code) => {
    console.error(`❌ Caddy exited with code ${code}`);
    nodeProcess.kill();
    process.exit(1);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('⏹️ SIGTERM received, shutting down...');
    caddyProcess.kill();
    nodeProcess.kill();
  });

  process.on('SIGINT', () => {
    console.log('⏹️ SIGINT received, shutting down...');
    caddyProcess.kill();
    nodeProcess.kill();
  });
};

waitForNode().catch((err) => {
  console.error('❌ Startup failed:', err);
  nodeProcess.kill();
  process.exit(1);
});