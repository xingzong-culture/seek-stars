
import { UserRecord } from '../types';

// =============================================================================
// 🟢 飞书自动化配置区域 (Feishu/Lark Configuration)
// =============================================================================

// 1. 地址A：对应飞书自动化流程1 -> 写入【全部记录】表
// 👉 请将第一个 Webhook URL 粘贴在下方单引号内：
const WEBHOOK_URL_ALL = 'https://milesight.feishu.cn/base/automation/webhook/event/GDY6ax2yrwIl5FhXD9QchJuXnsg'; 

// 2. 地址B：对应飞书自动化流程2 -> 写入【去重记录】表
// 👉 请将第二个 Webhook URL 粘贴在下方单引号内：
const WEBHOOK_URL_UNIQUE = 'https://milesight.feishu.cn/base/automation/webhook/event/RPsLasoS8wRJQGhIohJcNBhOngh'; 

// =============================================================================

// 生成或获取唯一的设备ID (Device Fingerprint)
export const getUniqueDeviceId = (): string => {
  const STORAGE_KEY = 'star_destiny_device_uuid';
  let uuid = localStorage.getItem(STORAGE_KEY);
  
  if (!uuid) {
    // 生成一个随机ID: dev_时间戳_随机数
    uuid = `dev_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
    localStorage.setItem(STORAGE_KEY, uuid);
  }
  
  return uuid;
};

// 发送请求的通用辅助函数
const sendToFeishu = async (url: string, payload: any, label: string) => {
  // 简单的检查，防止用户忘记填 URL
  if (!url || url.includes('请在此处')) {
    console.warn(`⚠️ [${label}] Webhook URL 尚未配置，数据无法发送到飞书。请在 services/sheetService.ts 中填入 URL。`);
    return;
  }

  try {
    // 飞书 Webhook 接收 JSON 格式
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'text/plain', // 规避 CORS 预检，但内容是 JSON
      },
      body: JSON.stringify(payload),
    });
    console.log(`✅ [${label}] 数据发送成功`);
  } catch (error) {
    console.error(`❌ [${label}] 发送失败:`, error);
  }
};

export const saveToBackend = async (record: UserRecord, constellationName: string) => {
  const uniqueId = getUniqueDeviceId();
  
  // 构造 JSON 数据对象 (两个表通用的数据结构)
  const payload = {
    timestamp: new Date(record.timestamp).toLocaleString('zh-CN'),
    birthDate: record.birthDate,
    constellation: constellationName,
    // 合并 ID 和 UA 信息到 device 字段，方便飞书查看
    device: `[ID:${uniqueId}] ${navigator.userAgent}`,
    // 确保有值，如果没有填则传 "未填写"
    userName: record.userName || "未填写" 
  };

  console.log("🚀 正在处理数据同步...");

  // ---------------------------------------------------------
  // 通道 1：发送给“全部记录” (无条件发送，用于统计热度)
  // ---------------------------------------------------------
  // 只要点击查询，就发送，不进行任何去重判断
  await sendToFeishu(WEBHOOK_URL_ALL, payload, "全部记录表");

  // ---------------------------------------------------------
  // 通道 2：发送给“去重记录” (严格基于设备的唯一性)
  // ---------------------------------------------------------
  // 🔥 版本号 v5_final: 强制清空所有人的历史状态，重新开始计数
  const SYNC_KEY_UNIQUE = 'star_destiny_synced_unique_v5_final'; 
  const hasSyncedUnique = localStorage.getItem(SYNC_KEY_UNIQUE);

  if (!hasSyncedUnique) {
    console.log("✨ [去重逻辑] 检测到该设备首次提交，锁定设备并发送...");
    
    // 🚨 核心修正：先锁定，再发送！
    // 只要代码执行到这里，立即标记该设备已记录。
    // 无论用户之后改成什么名字，或者网络是否延迟，
    // 第二次点击时，hasSyncedUnique 必然为 true，从而跳过发送。
    localStorage.setItem(SYNC_KEY_UNIQUE, 'true');

    // 发送数据
    await sendToFeishu(WEBHOOK_URL_UNIQUE, payload, "去重记录表");
  } else {
    console.log("🔒 [去重逻辑] 该设备已记录过 (Key已存在)，本次仅在前端展示，不发送给去重表。");
  }
};
