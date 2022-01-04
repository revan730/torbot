import { SceneContextMessageUpdate } from 'telegraf/typings/stage';


const adminIds = process.env.ADMIN_IDS.split(',').map(i => Number(i));
/**
 * Checks whether user is admin and can access restricted areas
 * @param ctx - telegram context
 * @param next - next function
 */
export const isAdmin = async (ctx: SceneContextMessageUpdate, next: Function) => {
    if (adminIds.indexOf(ctx.chat?.id) === -1) {
        return ctx.reply('Доступ запрещен');
    }
    return next();
};
