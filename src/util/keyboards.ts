import { Markup } from 'telegraf';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { BackKeyboard, MainKeyboard } from '../constants';

export const getBackKeyboard = (ctx: SceneContextMessageUpdate) => {
    const backKeyboardBack = BackKeyboard.BACK;
    let backKeyboard: any = Markup.keyboard([backKeyboardBack]);

    backKeyboard = backKeyboard.resize().extra();

    return {
        backKeyboard,
        backKeyboardBack
    };
};

export const getMainKeyboard = (ctx: SceneContextMessageUpdate) => {

    let mainKeyboard: any = Markup.keyboard([
        [MainKeyboard.START_SERVER],
        [MainKeyboard.STOP_SERVER],
        [MainKeyboard.STATUS],
    ]);
    mainKeyboard = mainKeyboard.resize().extra();

    return {
        mainKeyboard,
    };
};
