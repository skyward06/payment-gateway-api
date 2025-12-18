const getEnvConfig = () => {
  const env = process.env.NODE_ENV || 'development';

  const baseConfig = {
    name: 'minetxc-api',
    script: 'dist/src/index.js',
    exec_mode: 'cluster',
    instance_var: 'INSTANCE_ID',
    time: true,
    wait_ready: true,
    kill_timeout: 5000,
    listen_timeout: 8000,
    ignore_watch: ['node_modules', 'logs', 'dist'],
    env_file: '.env',
    env: {
      APP_HOST: '127.0.0.1',
      APP_PORT: 4000,
    },
  };

  const envConfigs = {
    development: {
      ...baseConfig,
      name: 'minetxc-api-dev',
      script: 'ts-node',
      args: '-r tsconfig-paths/register src/index.ts',
      instances: 1,
      watch: true,
      max_memory_restart: '2G',
      max_restarts: 3,
      min_uptime: '5s',
      autorestart: true,
      env: {
        NODE_ENV: 'development',
        APP_HOST: '127.0.0.1',
        APP_PORT: 4000,
      },
    },

    staging: {
      ...baseConfig,
      name: 'minetxc-api-staging',
      instances: 1,
      watch: false,
      max_memory_restart: '1G',
      max_restarts: 5,
      min_uptime: '10s',
      env: {
        NODE_ENV: 'staging',
        APP_HOST: '127.0.0.1',
        APP_PORT: 4001,
      },
      env_staging: {
        NODE_ENV: 'staging',
        APP_HOST: '127.0.0.1',
        APP_PORT: 4001,
      },
    },

    production: {
      ...baseConfig,
      name: 'minetxc-api',
      instances: 4,
      watch: false,
      max_memory_restart: '4G',
      max_restarts: 10,
      min_uptime: '30s',
      env: {
        NODE_ENV: 'production',
        APP_HOST: '127.0.0.1',
        APP_PORT: 4000,
      },
      env_production: {
        NODE_ENV: 'production',
        APP_HOST: '127.0.0.1',
        APP_PORT: 4000,
      },
    },
  };

  return envConfigs[env] || envConfigs.development;
};

module.exports = {
  apps: [getEnvConfig()],
};
