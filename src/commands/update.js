import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";

// Lưu cache tin tức mới nhất cho từng nhóm
const newsCache = {};

export async function handleUpdateCommand(api, message) {
  try {
    const content = message.data.content.trim();
    const match = content.match(/update\s*(\d+)?/i);
    const index = match && match[1] ? parseInt(match[1], 10) : null;
    const threadId = message.threadId;

    // Nếu người dùng hỏi chi tiết tin theo index
    if (index !== null) {
      if (newsCache[threadId] && newsCache[threadId][index - 1]) {
        const item = newsCache[threadId][index - 1];
        const detail = `📰 ${item.title}\n${item.description}\n🔗 ${item.link}`;
        await api.sendMessage(
          { msg: detail, quote: message },
          threadId,
          message.type
        );
      } else {
        await api.sendMessage(
          {
            msg: `Không tìm thấy tin tức số ${index}. Hãy dùng !update để lấy danh sách mới nhất.`,
            quote: message,
          },
          threadId,
          message.type
        );
      }
      return;
    }

    // Lấy tin tức mới nhất
    const res = await fetch("https://vnexpress.net/rss/tin-moi-nhat.rss");
    const text = await res.text();
    const rss = await parseStringPromise(text);
    const items = rss.rss.channel[0].item;
    let news = "";
    let cache = [];
    if (items && items.length > 0) {
      for (let i = 0; i < Math.min(5, items.length); i++) {
        news += `${i + 1}. ${items[i].title[0]}\n`;
        cache.push({
          title: items[i].title[0],
          link: items[i].link[0],
          description: items[i].description[0].replace(/<[^>]+>/g, "").trim(),
        });
      }
      newsCache[threadId] = cache;
    } else {
      news = "Không lấy được tin tức.";
      newsCache[threadId] = [];
    }
    news += "\nĐể xem chi tiết, hãy dùng: !update <số thứ tự> (VD: !update 1)";
    await api.sendMessage(
      { msg: `📰 5 tin tức mới nhất:\n${news}`, quote: message },
      threadId,
      message.type
    );
  } catch (err) {
    await api.sendMessage(
      { msg: "Lỗi khi lấy tin tức: " + err.message, quote: message },
      message.threadId,
      message.type
    );
  }
}
