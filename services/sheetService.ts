import { UserRecord } from '../types';

// ⚠️在此处填入您的飞书(Lark)自动化 Webhook URL
// 格式通常为: https://www.feishu.cn/flow/api/v1/webhook/trigger/...
const WEBHOOK_URL = 'https://milesight.feishu.cn/base/automation/webhook/event/GDY6ax2yrwIl5FhXD9QchJuXnsg'; 

export const saveToBackend = async (record: UserRecord, constellationName: string) => {
  if (!WEBHOOK_URL) {
    console.log('后台存储未配置: 请在 services/sheetService.ts 中填入飞书 Webhook URL');
    return;
  }

  try {
    // 构造发送给飞书的数据结构
    // 注意：飞书自动化接收到的 JSON 结构就是下面这个对象
    const payload = {
      timestamp: new Date(record.timestamp).toLocaleString('zh-CN'),
      birthDate: record.birthDate,
      constellation: constellationName,
      device: navigator.userAgent, // 简单的设备信息
    };

    // 使用 fetch 发送数据
    // mode: 'no-cors' 是关键，它允许浏览器向飞书服务器发送 POST 请求而不会因跨域(CORS)报错
    // 缺点是我们无法知道是否成功（状态码为 0），但在这种日志记录场景下是可以接受的
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('已触发数据上传');
  } catch (error) {
    console.error('上传触发失败:', error);
  }
};