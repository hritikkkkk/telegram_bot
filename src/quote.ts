import axios from "axios";

export async function fetchQuote() {
  const primaryApiUrl = "https://api.quotable.io/random";
  const fallbackApiUrl = "https://zenquotes.io/api/random";

  try {
    const response = await axios.get(primaryApiUrl);
    return response.data;
  } catch (primaryError: any) {
    console.error("Primary API failed:", primaryError.message);

    try {
      const fallbackResponse = await axios.get(fallbackApiUrl);
      const quoteData = fallbackResponse.data[0];
      return { content: quoteData.q, author: quoteData.a };
    } catch (fallbackError: any) {
      console.error("Fallback API failed:", fallbackError.message);
      throw new Error("Both APIs failed.");
    }
  }
}
