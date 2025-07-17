import {
  createPlan,
  getPlansByGroup,
  updatePlanStatus,
  getPlansByUser,
} from "../database/plan.js";
import {
  sendMessageComplete,
  sendMessageFailed,
  sendMessageQuery,
} from "../service-dqt/chat-zalo/chat-style/chat-style.js";
import { getGlobalPrefix } from "../service-dqt/service.js";
import { getContent } from "../utils/format-util.js";

// !plan [nội dung] [deadline: dd/mm/yyyy hh:mm] @user
export async function handlePlanCommand(api, message, groupInfo) {
  const prefix = getGlobalPrefix();
  const content = getContent(message);
  const threadId = message.threadId;
  const senderId = message.data.uidFrom;
  const mentions = message.data.mentions;

  // Phân tích lệnh
  const planRegex = /plan\s+(.+?)\s+(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2})/i;
  const match = content.match(planRegex);
  if (!match || !mentions || Object.keys(mentions).length === 0) {
    await sendMessageQuery(
      api,
      message,
      `Cú pháp: !plan [nội dung] [dd/mm/yyyy hh:mm] @user`
    );
    return;
  }
  const planContent = match[1].trim();
  const deadlineStr = match[2].trim();
  // Chuyển deadline sang yyyy-mm-dd hh:mm:ss
  const [date, time] = deadlineStr.split(" ");
  const [d, m, y] = date.split("/");
  const deadline = `${y}-${m.padStart(2, "0")}-${d.padStart(
    2,
    "0"
  )} ${time}:00`;

  // Giao cho từng user được tag
  let ok = 0,
    fail = 0;
  for (const m of Object.values(mentions)) {
    const uid = m.uid;
    const name = m.name || m.displayName || m.text || "";
    try {
      await createPlan({
        groupId: threadId,
        userId: uid,
        userName: name,
        content: planContent,
        deadline,
        createdBy: senderId,
      });
      ok++;
    } catch (e) {
      fail++;
    }
  }
  await sendMessageComplete(
    api,
    message,
    `Đã giao plan cho ${ok} thành viên${fail ? ", lỗi: " + fail : ""}`
  );
}

// !plan done [id] hoặc reply tin nhắn plan
export async function handlePlanDoneCommand(api, message) {
  const content = getContent(message);
  const senderId = message.data.uidFrom;
  let planId = null;
  // Lấy id từ lệnh hoặc từ reply
  const match = content.match(/plan\s+done\s+(\d+)/i);
  if (match) {
    planId = parseInt(match[1]);
  } else if (message.data.quote && message.data.quote.msgId) {
    // Có thể lưu id plan vào msg khi gửi plan
    const quoted = message.data.quote;
    if (quoted.planId) planId = quoted.planId;
  }
  if (!planId) {
    await sendMessageQuery(
      api,
      message,
      `Cú pháp: !plan done [id] hoặc reply tin nhắn plan.`
    );
    return;
  }
  // Kiểm tra quyền sở hữu plan (có thể mở rộng sau)
  await updatePlanStatus(planId, "done");
  await sendMessageComplete(
    api,
    message,
    `Đã đánh dấu hoàn thành plan #${planId}`
  );
}

// !plan list: liệt kê các plan của nhóm
export async function handlePlanListCommand(api, message, groupInfo) {
  const threadId = message.threadId;
  const plans = await getPlansByGroup(threadId);
  if (!plans.length) {
    await sendMessageQuery(api, message, `Nhóm chưa có plan nào.`);
    return;
  }
  let msg = `Danh sách plan của nhóm:\n`;
  for (const plan of plans) {
    msg += `#${plan.id}: ${plan.content}\n- Giao cho: ${plan.user_id}\n- Deadline: ${plan.deadline}\n- Trạng thái: ${plan.status}\n`;
  }
  await sendMessageComplete(api, message, msg);
}
