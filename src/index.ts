import 'dotenv/config';
import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import * as tq from 'type-graphql';
import { Container } from 'typedi';

import { authChecker } from './authChecker';
import { Context, context } from './context';

// Import resolvers
import { AdminResolver } from './entity/admin/admin.resolver';
import { ApiKeyResolver } from './entity/apiKey/apiKey.resolver';
import { MerchantResolver } from './entity/merchant/merchant.resolver';
import { PaymentResolver } from './entity/payment/payment.resolver';

// Import enum registrations
import './graphql/enum';

const APP_PORT = process.env.APP_PORT || 4000;
const APP_HOST = process.env.APP_HOST || '127.0.0.1';

async function bootstrap() {
  const app = express();
  const httpServer = createServer(app);

  // Build GraphQL schema
  const schema = await tq.buildSchema({
    resolvers: [AdminResolver, MerchantResolver, ApiKeyResolver, PaymentResolver],
    container: Container,
    authChecker,
    validate: { forbidUnknownValues: false },
  });

  // Create Apollo Server
  const server = new ApolloServer<Context>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true,
  });

  await server.start();

  // Middleware
  app.use(cors());
  app.use(bodyParser.json({ limit: '50mb' }));

  // Health check endpoint
  app.get('/health', (_, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Temporary webhook test endpoint
  app.post('/webhook-test', (req, res) => {
    console.log('='.repeat(60));
    console.log('📥 WEBHOOK RECEIVED:', new Date().toISOString());
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('='.repeat(60));
    res.json({ success: true, message: 'Webhook received', timestamp: new Date().toISOString() });
  });

  // GraphQL endpoint
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => context({ req }),
    })
  );

  // Start server
  httpServer.listen(+APP_PORT, APP_HOST, () => {
    console.log(`🚀 Server ready at http://${APP_HOST}:${APP_PORT}/graphql`);
    console.log(`📊 Health check at http://${APP_HOST}:${APP_PORT}/health`);
  });
}

bootstrap().catch(console.error);
