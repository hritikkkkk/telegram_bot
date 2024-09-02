import { Telegraf, Context } from "telegraf";

export function setupCommands(bot: Telegraf<Context>) {
  bot.hears("hi", (ctx) => ctx.reply("Hey there!"));
  bot.on("sticker", (ctx) => ctx.reply("👍"));

  bot.command("oldschool", async (ctx) => {
    try {
      await ctx.reply("Hello");
    } catch (error) {
      console.error("Failed to send message:", error);
      ctx.reply("Something went wrong.");
    }
  });

  bot.command("modern", async (ctx) => {
    try {
      await ctx.reply("Yo");
    } catch (error) {
      console.error("Failed to reply:", error);
    }
  });

  bot.command("hipster", Telegraf.reply("λ"));

  bot.command("quit", async (ctx) => {
    try {
      await ctx.reply("leaving chat");

      const chatId = ctx.message?.chat.id;
      if (!chatId) {
        throw new Error("Chat ID is undefined");
      }

      await ctx.telegram.leaveChat(chatId);
    } catch (error) {
      console.error("Failed to quit chat:", error);
      ctx.reply("Failed to leave the chat.");
    }
  });
}
