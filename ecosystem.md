# 🚀 Ecosystem Configuration & PM2 Management Guide

## 📋 Overview

The updated `ecosystem.config.js` now supports environment-specific configurations for development, staging, and production environments with optimized settings for each mode. Each environment uses distinct app names to prevent conflicts and enable simultaneous operation.

**Logging**: The project uses PM2 logrotate for automatic log rotation and compression, providing better performance than Winston file transports.

## 🔧 Application Names by Environment

- **Development**: `minetxc-api-dev`
- **Staging**: `minetxc-api-staging`
- **Production**: `minetxc-api-prod`

## 🎯 Environment Configurations

### Development Mode

- **App Name**: `minetxc-api-dev`
- **Instances**: 1 (single worker for easier debugging)
- **Port**: 4000
- **Watch**: `true` (auto-restart on file changes)
- **Memory Limit**: 500MB
- **Max Restarts**: 3
- **Min Uptime**: 5 seconds
- **Logs**: `logs/development/`

### Staging Mode

- **App Name**: `minetxc-api-staging`
- **Instances**: 2 (moderate load testing)
- **Port**: 4001
- **Watch**: `false` (stable configuration)
- **Memory Limit**: 1GB
- **Max Restarts**: 5
- **Min Uptime**: 10 seconds
- **Logs**: `logs/staging/`

### Production Mode

- **App Name**: `minetxc-api-prod`
- **Instances**: 4 (optimized for performance)
- **Port**: 4000
- **Watch**: `false` (stable configuration)
- **Memory Limit**: 2GB
- **Max Restarts**: 10
- **Min Uptime**: 30 seconds
- **Logs**: `logs/production/`

## 📊 Environment Configuration Summary

| Environment | App Name            | Instances | Port | Watch | Memory Limit |
| ----------- | ------------------- | --------- | ---- | ----- | ------------ |
| Development | minetxc-api-dev     | 1         | 4000 | ✅    | 500M         |
| Staging     | minetxc-api-staging | 2         | 4001 | ❌    | 1G           |
| Production  | minetxc-api-prod    | 4         | 4000 | ❌    | 2G           |

## 🔧 Available Commands by Environment

**Note**: All PM2 management commands now use the `pm2 [action] ecosystem.config.js` format with environment detection, providing better maintainability and consistency.

### **Development Environment**

```bash
# Start development server
npm run start:dev         # NODE_ENV=development pm2 start ecosystem.config.js

# Management commands
npm run stop:dev          # NODE_ENV=development pm2 stop ecosystem.config.js
npm run restart:dev       # NODE_ENV=development pm2 restart ecosystem.config.js
npm run reload:dev        # NODE_ENV=development pm2 reload ecosystem.config.js
npm run delete:dev        # NODE_ENV=development pm2 delete ecosystem.config.js
npm run logs:dev          # NODE_ENV=development pm2 logs ecosystem.config.js --lines 100

# Direct PM2 commands
pm2 status                    # Check all processes
pm2 logs minetxc-api-dev     # View development logs
pm2 describe minetxc-api-dev # Detailed process info
```

### **Staging Environment**

```bash
# Start staging server
npm run start:staging     # NODE_ENV=staging pm2 start ecosystem.config.js

# Management commands
npm run stop:staging      # NODE_ENV=staging pm2 stop ecosystem.config.js
npm run restart:staging   # NODE_ENV=staging pm2 restart ecosystem.config.js
npm run reload:staging    # NODE_ENV=staging pm2 reload ecosystem.config.js
npm run delete:staging    # NODE_ENV=staging pm2 delete ecosystem.config.js
npm run logs:staging      # NODE_ENV=staging pm2 logs ecosystem.config.js --lines 100

# Direct PM2 commands
pm2 logs minetxc-api-staging     # View staging logs
pm2 describe minetxc-api-staging # Detailed process info
```

### **Production Environment**

```bash
# Start production server
npm run start:prod        # NODE_ENV=production pm2 start ecosystem.config.js

# Management commands
npm run stop:prod         # NODE_ENV=production pm2 stop ecosystem.config.js
npm run restart:prod      # NODE_ENV=production pm2 restart ecosystem.config.js
npm run reload:prod       # NODE_ENV=production pm2 reload ecosystem.config.js
npm run delete:prod       # NODE_ENV=production pm2 delete ecosystem.config.js
npm run logs:prod         # NODE_ENV=production pm2 logs ecosystem.config.js --lines 100

# Direct PM2 commands
pm2 logs minetxc-api-prod     # View production logs
pm2 describe minetxc-api-prod # Detailed process info
```

### **Script Format Benefits**

1. **Centralized Management**: App names only maintained in `ecosystem.config.js`
2. **Consistency**: All commands use the same ecosystem config approach
3. **Maintainability**: No duplicate app name references in `package.json`
4. **PM2 Best Practice**: Follows standard PM2 config-based management
5. **Flexibility**: Environment detection handled by the config file

## 🚀 Quick Start Examples

```bash
# Start development environment
npm run start:dev

# Check if it's running
pm2 status

# View logs
npm run logs:dev

# Stop when done
npm run delete:dev
```

## 🔧 Legacy Commands (Still Available)

```bash
# Default (uses current NODE_ENV)
npm run start:cluster

# Generic commands (work with environment-specific apps)
npm run status    # Check status of all processes
npm run monit     # Monitor resources across all apps
```

## 📊 Cluster Features

### RabbitMQ Consumer Distribution

- **Main Worker (ID: 0)**: Handles RabbitMQ message consumption
- **Other Workers**: Handle API requests and can publish to RabbitMQ
- **Load Balancing**: PM2 automatically distributes HTTP requests across all workers

### Logging Structure

```
~/.pm2/logs/
├── minetxc-api-dev-out-{id}.log          # Current stdout (development)
├── minetxc-api-dev-error-{id}.log        # Current stderr (development)
├── minetxc-api-dev-out__YYYY-MM-DD.log.gz     # Rotated stdout (compressed)
├── minetxc-api-dev-error__YYYY-MM-DD.log.gz   # Rotated stderr (compressed)
├── minetxc-api-staging-out-{id}.log      # Current stdout (staging)
├── minetxc-api-staging-error-{id}.log    # Current stderr (staging)
├── minetxc-api-prod-out-{id}.log         # Current stdout (production)
├── minetxc-api-prod-error-{id}.log       # Current stderr (production)
└── ... (compressed rotated files)
```

**PM2 Logrotate Features:**

- **Automatic rotation**: Daily at midnight + when files exceed 20MB
- **Compression**: gzip compression of rotated files
- **Retention**: 30 rotated files kept per application
- **Zero downtime**: No application restart required

## 🔄 Environment Variables

The configuration automatically detects the environment using `NODE_ENV`:

```bash
NODE_ENV=development  # Uses development config
NODE_ENV=staging      # Uses staging config
NODE_ENV=production   # Uses production config
```

## 📈 Monitoring

### Real-time Monitoring

```bash
# View PM2 dashboard
pm2 monit

# Check application status (all environments)
pm2 status

# View specific process details
pm2 describe minetxc-api-dev      # Development
pm2 describe minetxc-api-staging  # Staging
pm2 describe minetxc-api-prod     # Production
```

### Log Monitoring

```bash
# Tail logs in real-time (environment-specific)
pm2 logs minetxc-api-dev      # Development logs
pm2 logs minetxc-api-staging  # Staging logs
pm2 logs minetxc-api-prod     # Production logs

# View specific number of lines
pm2 logs minetxc-api-dev --lines 100

# View logs for specific instance
pm2 logs minetxc-api-dev:0
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # For development
   npm run delete:dev
   npm run start:dev

   # For staging
   npm run delete:staging
   npm run start:staging

   # For production
   npm run delete:prod
   npm run start:prod
   ```

2. **Memory Issues**

   ```bash
   # Restart specific environment
   npm run restart:dev      # Development
   npm run restart:staging  # Staging
   npm run restart:prod     # Production
   ```

3. **Check Worker Distribution**

   ```bash
   pm2 logs minetxc-api-dev | grep "Worker"      # Development
   pm2 logs minetxc-api-staging | grep "Worker"  # Staging
   pm2 logs minetxc-api-prod | grep "Worker"     # Production
   ```

4. **App Name Conflicts**

   ```bash
   # Check current processes
   pm2 status

   # Delete all processes if needed
   pm2 delete all

   # Rebuild and restart
   npm run build
   npm run start:dev
   ```

### Health Checks

- **Min Uptime**: Ensures process stability before marking as ready
- **Max Restarts**: Prevents infinite restart loops
- **Memory Restart**: Automatically restarts on memory leaks
- **Wait Ready**: Waits for application to signal readiness

## 📝 Benefits of Environment-Specific Names

1. **No Conflicts**: Can run multiple environments simultaneously
2. **Clear Identification**: Easy to see which environment is running
3. **Environment Isolation**: Staging won't interfere with development
4. **Simplified Deployment**: Each environment has its own process management
5. **Independent Scaling**: Each environment can have different instance counts
6. **Targeted Operations**: Operations affect only the intended environment

## 🎯 Best Practices

1. **Development**: Use `npm run start:dev` for local development with file watching
2. **Testing**: Use `npm run start:staging` to test with multiple workers
3. **Production**: Use `npm run start:prod` for maximum performance
4. **Monitoring**: Regularly check `pm2 monit` for resource usage across all environments
5. **Logs**: Use environment-specific log directories for better organization
6. **Environment Isolation**: Always use environment-specific commands to avoid cross-environment interference
7. **Process Management**: Use `npm run delete:env` before starting a new environment to ensure clean state

## 🔒 Security Notes

- Production mode disables introspection in Apollo GraphQL
- Environment-specific configurations prevent development settings in production
- Graceful shutdown handling ensures clean process termination
- Memory limits prevent resource exhaustion attacks
