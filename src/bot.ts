import * as process from 'process';
import { session, Stage, Context, Telegraf } from 'telegraf';
import logger from './util/logger';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { BackKeyboard, MainKeyboard, WHAT_NEXT } from './constants';
import asyncWrapper from './util/error.handler';
import { getMainKeyboard } from './util';
import startScene from './controllers/start';
import { isAdmin } from './middlewares/isAdmin';
import { serverStatus, startServer, stopServer } from './controllers/admin';

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const stage = new Stage([
    startScene,
]);

bot.use(session());
bot.use(stage.middleware());
bot.use(isAdmin);
// bot.use(getUserInfo);

bot.command('saveme', async (ctx: SceneContextMessageUpdate) => {
    logger.debug(ctx, 'User uses /saveme command');

    const { mainKeyboard } = getMainKeyboard(ctx);
    await ctx.reply(WHAT_NEXT, mainKeyboard);
});
bot.start(asyncWrapper(async (ctx: SceneContextMessageUpdate) => ctx.scene.enter('start')));
bot.hears(
    MainKeyboard.START_SERVER,
    asyncWrapper(async (ctx: SceneContextMessageUpdate) => startServer(ctx))
);
bot.hears(
    MainKeyboard.STOP_SERVER,
    asyncWrapper(async (ctx: SceneContextMessageUpdate) => stopServer(ctx))
);
bot.hears(
    MainKeyboard.STATUS,
    asyncWrapper(async (ctx: SceneContextMessageUpdate) => serverStatus(ctx))
);
bot.hears(
    BackKeyboard.BACK,
    asyncWrapper(async (ctx: SceneContextMessageUpdate) => {
        // If this method was triggered, it means that bot was updated when user was not in the main menu..
        logger.debug(ctx, 'Return to the main menu with the back button');
        const { mainKeyboard } = getMainKeyboard(ctx);

        await ctx.reply(WHAT_NEXT, mainKeyboard);
    })
);


bot.hears(/(.*?)/, async (ctx: SceneContextMessageUpdate) => {
    logger.debug(ctx, 'Default handler has fired');

    const { mainKeyboard } = getMainKeyboard(ctx);
    await ctx.reply(WHAT_NEXT, mainKeyboard);
});

bot.catch((error: any) => {
    logger.error(undefined, 'Global error has happened, %O', error);
});

start(bot);

async function start(bot: Telegraf<Context>) {
    logger.debug(undefined, 'Starting bot');

    await bot.startPolling();
}
