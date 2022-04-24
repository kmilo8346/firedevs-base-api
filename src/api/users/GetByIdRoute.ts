import { ApiKoaRoute } from 'eureka-koa-server-plugin';
import { RouteGenerator, JwtAuthenticationIdentity, IContextWithParams, } from 'eureka-koa-server-plugin';

import UserClient from '../../clients/UserClient';

export default class CreateRoute extends ApiKoaRoute {
  canAccess(ctx: IContextWithParams, user: JwtAuthenticationIdentity): boolean {
    return user.isAuthenticated();
  }

  async register(router: RouteGenerator): Promise<void> {
    router.get('/:id', async (ctx: IContextWithParams) => {
      try {
        const response = await UserClient.getById(ctx.params.customer);
    
        ctx.body = response;
        ctx.status = 200;
      } catch (ex) {
        this.parseExceptionToKoa(ctx, ex as Error);
      }
    });
  }
}
