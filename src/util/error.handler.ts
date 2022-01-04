import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import logger from './logger';
import { SOMETHING_WENT_WRONG } from '../constants';

/**
 * Wrapper to catch async errors within a stage. Helps to avoid try catch blocks in there
 * @param fn - function to enter a stage
 */
const asyncWrapper = (fn: Function) => {
    return async function(ctx: SceneContextMessageUpdate, next: Function) {
        try {
            return await fn(ctx);
        } catch (error) {
            logger.error(ctx, 'asyncWrapper error, %O', error);
            await ctx.reply(SOMETHING_WENT_WRONG);
            return next();
        }
    };
};

export default asyncWrapper;
