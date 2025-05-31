#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const MICROS_DIR = path.join(__dirname, '..', 'micros');

function getMicroDirectories() {
  try {
    return fs.readdirSync(MICROS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (error) {
    console.error('Error reading micros directory:', error.message);
    process.exit(1);
  }
}

function runForgeBuild(microName, microPath) {
  console.log(`\n📦 Building ${microName} with forge...`);
  try {
    execSync('forge build', {
      cwd: microPath,
      stdio: 'inherit'
    });
    console.log(`✅ Forge build completed for ${microName}`);
  } catch (error) {
    console.error(`❌ Forge build failed for ${microName}:`, error.message);
    throw error;
  }
}

function runBunInstall(microName, vlayerPath) {
  console.log(`\n📦 Installing dependencies for ${microName}...`);
  try {
    execSync('bun install', {
      cwd: vlayerPath,
      stdio: 'inherit'
    });
    console.log(`✅ Dependencies installed for ${microName}`);
  } catch (error) {
    console.error(`❌ Bun install failed for ${microName}:`, error.message);
    throw error;
  }
}

function startDevServer(microName, vlayerPath, color) {
  console.log(`\n🚀 Starting dev server for ${microName}...`);
  
  const devProcess = spawn('bun', ['run', 'web:dev'], {
    cwd: vlayerPath,
    stdio: 'pipe',
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  // Color codes for different micros
  const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
  };

  const colorCode = colors[color] || colors.white;
  
  devProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${colorCode}[${microName}]${colors.reset} ${line}`);
      }
    });
  });

  devProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.error(`${colorCode}[${microName}]${colors.reset} ${line}`);
      }
    });
  });

  devProcess.on('close', (code) => {
    console.log(`${colorCode}[${microName}]${colors.reset} Process exited with code ${code}`);
  });

  return devProcess;
}

async function main() {
  console.log('🔍 Discovering micro services...');
  
  const microDirectories = getMicroDirectories();
  console.log(`Found ${microDirectories.length} micro services: ${microDirectories.join(', ')}`);

  const devProcesses = [];
  const availableColors = ['cyan', 'magenta', 'yellow', 'green', 'blue', 'red'];

  for (let i = 0; i < microDirectories.length; i++) {
    const microName = microDirectories[i];
    const microPath = path.join(MICROS_DIR, microName);
    const vlayerPath = path.join(microPath, 'vlayer');

    console.log(`\n🔧 Processing ${microName}...`);

    // Check if vlayer directory exists
    if (!fs.existsSync(vlayerPath)) {
      console.warn(`⚠️  No vlayer directory found for ${microName}, skipping...`);
      continue;
    }

    // Check if vlayer has package.json
    const packageJsonPath = path.join(vlayerPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.warn(`⚠️  No package.json found in vlayer directory for ${microName}, skipping...`);
      continue;
    }

    try {
      // Step 1: Run forge build
      runForgeBuild(microName, microPath);

      // Step 2: Run bun install
      runBunInstall(microName, vlayerPath);

      // Step 3: Start dev server
      const color = availableColors[i % availableColors.length];
      const devProcess = startDevServer(microName, vlayerPath, color);
      devProcesses.push({ name: microName, process: devProcess });

    } catch (error) {
      console.error(`❌ Failed to process ${microName}, continuing with other micros...`);
      continue;
    }
  }

  if (devProcesses.length === 0) {
    console.log('❌ No dev servers started. Check your micro configurations.');
    process.exit(1);
  }

  console.log(`\n🎉 Started ${devProcesses.length} dev servers successfully!`);
  console.log('Press Ctrl+C to stop all servers...\n');

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down all dev servers...');
    devProcesses.forEach(({ name, process }) => {
      console.log(`Stopping ${name}...`);
      process.kill('SIGTERM');
    });
    process.exit(0);
  });

  // Keep the main process alive
  process.stdin.resume();
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
} 