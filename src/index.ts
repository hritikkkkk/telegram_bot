import { Telegraf, Context } from 'telegraf';
import dotenv from 'dotenv';
import { setupCommands } from './command';

dotenv.config();

const bot = new Telegraf<Context>(process.env.BOT_TOKEN!);

bot.start((ctx) => ctx.reply('Welcome to the bot!'));
bot.help((ctx) => ctx.reply('Send me a sticker or say hi!'));

setupCommands(bot);

bot.launch().then(() => {
  console.log('Bot is running...');
}).catch(err => {
  console.error('Failed to launch bot:', err);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

