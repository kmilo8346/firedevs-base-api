import { IApplication } from '../models/IApplication';

import { IContextWithParams } from 'eureka-koa-server-plugin';

/**
 * 
 * @class Utils
 */
class Utils {

    /**
     * Sleep the execution n time
     * @param time Time to wait before continue
     * @returns {Promise<void>}
     * @memberof Utils
     */
    async sleep(time: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, time))
    }

    /**
     * Get a application object using a JWT in the header
     * @param ctx 
     * @returns {IApplication}
     * @memberof Utils
     */
    getApplicationFromJWT(ctx: IContextWithParams): IApplication {
        const jwtPayload = (ctx.state.user as any)._payload;
        return {
          id: jwtPayload.primarysid,
          name: jwtPayload.unique_name
        };
    }

}

export default new Utils()