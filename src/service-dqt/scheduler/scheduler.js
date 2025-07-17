import schedule from "node-schedule";
import fs from "fs";
import { readGroupSettings, writeGroupSettings } from "../../utils/io-json.js";
import { MessageType } from "../../api-zalo/models/Message.js";
import { handleRandomChartZingMp3 } from "../api-crawl/music/zingmp3.js";
import {
  getRandomVideoFromArray,
  searchVideoTiktok,
} from "../api-crawl/tiktok/tiktok-service.js";
import { sendRandomGirlVideo } from "../chat-zalo/chat-special/send-video/send-video.js";
import {
  getPlansSoonDeadline,
  setPlanRemindedSoon,
} from "../../database/plan.js";
import { sendMessageState } from "../chat-zalo/chat-style/chat-style.js";
import moment from "moment-timezone";

const scheduledTasks = [
  {
    cronExpression: "5 3 * * *",
    task: async (api) => {
      const caption = `> SendTask 03:05 <\nNgày mới chúc các bạn may mắn!\n\n`;
      const timeToLive = 1000 * 60 * 60 * 3;
      await sendTaskMusic(api, caption, timeToLive);
    },
  },
  {
    cronExpression: "5 6 * * *",
    task: async (api) => {
      const caption =
        `> SendTask 06:05 <\nThức dậy cho một ngày mới\nđầy năng lượng thôi nào!` +
        `\n\nĐón bình minh ngày mới cùng tớ nhé!!!`;
      const timeToLive = 1000 * 60 * 60 * 3;
      await sendTaskVideo(
        api,
        caption,
        timeToLive,
        `ngắm bình minh chill ${Date.now()}`
      );
    },
  },
  {
    cronExpression: "5 9 * * *",
    task: async (api) => {
      const caption =
        `> SendTask 09:05 <\nChào buổi sáng\ncùng đón nắng ấm suơng mưa nhé!` +
        `\n\nGiải trí một chút để bớt căng thẳng thôi nào!!!`;
      const timeToLive = 1000 * 60 * 60 * 3;
      await sendTaskVideo(
        api,
        caption,
        timeToLive,
        `nhạc chill cảnh đẹp ${Date.now()}`
      );
    },
  },
  {
    cronExpression: "5 10 * * *",
    task: async (api) => {
      const caption =
        `> SendTask 10:05 <\nChào một buổi trưa đầy năng lượng!` +
        `\n\nCung cấp vitamin gái cho anh em đây!!!`;
      const timeToLive = 1000 * 60 * 60 * 1;
      await sendTaskGirlVideo(api, caption, timeToLive);
    },
  },
  {
    cronExpression: "5 11 * * *",
    task: async (api) => {
      const caption =
        `> SendTask 11:05 <\nChào một buổi trưa đầy năng lượng!` +
        `\n\nCung cấp vitamin gái cực sexy cho anh em đây!!!`;
      const timeToLive = 1000 * 60 * 60 * 1;
      await sendTaskGirlVideo(api, caption, timeToLive, "sexy");
    },
  },
  {
    cronExpression: "5 12 * * *",
    task: async (api) => {
      const caption =
        `> SendTask 12:05 <\nChào một buổi trưa đầy năng lượng!` +
        `\n\nGiải trí với nữ cosplay cho anh em đây!!!`;
      const timeToLive = 1000 * 60 * 60 * 1;
      await sendTaskGirlVideo(api, caption, timeToLive, "cosplay");
    },
  },
  {
    cronExpression: "5 13 * * *",
    task: async (api) => {
      const caption =
        `> SendTask 13:05 <\nChào một buổi trưa đầy năng lượng!` +
        `\n\nGiải trí anime cho bớt căng não anh em nhé!!!`;
      const timeToLive = 1000 * 60 * 60 * 1;
      await sendTaskGirlVideo(api, caption, timeToLive, "anime");
    },
  },
  {
    cronExpression: "5 14 * * *",
    task: async (api) => {
      const caption =
        `> SendTask 14:05 <\nChào một buổi trưa đầy năng lượng!` +
        `\n\nCung cấp vitamin gái cho anh em đây!!!`;
      const timeToLive = 1000 * 60 * 60 * 1;
      await sendTaskGirlVideo(api, caption, timeToLive);
    },
  },
  {
    cronExpression: "5 15 * * *",
    task: async (api) => {
      const caption =
        `> SendTask 15:05 <\nChào một buổi xế chiều đầy năng lượng!` +
        `\n\nCung cấp vitamin gái cực sexy cho anh em đây!!!`;
      const timeToLive = 1000 * 60 * 60 * 1;
      await sendTaskGirlVideo(api, caption, timeToLive, "sexy");
    },
  },
  {
    cronExpression: "5 16 * * *",
    task: async (api) => {
      const caption =
        `> SendTask 16:05 <\nChào một buổi xế chiều đầy năng lượng!` +
        `\n\nGiải trí với nữ cosplay cho anh em đây!!!`;
      const timeToLive = 1000 * 60 * 60 * 1;
      await sendTaskGirlVideo(api, caption, timeToLive, "cosplay");
    },
  },
  {
    cronExpression: "5 17 * * *",
    task: async (api) => {
      const caption =
        `> SendTask 17:05 <\nChúc buổi chiều thật chill và vui vẻ nhé!` +
        `\n\nĐón hoàng hôn ánh chiều tà thôi nào!!!`;
      const timeToLive = 1000 * 60 * 60 * 2;
      await sendTaskVideo(
        api,
        caption,
        timeToLive,
        `ngắm hoàng hôn chill ${Date.now()}`
      );
    },
  },
  {
    cronExpression: "5 19 * * *",
    task: async (api) => {
      const caption =
        `> SendTask 19:05 <\nChúc các bạn một buổi tối vui vẻ bên gia đình!` +
        `\n\nThư giãn cuối ngày thôi nào!!!`;
      const timeToLive = 1000 * 60 * 60 * 1;
      await sendTaskVideo(api, caption, timeToLive, "âm nhạc nhẹ nhàng");
    },
  },
  {
    cronExpression: "5 20 * * *",
    task: async (api) => {
      const caption =
        `> SendTask 20:05 <\nGiải trí bằng 1 bài nhạc` +
        `\ncho thời gian tỉnh táo nhất trong ngày!\n\n`;
      const timeToLive = 1000 * 60 * 60 * 2;
      await sendTaskMusic(api, caption, timeToLive);
    },
  },
  {
    cronExpression: "5 22 * * *",
    task: async (api) => {
      const caption = `> SendTask 22:05 <\nChúc các bạn ngủ ngon!\n\n`;
      const timeToLive = 1000 * 60 * 60 * 5;
      await sendTaskMusic(api, caption, timeToLive);
    },
  },
];

scheduledTasks.push({
  cronExpression: "* * * * *", // mỗi 1 phút
  task: async (api) => {
    const now = moment().tz("Asia/Ho_Chi_Minh");
    const soon = now.clone().add(30, "minutes");
    const nowStr = now.format("YYYY-MM-DD HH:mm:ss");
    const soonStr = soon.format("YYYY-MM-DD HH:mm:ss");
    console.log("[PLAN SCHEDULER] Node.js now:", nowStr, "soon:", soonStr);
    const plans = await getPlansSoonDeadline(nowStr, soonStr);
    console.log(
      `[PLAN SCHEDULER] Đang kiểm tra các plan sắp tới hạn (${plans.length} plan cần nhắc)`
    );
    for (const plan of plans) {
      // Log chi tiết plan
      console.log(
        `[PLAN REMINDER] Nhắc nhở plan #${plan.id} cho user ${plan.user_id} (group ${plan.group_id}) - deadline: ${plan.deadline}`
      );
      // Nhắn riêng
      try {
        if (plan.user_id && plan.user_id !== "0") {
          const memberName =
            plan.user_name && plan.user_name.trim()
              ? plan.user_name
              : "Thành viên";
          const deadlineVN = moment(plan.deadline)
            .tz("Asia/Ho_Chi_Minh")
            .format("HH:mm [ngày] DD/MM/YYYY");
          const content = `🔔 [NHẮC NHỞ PLAN]\n👤 ${memberName} còn 30 phút để hoàn thành nhiệm vụ:\n📋 "${plan.content}"\n🕰️ Deadline: ${deadlineVN}`;
          await api.sendMessage(
            {
              msg: content,
            },
            plan.user_id,
            MessageType.DirectMessage
          );
          console.log(
            `[PLAN REMINDER] Đã gửi nhắc nhở riêng cho user ${plan.user_id}`
          );
        } else {
          console.error(`[PLAN REMINDER] user_id không hợp lệ:`, plan.user_id);
        }
      } catch (e) {
        console.error(
          `[PLAN REMINDER] Lỗi khi gửi nhắc nhở riêng cho user ${plan.user_id}:`,
          e
        );
        // Nếu lỗi code 127, gửi thông báo vào group
        if (e.code === 127) {
          await api.sendMessage(
            {
              msg: `⚠️ Không thể gửi tin nhắn riêng cho ${plan.user_name}. Vui lòng nhắn tin cho bot trước để nhận nhắc nhở riêng!`,
            },
            plan.group_id,
            MessageType.GroupMessage
          );
        }
      }
      // Nhắn group (tag user nhận plan)
      try {
        const memberName = plan.user_name || `ID:${plan.user_id}`;
        const deadlineVN = moment(plan.deadline)
          .tz("Asia/Ho_Chi_Minh")
          .format("HH:mm [ngày] DD/MM/YYYY");
        const content = `🔔 [NHẮC NHỞ PLAN]\n👤 ${memberName} còn 30 phút để hoàn thành nhiệm vụ:\n📋 "${plan.content}"\n🕰️ Deadline: ${deadlineVN}`;
        const mention = [
          {
            pos: content.indexOf(memberName),
            uid: plan.user_id,
            len: memberName.length,
          },
        ];
        await api.sendMessage(
          {
            msg: content,
            mentions: mention,
          },
          plan.group_id,
          MessageType.GroupMessage
        );
        console.log(`[PLAN REMINDER] Đã gửi nhắc nhở group ${plan.group_id}`);
      } catch (e) {
        console.error(
          `[PLAN REMINDER] Lỗi khi gửi nhắc nhở group ${plan.group_id}:`,
          e
        );
      }
      // Đánh dấu đã nhắc
      await setPlanRemindedSoon(plan.id);
    }
  },
});

async function sendTaskGirlVideo(api, caption, timeToLive, type = "default") {
  const groupSettings = readGroupSettings();
  for (const threadId of Object.keys(groupSettings)) {
    if (groupSettings[threadId].sendTask) {
      try {
        const message = {
          threadId: threadId,
          type: MessageType.GroupMessage,
        };
        await sendRandomGirlVideo(api, message, caption, type, timeToLive);
      } catch (error) {
        console.error(`Lỗi khi gửi video gái in ${threadId}:`, error);
        if (error.message && error.message.includes("Không tồn tại")) {
          groupSettings[threadId].sendTask = false;
          writeGroupSettings(groupSettings);
        }
      }
    }
  }
}

async function sendTaskVideo(api, caption, timeToLive, query) {
  const chillListVideo = await searchVideoTiktok(query);
  if (chillListVideo) {
    const groupSettings = readGroupSettings();
    let captionFinal = `${caption}`;
    for (const threadId of Object.keys(groupSettings)) {
      if (groupSettings[threadId].sendTask) {
        try {
          const message = {
            threadId: threadId,
            type: MessageType.GroupMessage,
          };
          const videoUrl = await getRandomVideoFromArray(
            api,
            message,
            chillListVideo
          );
          await api.sendVideo({
            videoUrl: videoUrl,
            threadId: message.threadId,
            threadType: message.type,
            message: {
              text: captionFinal,
            },
            ttl: timeToLive,
          });
        } catch (error) {
          console.error(`Lỗi khi gửi video tiktok in ${threadId}:`, error);
          if (error.message && error.message.includes("Không tồn tại")) {
            groupSettings[threadId].sendTask = false;
            writeGroupSettings(groupSettings);
          }
        }
      }
    }
  }
}

async function sendTaskMusic(api, caption, timeToLive) {
  const groupSettings = readGroupSettings();
  for (const threadId of Object.keys(groupSettings)) {
    if (groupSettings[threadId].sendTask) {
      try {
        const message = {
          threadId: threadId,
          type: MessageType.GroupMessage,
        };
        await handleRandomChartZingMp3(api, message, caption, timeToLive);
      } catch (error) {
        console.error(`Lỗi khi gửi nhạc in ${threadId}:`, error);
        if (error.message && error.message.includes("Không tồn tại")) {
          groupSettings[threadId].sendTask = false;
          writeGroupSettings(groupSettings);
        }
      }
    }
  }
}

export async function initializeScheduler(api) {
  scheduledTasks.forEach((taskConfig) => {
    schedule.scheduleJob(taskConfig.cronExpression, () => {
      taskConfig.task(api).catch((error) => {
        console.error("Lỗi khi thực thi tác vụ định kỳ:", error);
      });
    });
  });
}
