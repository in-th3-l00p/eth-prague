# ZKProofs Development Manager

This npm project manages the Docker containers and micro frontend applications for the zkproofs development environment.

## Prerequisites

- Node.js 16+ and npm
- Docker and Docker Compose
- Bun (for the micro projects)

## Setup

First, install the dependencies:

```bash
npm install
```

Check if all dependencies are ready:

```bash
npm run check
```

## Available Commands

### Setup & Diagnostics

- `npm run check` - Verify all dependencies (bun, docker, micro projects) are ready

### Development

- `npm run dev` - Start Docker containers, wait for readiness, then start all micro frontends
- `npm run dev:concurrent` - Alternative: run everything concurrently with colored output
- `npm run restart` - Clean all containers and restart everything
- `npm run stop` - Stop Docker containers

### Docker Management

- `npm run docker:up` - Start Docker containers in detached mode
- `npm run docker:down` - Stop Docker containers
- `npm run docker:logs` - View Docker container logs
- `npm run docker:status` - Show running container status
- `npm run clean` - Remove all Docker containers (force)

### Micro Frontends

- `npm run micros:dev` - Run all three micro frontends in development mode

## Project Structure

The following micro frontends will be started:

1. **token-generator** (`micros/token-generator/vlayer/`) - Token generation frontend
2. **x-account-proof** (`micros/x-account-proof/vlayer/`) - X account proof frontend  
3. **onramp-proof** (`micros/onramp-proof/vlayer/`) - X onramp proof frontend

Each micro frontend runs the `bun run web:dev` command and will be accessible on different ports.

## Development Workflow

### First Time Setup
```bash
npm install
npm run check  # Verify dependencies
```

### Option 1: Sequential (Recommended)
```bash
npm run dev
```
- Starts Docker containers
- Waits for containers to be ready (up to 30 seconds)
- Shows container status
- Starts all three micro frontends concurrently

### Option 2: Concurrent
```bash
npm run dev:concurrent
```
- Runs everything in parallel with colored output
- May start micro frontends before containers are fully ready

### Restart Everything
```bash
npm run restart
```
- Removes all Docker containers
- Starts everything fresh

### Stop Development
```bash
npm run stop
```
- Gracefully stops Docker containers

## Smart Container Waiting

The `scripts/wait-for-docker.js` script intelligently waits for Docker containers to be ready:

- ✅ Checks every second for container status
- ⏳ Maximum wait time of 30 seconds
- 📋 Shows container status when ready
- ❌ Exits with error if containers don't start

## Dependency Checking

The `scripts/check-dependencies.js` script verifies your environment:

- 🔍 Checks if Bun is installed and accessible
- 🐳 Verifies Docker is available
- 📁 Confirms all micro projects have package.json files
- ⚠️ Warns if node_modules are missing (run `bun install` in those directories)

## Output

The `concurrently` package provides colored output for each service:
- **token-gen**: Cyan
- **x-account**: Magenta
- **onramp**: Yellow

## Troubleshooting

- **First step**: Run `npm run check` to diagnose issues
- If containers fail to start, try `npm run restart`
- Check Docker logs with `npm run docker:logs`
- View container status with `npm run docker:status`
- Ensure all required ports are available
- Make sure bun is installed and accessible in your PATH
- If the wait script times out, check Docker daemon is running
- If a micro project fails to start, cd into its vlayer directory and run `bun install`

## Ports

Each micro frontend will run on different ports (usually 5173, 5174, 5175, etc.). Check the output when starting to see the exact URLs. 