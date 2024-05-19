import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type LoggedUserInfo = {
  id: string;
};

type LoggedUserResponseType = LoggedUserInfo[keyof LoggedUserInfo];

export const LoggedUser = createParamDecorator(
  (
    data: keyof LoggedUserInfo,
    ctx: ExecutionContext,
  ): LoggedUserResponseType | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user = request['user'] as LoggedUserInfo | undefined;

    return user?.[data];
  },
);
