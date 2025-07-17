import axios from "axios";
import { getGlobalPrefix } from "../../service.js";
import { getContent } from "../../../utils/format-util.js";
import {
  sendMessageComplete,
  sendMessageFailed,
  sendMessageQuery,
  sendMessageStateQuote,
} from "../../chat-zalo/chat-style/chat-style.js";
import { API_KEY_HUNGDEV } from "../api-hungdev/aio-downlink.js";

// Thay bằng API key cá nhân của bạn
//const OPENAI_API_KEY = "";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function callGPTAPI(question) {
  try {
    const response = await axios.post(
      OPENAI_URL,
      {
        model: "gpt-4o", // hoặc "gpt-3.5-turbo" nếu tài khoản bạn không hỗ trợ gpt-4o
        messages: [{ role: "user", content: question }],
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const data = response.data;
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Lỗi khi gọi OpenAI API:", error?.response?.data || error);
    return null;
  }
}

export async function askGPTCommand(api, message, aliasCommand) {
  const content = getContent(message);
  const threadId = message.threadId;
  const prefix = getGlobalPrefix();

  const question = content.replace(`${prefix}${aliasCommand}`, "").trim();
  if (question === "") {
    await sendMessageQuery(api, message, "Vui lòng nhập câu hỏi cần giải đáp!");
    return;
  }

  try {
    const replyText = await callGPTAPI(question);

    if (!replyText) {
      throw new Error("Không nhận được phản hồi từ API");
    }

    await sendMessageStateQuote(api, message, replyText, true, 1800000, false);
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu GPT:", error);
    await sendMessageFailed(
      api,
      message,
      "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn."
    );
  }
}
