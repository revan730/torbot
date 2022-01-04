import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import * as AWS from 'aws-sdk';

const ec2Client = new AWS.EC2({
  region: 'eu-central-1',
});

const getInstanceInfo = async (): Promise<AWS.EC2.Instance> => {
  const instance = await ec2Client.describeInstances({ Filters: [{
    Name: 'tag-key',
    Values: ['valheimserver'],
  }] }).promise();

  return instance.Reservations[0]?.Instances[0];
};

export const startServer = async (ctx: SceneContextMessageUpdate) => {
  const instance = await getInstanceInfo();

  const state = instance?.State;
  const stopped = state.Code === 80; // stopped
  if (!stopped) {
    if (state.Code === 16) { // running
      ctx.reply('Уже запущен');
    } else {
      ctx.reply(`Сервер в состоянии ${state.Name}`);
    }
    return;
  }

  ctx.reply('Запускаем сервер');
  await ec2Client.startInstances({ InstanceIds: [instance?.InstanceId] }).promise();

  setTimeout(async () => {
    const instance = await getInstanceInfo();
    ctx.reply(`Запущен с ip ${instance?.PublicIpAddress}`);
  }, 10000);
};

export const stopServer = async (ctx: SceneContextMessageUpdate) => {
  const instance = await getInstanceInfo();

  const state = instance?.State;
  const started = state.Code === 16;
  if (!started) {
    if (state.Code === 80) {
      ctx.reply('Уже остановлен');
    } else {
      ctx.reply(`Сервер в состоянии ${state.Name}`);
    }
    return;
  }

  ctx.reply('Останавливаем сервер');

  await ec2Client.stopInstances({ InstanceIds: [instance?.InstanceId] }).promise();

  ctx.reply(`Остановлен успешно`);
};

export const serverStatus = async (ctx: SceneContextMessageUpdate) => {
  const instance = await getInstanceInfo();
  if (!instance) {
    ctx.reply('Не удалось получить статус');
  }

  ctx.reply(`Статус: ${instance.State.Name} Ip: ${instance.PublicIpAddress ? instance.PublicIpAddress : 'N/A'} Быстрый запуск`);
};
