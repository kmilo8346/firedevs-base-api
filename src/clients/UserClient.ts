import { Logger } from 'eureka-plugins';
import { KoaErrors, IArrayRestResponse } from 'eureka-koa-server-plugin';

import { IUser, UserModel } from '../models/IUser';

export interface IListParams {
    query?: { [key: string]: any };
    offset?: number;
    limit?: number;
    sort?: { [key: string]: 'asc' | 'desc' };
    source?: string[];
}

const prefix = '[user-client]';

/**
 * Client to manage users
 * 
 * @class UserClient
 */
class UserClient {

    /**
     * Get a user by id
     * @param id User id
     * @returns {Promise<IUser>}
     * @memberof UserClient
     */
    async getById(id: string): Promise<IUser> {
        try {
            return {
                id,
                email: 'kmilo8346@gmail.com',
                password: '123456',
                full_name: 'Camilo Cabrera',
                roles: [],
                created_at: new Date(),
                updated_at: new Date(),
            }
        } catch (error) {
            if (!KoaErrors.isBoom(error as Error)) {
                const message = 'Unexpected error has occurred trying get a user by id';
                Logger.debug(`${prefix} ${message}`, { id });
                Logger.error(`${prefix} ${message}`, error);
                throw KoaErrors.internal(message);
            }

            throw error;
        }
    }

    /**
     * List users
     * @returns {Promise<IArrayRestResponse<IUser>>}
     * @memberof UserClient
     */
    async list(params: IListParams): Promise<IArrayRestResponse<IUser>> {
        try {
            return {
                offset: 0,
                limit: 10,
                total: 1,
                data: [{
                    id: '1',
                    email: 'kmilo8346@gmail.com',
                    password: '123456',
                    full_name: 'Camilo Cabrera',
                    roles: [],
                    created_at: new Date(),
                    updated_at: new Date(),
                }], 
            }
        } catch (error) {
            if (!KoaErrors.isBoom(error as Error)) {
                const message = 'Unexpected error has occurred trying to list users using params';
                Logger.debug(`${prefix} ${message}`, { params });
                Logger.error(`${prefix} ${message}`, error);
                throw KoaErrors.internal(message);
            }

            throw error;
        }
    }

    /**
     * Create a new user
     * @param data User data
     * @returns {Promise<IUser>}
     * @memberof UserClient
     */
    async create(data: IUser): Promise<IUser> {
        try {
            const IModel = new UserModel(data);
            const hasErrors = IModel.validateSync();
            if (hasErrors) {
                throw KoaErrors.badRequest(hasErrors.message);
            }

            return IModel.toJSON();
        } catch (error) {
            if (!KoaErrors.isBoom(error as Error)) {
                const message = 'Unexpected error has occurred trying to create a user';
                Logger.debug(`${prefix} ${message}`, { data });
                Logger.error(`${prefix} ${message}`, error);
                throw KoaErrors.internal(message);
              }
        
            throw error;
        }
    }

    /**
     * Update user
     * @param data User data
     * @returns {Promise<IUser>}
     * @memberof UserClient
     */
    async update(id: string, data: Partial<IUser>): Promise<Partial<IUser>> {
        try {
            return {
                id,
                ...data
            }
        } catch (error) {
            if (!KoaErrors.isBoom(error as Error)) {
                const message = 'Unexpected error has occurred trying to update a user';
                Logger.debug(`${prefix} ${message}`, { id, data });
                Logger.error(`${prefix} ${message}`, error);
                throw KoaErrors.internal(message);
            }

            throw error;
        }
    }

    /**
     * Remove a user
     * @param id User id
     * @returns {Promise<void>}
     * @memberof UserClient
     */
    async remove(id: string): Promise<void> {
        try {
            Logger.info(`${prefix} User ${id} removed`);
        } catch (error) {
            if (!KoaErrors.isBoom(error as Error)) {
                const message = 'Unexpected error has occurred trying to remove a user';
                Logger.debug(`${prefix} ${message}`, { id });
                Logger.error(`${prefix} ${message}`, error);
                throw KoaErrors.internal(message);
            }

            throw error;
        }
    }

}

export default new UserClient();