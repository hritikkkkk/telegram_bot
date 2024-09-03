import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv";
import { setupCommands } from "./command";

dotenv.config();

const bot = new Telegraf<Context>(process.env.BOT_TOKEN!);

const commands = [
  { command: "/start", description: "Start the bot" },
  { command: "/help", description: "Get help on how to use the bot" },
  { command: "/quote", description: "Get a random quote" },
  { command: "/oldschool", description: "Say hello in an old-school way" },
  { command: "/modern", description: "Say yo in a modern way" },
  { command: "/hipster", description: "Say λ in a hipster way" },
  { command: "/quit", description: "Make the bot leave the chat" },
  {
    command: "/weather city_name",
    description: "Get your city weather update",
  },
];

bot.start((ctx) => ctx.reply("Welcome to the bot!"));

bot.help((ctx) => {
  const helpMessage = commands
    .map((cmd) => `${cmd.command} - ${cmd.description}`)
    .join("\n");
  ctx.reply(`Available commands:\n\n${helpMessage}`);
});

setupCommands(bot);

bot
  .launch()
  .then(() => {
    console.log("Bot is running...");
  })
  .catch((err) => {
    console.error("Failed to launch bot:", err);
  });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
