import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): unknown => {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext() as { req?: { user?: unknown } };
    return gqlContext.req?.user;
  },
);
