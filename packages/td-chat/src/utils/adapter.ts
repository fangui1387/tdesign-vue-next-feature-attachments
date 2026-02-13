export class AGUIAdapter {
  static convertHistoryMessages(history: any[]) {
    // Simple conversion based on expected format in demo
    return history.map((item) => ({
      id: item.id || Date.now() + Math.random(),
      role: item.role,
      content: item.content,
      // Add other necessary fields
    }));
  }
}
