import React, { useEffect, useState } from 'react';

interface WecomConfigCheckProps {
  onConfigReady?: (config: any) => void;
}

const WecomConfigCheck: React.FC<WecomConfigCheckProps> = ({ onConfigReady }) => {
  const [configStatus, setConfigStatus] = useState<{
    corpId: boolean;
    agentId: boolean;
    corpSecret: boolean;
    isWeChatWork: boolean;
  }>({
    corpId: false,
    agentId: false,
    corpSecret: false,
    isWeChatWork: false,
  });

  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    // 检查环境
    const ua = navigator.userAgent.toLowerCase();
    const isWeChatWork = ua.includes('wxwork') || ua.includes('micromessenger');

    // 获取配置
    const corpId = window.WECOM_CORP_ID || 
                   (window.WECHAT_WORK_CONFIG && window.WECHAT_WORK_CONFIG.corpId) ||
                   '';
    const agentId = window.WECOM_AGENT_ID || 
                   (window.WECHAT_WORK_CONFIG && window.WECHAT_WORK_CONFIG.agentId) ||
                   '';
    const corpSecret = window.WECOM_CORP_SECRET || 
                     (window.WECHAT_WORK_CONFIG && window.WECHAT_WORK_CONFIG.corpSecret) ||
                     '';

    const status = {
      corpId: corpId && corpId.length > 0 && !corpId.includes('xxxxxxxx'),
      agentId: agentId && agentId.length > 0 && agentId !== '1000001',
      corpSecret: corpSecret && corpSecret.length > 0 && !corpSecret.includes('xxxxxxxx'),
      isWeChatWork,
    };

    setConfigStatus(status);
    setConfig({ corpId, agentId, corpSecret, isWeChatWork });

    // 如果配置完整，通知父组件
    if (status.corpId && status.agentId && status.corpSecret) {
      onConfigReady?.({ corpId, agentId, corpSecret });
    }
  }, [onConfigReady]);

  const formatConfigValue = (value: string, type: string) => {
    if (!value) return '未配置';
    if (value.includes('xxxxxxxx')) return '请配置';
    if (type === 'corpId' && value.startsWith('ww')) {
      return `${value.substring(0, 8)}****${value.substring(value.length - 4)}`;
    }
    if (type === 'corpSecret') {
      return `${value.substring(0, 8)}****${value.substring(value.length - 4)}`;
    }
    return value;
  };

  // 只在配置不完整时显示
  const isConfigIncomplete = !configStatus.corpId || !configStatus.agentId || !configStatus.corpSecret;

  if (!isConfigIncomplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl p-8 border border-blue-500/20">
          <h2 className="text-xl font-serif text-amber-200 mb-6 text-center">企业微信配置检查</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-amber-400 text-sm font-serif">企业微信环境:</span>
              <span className={`text-sm font-mono ${configStatus.isWeChatWork ? 'text-green-400' : 'text-gray-400'}`}>
                {configStatus.isWeChatWork ? '✓ 检测到' : '✗ 未检测到'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-amber-400 text-sm font-serif">企业ID:</span>
              <span className={`text-sm font-mono ${configStatus.corpId ? 'text-green-400' : 'text-red-400'}`}>
                {formatConfigValue(config.corpId, 'corpId')}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-amber-400 text-sm font-serif">应用ID:</span>
              <span className={`text-sm font-mono ${configStatus.agentId ? 'text-green-400' : 'text-red-400'}`}>
                {formatConfigValue(config.agentId, 'agentId')}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-amber-400 text-sm font-serif">应用Secret:</span>
              <span className={`text-sm font-mono ${configStatus.corpSecret ? 'text-green-400' : 'text-red-400'}`}>
                {formatConfigValue(config.corpSecret, 'corpSecret')}
              </span>
            </div>
          </div>

          {(!configStatus.corpId || !configStatus.agentId || !configStatus.corpSecret) && (
            <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
              <h3 className="text-amber-300 text-sm font-serif mb-2">🔧 配置说明:</h3>
              <ol className="text-amber-200/80 text-xs font-serif space-y-1 list-decimal list-inside">
                <li>打开 <code className="bg-black/30 px-1 rounded">wecom-config.js</code> 文件</li>
                <li>替换 <code className="bg-black/30 px-1 rounded">corpId</code> 为您的企业ID</li>
                <li>替换 <code className="bg-black/30 px-1 rounded">agentId</code> 为您的应用ID</li>
                <li>替换 <code className="bg-black/30 px-1 rounded">corpSecret</code> 为您的应用Secret</li>
                <li>重新部署应用</li>
              </ol>
            </div>
          )}

          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-amber-600/20 border border-amber-500/30 text-amber-200 px-4 py-2 rounded-full hover:bg-amber-600/30 transition-all duration-300 font-serif text-sm"
            >
              重新检查
            </button>
            <button
              onClick={() => {
                // 移除wecom参数并继续
                const url = new URL(window.location.href);
                url.searchParams.delete('wecom');
                window.location.href = url.toString();
              }}
              className="flex-1 bg-blue-600/20 border border-blue-500/30 text-blue-200 px-4 py-2 rounded-full hover:bg-blue-600/30 transition-all duration-300 font-serif text-sm"
            >
              标准访问
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WecomConfigCheck;