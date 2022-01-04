import { BaseScene } from 'telegraf';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { getMainKeyboard } from '../../util';
import { START, WHAT_NEXT } from '../../constants';

const start = new BaseScene('start');

start.enter(async (ctx: SceneContextMessageUpdate) => {
    const { mainKeyboard } = getMainKeyboard(ctx);

    await ctx.reply(START, mainKeyboard);
});

start.leave(async (ctx: SceneContextMessageUpdate) => {
    const { mainKeyboard } = getMainKeyboard(ctx);

    await ctx.reply(WHAT_NEXT, mainKeyboard);
});

export default start;
