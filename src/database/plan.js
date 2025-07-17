import { connection } from "./index.js";

// Tạo plan mới
export async function createPlan({
  groupId,
  userId,
  userName,
  content,
  deadline,
  createdBy,
}) {
  const [result] = await connection.execute(
    `INSERT INTO plans (group_id, user_id, user_name, content, deadline, status, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, 'pending', ?, NOW())`,
    [groupId, userId, userName, content, deadline, createdBy]
  );
  return result.insertId;
}

// Lấy tất cả plan của 1 nhóm
export async function getPlansByGroup(groupId) {
  const [rows] = await connection.execute(
    `SELECT * FROM plans WHERE group_id = ? ORDER BY deadline ASC`,
    [groupId]
  );
  return rows;
}

// Lấy tất cả plan của 1 user
export async function getPlansByUser(userId) {
  const [rows] = await connection.execute(
    `SELECT * FROM plans WHERE user_id = ? ORDER BY deadline ASC`,
    [userId]
  );
  return rows;
}

// Cập nhật trạng thái plan
export async function updatePlanStatus(planId, status) {
  await connection.execute(`UPDATE plans SET status = ? WHERE id = ?`, [
    status,
    planId,
  ]);
}

// Lấy các plan chưa hoàn thành, deadline đã đến hoặc sắp đến
export async function getPendingPlansBeforeDeadline(now) {
  const [rows] = await connection.execute(
    `SELECT * FROM plans WHERE status = 'pending' AND deadline <= ?`,
    [now]
  );
  return rows;
}

// Lấy các plan sắp tới hạn (trong vòng 30 phút, chưa được nhắc nhở)
export async function getPlansSoonDeadline(now, soon) {
  const [rows] = await connection.execute(
    `SELECT * FROM plans WHERE status = 'pending' AND deadline > ? AND deadline <= ? AND reminded_soon = 0`,
    [now, soon]
  );
  return rows;
}

// Đánh dấu plan đã được nhắc sắp tới hạn
export async function setPlanRemindedSoon(planId) {
  await connection.execute(`UPDATE plans SET reminded_soon = 1 WHERE id = ?`, [
    planId,
  ]);
}

// Xóa plan (nếu cần)
export async function deletePlan(planId) {
  await connection.execute(`DELETE FROM plans WHERE id = ?`, [planId]);
}
