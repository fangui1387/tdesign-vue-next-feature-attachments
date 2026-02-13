const defaultGlobalConfig: Record<string, any> = {
  chat: {
    confirmClearHistory: '确认清空历史记录吗？',
    clearHistoryBtnText: '清空历史',
    placeholder: '请输入内容',
    stopBtnText: '停止回答',
    copyTipText: '复制',
    likeTipText: '点赞',
    dislikeTipText: '点踩',
    refreshTipText: '重新生成',
    copyTextSuccess: '复制成功',
    copyTextFail: '复制失败',
    copyCodeBtnText: '复制',
    copyCodeSuccessText: '复制成功',
    loadingText: '思考中',
    loadingEndText: '思考完成',
    uploadAttachmentText: '上传附件',
    uploadImageText: '上传图片',
  },
};

export const useConfig = (componentName: string) => {
  const globalConfig = defaultGlobalConfig[componentName] || {};
  return { globalConfig };
};
