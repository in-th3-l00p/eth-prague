#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

async function checkDockerContainers() {
  try {
    const { stdout } = await execAsync('docker ps --format "table {{.Names}}\t{{.Status}}"');
    return stdout;
  } catch (error) {
    console.log('❌ Error checking Docker containers:', error.message);
    return '';
  }
}

async function waitForContainers() {
  console.log('🔍 Waiting for Docker containers to be ready...');
  
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds
  
  while (attempts < maxAttempts) {
    const containerStatus = await checkDockerContainers();
    
    if (containerStatus.includes('Up')) {
      console.log('✅ Docker containers are running!');
      console.log('\n📋 Container Status:');
      console.log(containerStatus);
      return true;
    }
    
    attempts++;
    console.log(`⏳ Attempt ${attempts}/${maxAttempts} - Containers not ready yet...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('❌ Timeout: Docker containers did not start within 30 seconds');
  return false;
}

async function main() {
  const ready = await waitForContainers();
  
  if (!ready) {
    process.exit(1);
  }
  
  console.log('🚀 Ready to start micro frontends!');
}

if (require.main === module) {
  main();
}

module.exports = { waitForContainers }; 