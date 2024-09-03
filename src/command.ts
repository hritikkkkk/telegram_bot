import { Telegraf, Context, Markup } from "telegraf";
import axios from "axios";
import { fetchQuote } from "./quote";
import serverConfig from "./config/index";

const newsCategories = ["business", "technology", "sports"];

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

  bot.command("weather", async (ctx) => {
    const city = ctx.message.text.split(" ").slice(1).join(" ");

    if (!city) return ctx.reply("Please specify a city.");

    const apiKey = serverConfig.WEATHER_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(apiUrl);
      const weather = response.data;
      const message = `Weather in ${weather.name}:
      Temperature: ${weather.main.temp}°C
      Weather: ${weather.weather[0].description}
      Humidity: ${weather.main.humidity}%
      Wind Speed: ${weather.wind.speed} m/s`;

      await ctx.reply(message);
    } catch (error) {
      console.error("Failed to fetch weather:", error);
      await ctx.reply(
        "Sorry, I couldn't fetch the weather data. Please try again later."
      );
    }
  });

  bot.command("news", async (ctx) => {
    const simpleKeyboard = Markup.inlineKeyboard([
      Markup.button.callback('Test Button', 'test_action')
    ]);
    
    await ctx.reply("Testing simple keyboard:", { reply_markup: simpleKeyboard as any });
  });

  newsCategories.forEach((category) => {
    bot.action(`news_${category}`, async (ctx) => {
      await fetchNews(category, ctx);
    });
  });
}

const fetchNews = async (category: string, ctx: Context) => {
  const apiUrl = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${serverConfig.NEWS_API_KEY}`;

  console.log(`Fetching news for category: ${category}`);

  try {
    const response = await axios.get(apiUrl);
    const articles = response.data.articles;
    let message = `${
      category.charAt(0).toUpperCase() + category.slice(1)
    } News:\n\n`;
    articles.slice(0, 5).forEach((article: any) => {
      message += `*${article.title}*\n`;
      message += `${
        article.description ? article.description.slice(0, 100) + "..." : ""
      }\n`;
      message += `${article.url}\n\n`;
    });
    await ctx.reply(message, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Failed to fetch news:", error);
    await ctx.reply(
      "Sorry, I couldn't fetch the news. Please try again later."
    );
  }
};
