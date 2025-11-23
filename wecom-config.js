// 企业微信配置文件
// 请根据您的企业微信应用信息修改以下配置

const WECHAT_WORK_CONFIG = {
  // 企业ID - 在企业微信后台「我的企业」→「企业信息」中查看
  corpId: 'wwf75e842fcde0ba28', // 替换为您的企业ID
  
  // 应用ID - 在企业微信后台「应用管理」→「自建应用」中查看
  agentId: '1000031', // 替换为您的应用ID
  
  // 应用Secret - 在企业微信后台「应用管理」→「自建应用」→「凭证与基础信息」中查看
  corpSecret: 'ko6yZpXHzDLhoPOy3qgvOW1OMFOK0UkuCF8C48lm6yg', // 替换为您的应用Secret
  
  // JS-SDK 接口列表
  jsApiList: ['hideOptionMenu', 'showOptionMenu', 'closeWindow'],
};

// 将配置挂载到全局，供前端使用
if (typeof window !== 'undefined') {
  window.WECHAT_WORK_CONFIG = WECHAT_WORK_CONFIG;
  window.WECOM_CORP_ID = WECHAT_WORK_CONFIG.corpId;
  window.WECOM_AGENT_ID = WECHAT_WORK_CONFIG.agentId;
  window.WECOM_CORP_SECRET = WECHAT_WORK_CONFIG.corpSecret;
}

// 导出配置（供后端使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WECHAT_WORK_CONFIG;
}

console.log('企业微信配置已加载');
console.log('企业ID:', WECHAT_WORK_CONFIG.corpId);
console.log('应用ID:', WECHAT_WORK_CONFIG.agentId);