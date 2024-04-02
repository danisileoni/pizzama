import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  if (!user) {
    throw new InternalServerErrorException('User not found (request)');
  }

  const userData = {
    id: user.id,
    user: user.user,
    fullName: user.fullName,
    roles: user.roles,
  };

  return !data ? userData : userData[data];
});
