import { Telegraf, Context } from "telegraf";
import { fetchQuote } from "./quote";

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

  bot.command("quote", async (ctx) => {
    try {
      const quoteData = await fetchQuote();
      const quote = quoteData.content;
      const author = quoteData.author;
      await ctx.reply(`"${quote}"\n\n- ${author}`);
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      await ctx.reply("Sorry, I couldn't fetch a quote at the moment.");
    }
  });
}
