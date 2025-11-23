// 企业微信认证相关工具
interface WeComUserInfo {
  userId: string;
  name: string;
  department: number[];
  position: string;
  mobile: string;
  gender: string;
  email: string;
  avatar: string;
}

interface WeComDepartment {
  id: number;
  name: string;
  parentid: number;
  order: number[];
}

// 企业微信配置 - 需要从实际配置中获取
const WECHAT_WORK_CONFIG = {
  corpId: '', // 企业ID - 需要配置
  agentId: '', // 应用ID - 需要配置
  jsApiList: ['hideOptionMenu', 'showOptionMenu', 'closeWindow'], // JS-SDK接口列表
};

// 从全局配置获取企业微信信息
const getWeComConfig = () => {
  // 尝试从多个来源获取配置
  const corpId = 
    window.WECOM_CORP_ID || 
    (window.WECHAT_WORK_CONFIG && window.WECHAT_WORK_CONFIG.corpId) ||
    '';
    
  const agentId = 
    window.WECOM_AGENT_ID || 
    (window.WECHAT_WORK_CONFIG && window.WECHAT_WORK_CONFIG.agentId) ||
    '';
    
  const corpSecret = 
    window.WECOM_CORP_SECRET || 
    (window.WECHAT_WORK_CONFIG && window.WECHAT_WORK_CONFIG.corpSecret) ||
    '';
    
  return { corpId, agentId, corpSecret };
};

// 检查是否在企业微信环境中
export const isWeChatWork = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('wxwork') || ua.includes('micromessenger');
};

// 获取企业微信授权URL
export const getWeChatWorkAuthUrl = (redirectUri: string, state: string = ''): string => {
  const config = getWeComConfig();
  
  if (!config.corpId || config.corpId === '您的企业ID') {
    console.error('企业微信配置未设置，请在环境变量中配置企业ID');
    return '#';
  }
  
  const params = new URLSearchParams({
    appid: config.corpId,
    redirect_uri: encodeURIComponent(redirectUri),
    response_type: 'code',
    scope: 'snsapi_base',
    state: state,
  });
  
  return `https://open.weixin.qq.com/connect/oauth2/authorize?${params.toString()}#wechat_redirect`;
};

// 从URL获取授权码
export const getAuthCodeFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
};

// 获取用户访问Token
export const getAccessToken = async (): Promise<string> => {
  try {
    const response = await fetch('/api/wecom/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('获取访问令牌失败:', error);
    throw error;
  }
};

// 获取用户信息
export const getUserInfo = async (code: string): Promise<WeComUserInfo> => {
  try {
    const response = await fetch('/api/wecom/userinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// 获取部门信息
export const getDepartmentInfo = async (departmentIds: number[]): Promise<WeComDepartment[]> => {
  try {
    const response = await fetch('/api/wecom/departments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ departmentIds }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取部门信息失败:', error);
    throw error;
  }
};

// 初始化企业微信JS-SDK
export const initWeChatWorkSDK = async (): Promise<boolean> => {
  if (!isWeChatWork()) {
    console.log('不在企业微信环境中');
    return false;
  }

  try {
    // 动态加载企业微信JS-SDK
    const script = document.createElement('script');
    script.src = 'https://res.wx.qq.com/open_js/jweixin-1.2.0.js';
    script.onload = () => {
      console.log('企业微信JS-SDK加载成功');
    };
    document.head.appendChild(script);

    return true;
  } catch (error) {
    console.error('初始化企业微信SDK失败:', error);
    return false;
  }
};

// 完整的企业微信认证流程
export const wechatWorkAuthFlow = async (): Promise<{ user: WeComUserInfo; departments: WeComDepartment[] } | null> => {
  try {
    // 1. 检查是否在企业微信环境
    if (!isWeChatWork()) {
      alert('请使用企业微信访问此页面');
      return null;
    }

    // 2. 获取授权码
    const code = getAuthCodeFromUrl();
    if (!code) {
      // 重新获取授权码
      const currentUrl = window.location.href.split('#')[0];
      const authUrl = getWeChatWorkAuthUrl(currentUrl);
      window.location.href = authUrl;
      return null;
    }

    // 3. 获取用户信息
    const userInfo = await getUserInfo(code);
    
    // 4. 获取部门信息
    const departments = await getDepartmentInfo(userInfo.department);
    
    return {
      user: userInfo,
      departments: departments
    };

  } catch (error) {
    console.error('企业微信认证失败:', error);
    alert('认证失败，请重试');
    return null;
  }
};