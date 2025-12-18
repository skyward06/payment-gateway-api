import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Service } from 'typedi';

@Service()
export class PrismaService extends PrismaClient<
  {
    log: {
      emit: 'event';
      level: 'query';
    }[];
    transactionOptions: {
      timeout: 20000;
    };
  },
  'query',
  DefaultArgs
> {
  constructor() {
    super({
      log: [{ emit: 'event', level: 'query' }],
      transactionOptions: {
        timeout: 20000,
      },
    });

    const prisma = this;

    // Log queries in development
    // if (process.env.NODE_ENV === 'development') {
    //   prisma.$on('query', (e) => {
    //     console.log(`Query: ${e.query}`);
    //     console.log(`Duration: ${e.duration}ms`);
    //   });
    // }

    const asyncLocalStorage = new AsyncLocalStorage<Prisma.TransactionClient>();

    const prisma$transaction = prisma.$transaction.bind(prisma);
    (prisma as any).$transaction = (...args: any[]) => {
      if (typeof args[0] === 'function') {
        const fn = args[0];
        args[0] = (txClient: Prisma.TransactionClient) => {
          return asyncLocalStorage.run(txClient, () => fn(txClient));
        };
      }

      return (prisma$transaction as any)(...args);
    };

    return new Proxy(prisma, {
      get(_, p, receiver) {
        const client = asyncLocalStorage.getStore() || prisma;
        return Reflect.get(client, p, receiver);
      },
    });
  }
}
