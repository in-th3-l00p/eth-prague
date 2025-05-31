#!/usr/bin/env node

const { exec } = require('child_process');
const { existsSync } = require('fs');
const util = require('util');
const path = require('path');

const execAsync = util.promisify(exec);

const microProjects = [
  'micros/token-generator/vlayer',
  'micros/x-account-proof/vlayer',
  'micros/onramp-proof/vlayer'
];

async function checkBun() {
  try {
    const { stdout } = await execAsync('bun --version');
    console.log('✅ Bun is available:', stdout.trim());
    return true;
  } catch (error) {
    console.log('❌ Bun is not available. Please install bun: https://bun.sh/');
    return false;
  }
}

async function checkDocker() {
  try {
    const { stdout } = await execAsync('docker --version');
    console.log('✅ Docker is available:', stdout.trim());
    return true;
  } catch (error) {
    console.log('❌ Docker is not available. Please install Docker.');
    return false;
  }
}

async function checkMicroProjects() {
  console.log('\n📁 Checking micro projects...');
  
  let allGood = true;
  
  for (const project of microProjects) {
    const packageJsonPath = path.join(project, 'package.json');
    const name = project.split('/')[1]; // e.g., "token-generator"
    
    if (existsSync(packageJsonPath)) {
      console.log(`✅ ${name}: package.json found`);
      
      // Check if node_modules exists or if we need to install dependencies
      const nodeModulesPath = path.join(project, 'node_modules');
      if (!existsSync(nodeModulesPath)) {
        console.log(`⚠️  ${name}: node_modules not found - you may need to run 'bun install'`);
      } else {
        console.log(`✅ ${name}: dependencies installed`);
      }
    } else {
      console.log(`❌ ${name}: package.json not found at ${packageJsonPath}`);
      allGood = false;
    }
  }
  
  return allGood;
}

async function main() {
  console.log('🔍 Checking development dependencies...\n');
  
  const bunOk = await checkBun();
  const dockerOk = await checkDocker();
  const projectsOk = await checkMicroProjects();
  
  console.log('\n📋 Summary:');
  
  if (bunOk && dockerOk && projectsOk) {
    console.log('✅ All dependencies are ready!');
    console.log('\n🚀 You can run:');
    console.log('   npm run dev     - Start everything');
    console.log('   npm run restart - Clean and restart');
    return true;
  } else {
    console.log('❌ Some dependencies are missing. Please install them before continuing.');
    return false;
  }
}

if (require.main === module) {
  main().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { checkBun, checkDocker, checkMicroProjects }; 