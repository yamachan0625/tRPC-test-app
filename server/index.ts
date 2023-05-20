import express from 'express';
import { initTRPC, inferAsyncReturnType } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import z from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type Context = inferAsyncReturnType<typeof createContext>;
const createContext = (opts: trpcExpress.CreateExpressContextOptions) => {
  console.log(opts.req.headers);

  return { prisma, host: opts.req.headers.host };
};

const app = express();
const PORT = 5000;

const t = initTRPC.context<Context>().create();

const appRouter = t.router({
  hello: t.procedure.query(() => {
    return 'Hello World';
  }),
  helloName: t.procedure
    .input(z.object({ name: z.string(), age: z.number() }))
    .query(({ input }) => {
      return {
        greeting: `Hello World ${input.name}`,
        age: input.age as 10,
      };
    }),
  todos: t.procedure.query(async ({ ctx }) => {
    const todos = await ctx.prisma.todo.findMany();
    return { todos, host: ctx.host };
  }),
  addTodo: t.procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.create({
        data: input,
      });
      return todo;
    }),
});

app.use(cors());
app.get('/', (_req, res) => res.send('hello')); //削除可能

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

export type AppRouter = typeof appRouter;
