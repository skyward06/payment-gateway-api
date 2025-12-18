# TXC Backend - Cluster Mode with RabbitMQ

This project now supports PM2 cluster mode with intelligent RabbitMQ queue distribution.

## Key Features

✅ **Cluster-Aware RabbitMQ**: Only the main cluster (worker 0) consumes RabbitMQ queues  
✅ **Publisher Distribution**: All workers can publish messages to RabbitMQ  
✅ **Graceful Shutdown**: Proper cleanup on process termination  
✅ **Worker Identification**: Each worker has unique logging and identification  
✅ **Resource Optimization**: Prevents duplicate queue consumers

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Worker 0      │    │   Worker 1      │    │   Worker N      │
│ (Main Cluster)  │    │                 │    │                 │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ GraphQL API ✓   │    │ GraphQL API ✓   │    │ GraphQL API ✓   │
│ REST API ✓      │    │ REST API ✓      │    │ REST API ✓      │
│ RabbitMQ Pub ✓  │    │ RabbitMQ Pub ✓  │    │ RabbitMQ Pub ✓  │
│ RabbitMQ Con ✓  │    │ RabbitMQ Con ✗  │    │ RabbitMQ Con ✗  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   RabbitMQ      │
                    │   Email Queue   │
                    └─────────────────┘
```

## Usage

### Development

```bash
# Run in development mode (single worker)
npm run dev

# Run in development mode with TypeScript watch
npm run start:dev
```

### Production with PM2 Cluster

```bash
# Build the project
npm run build

# Start in cluster mode (uses all CPU cores)
npm run start:cluster

# Start with specific number of workers
pm2 start ecosystem.config.js --instances 4

# Monitor all workers
npm run monit

# View logs from all workers
npm run logs

# Restart all workers (zero downtime)
npm run restart

# Graceful reload (zero downtime with new code)
npm run reload

# Stop all workers
npm run stop

# Remove from PM2
npm run delete
```

### Direct PM2 Commands

```bash
# Start with auto-detection of CPU cores
pm2 start ecosystem.config.js

# Start with specific instances
pm2 start ecosystem.config.js --instances 4

# Start in maximum mode (all CPU cores)
pm2 start ecosystem.config.js --instances max

# Monitor in real-time
pm2 monit

# Show process list
pm2 list

# Show logs
pm2 logs txc-backend

# Restart specific app
pm2 restart txc-backend

# Stop specific app
pm2 stop txc-backend

# Delete app from PM2
pm2 delete txc-backend
```

## Configuration

### Environment Variables

The application uses these environment variables for cluster detection:

- `NODE_APP_INSTANCE`: PM2 worker instance ID (0, 1, 2, ...)
- `INSTANCE_ID`: Alternative instance identifier
- `instances`: Total number of instances

### PM2 Configuration (ecosystem.config.js)

```javascript
module.exports = {
  apps: [
    {
      name: 'txc-backend',
      script: 'dist/index.js',
      instances: 'max', // or specific number
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 8000,
    },
  ],
};
```

## Cluster Utilities

The `ClusterUtils` class provides helper methods:

```typescript
import { ClusterUtils } from './utils/cluster';

// Check if current process is main cluster
const isMain = ClusterUtils.isMainCluster(); // true for worker 0

// Get current worker ID
const workerId = ClusterUtils.getWorkerId(); // "0", "1", "2", etc.

// Execute only on main cluster
ClusterUtils.executeOnMainCluster(() => {
  console.log('This runs only on worker 0');
});

// Cluster-aware logging
ClusterUtils.log('This message includes worker ID');
ClusterUtils.error('This error includes worker ID');
```

## RabbitMQ Behavior

### Publisher Service (All Workers)

- All workers can publish messages to RabbitMQ
- Messages are queued for processing by the main cluster
- No duplication of messages

### Consumer Service (Main Cluster Only)

- Only worker 0 consumes messages from RabbitMQ queues
- Prevents duplicate processing of the same message
- Ensures single-threaded email processing
- Respects AWS SES rate limits

## Logging

Logs are categorized by worker:

- `👑 Main Worker 0`: Messages from the main cluster
- `👷 Worker 1`: Messages from worker clusters

## Health Monitoring

PM2 provides built-in health monitoring:

- Automatic restart on crashes
- Memory usage monitoring
- CPU usage tracking
- Process uptime tracking

## Troubleshooting

### Check if cluster is working:

```bash
pm2 list
```

### View real-time logs:

```bash
pm2 logs --lines 100
```

### Check specific worker logs:

```bash
pm2 logs txc-backend --lines 50
```

### Monitor performance:

```bash
pm2 monit
```

### Reset PM2 (if needed):

```bash
pm2 kill
pm2 resurrect
```

## Production Deployment

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Start PM2 cluster:**

   ```bash
   npm run start:cluster
   ```

3. **Verify all workers are running:**

   ```bash
   pm2 list
   ```

4. **Monitor logs for RabbitMQ initialization:**
   ```bash
   npm run logs
   ```

Look for these log messages:

- `👑 Main Worker 0: RabbitMQ Consumer initialized on main cluster`
- `👷 Worker 1: RabbitMQ Consumer skipped on worker cluster`

This ensures that only the main cluster is consuming RabbitMQ messages while all workers can handle API requests and publish messages.
