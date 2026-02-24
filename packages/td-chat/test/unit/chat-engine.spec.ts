import { ChatEngine, agentToolcallRegistry, stateManager } from '@/chat-engine';
import { ChatServiceConfig, ChatMessagesData } from '@/types';

describe('ChatEngine', () => {
  let engine: ChatEngine;
  let mockConfig: ChatServiceConfig;

  beforeEach(() => {
    engine = new ChatEngine();
    mockConfig = {
      endpoint: 'https://api.example.com/chat',
      onRequest: jest.fn(() => ({ headers: { 'X-Custom': 'test' } })),
      onStart: jest.fn(),
      onComplete: jest.fn(),
      onError: jest.fn(),
      onAbort: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    engine.clearMessages();
  });

  describe('Initialization', () => {
    it('initializes with config and default messages', () => {
      const defaultMessages: ChatMessagesData[] = [
        { id: '1', role: 'user', content: 'Hello', status: 'complete' },
      ];
      engine.init(mockConfig, defaultMessages);

      expect(engine.getMessages()).toEqual(defaultMessages);
      expect(engine.getStatus()).toBe('idle');
    });

    it('initializes with empty messages when none provided', () => {
      engine.init(mockConfig);

      expect(engine.getMessages()).toEqual([]);
      expect(engine.getStatus()).toBe('idle');
    });
  });

  describe('Message Management', () => {
    beforeEach(() => {
      engine.init(mockConfig);
    });

    it('sets messages with replace mode', () => {
      const messages: ChatMessagesData[] = [
        { id: '1', role: 'user', content: 'Test', status: 'complete' },
      ];
      engine.setMessages(messages, 'replace');

      expect(engine.getMessages()).toEqual(messages);
    });

    it('sets messages with append mode', () => {
      const initialMessages: ChatMessagesData[] = [
        { id: '1', role: 'user', content: 'First', status: 'complete' },
      ];
      const additionalMessages: ChatMessagesData[] = [
        { id: '2', role: 'assistant', content: 'Second', status: 'complete' },
      ];

      engine.setMessages(initialMessages, 'replace');
      engine.setMessages(additionalMessages, 'append');

      expect(engine.getMessages().length).toBe(2);
    });

    it('clears messages', () => {
      engine.setMessages([{ id: '1', role: 'user', content: 'Test', status: 'complete' }]);
      engine.clearMessages();

      expect(engine.getMessages()).toEqual([]);
      expect(engine.getStatus()).toBe('idle');
    });
  });

  describe('Subscription', () => {
    beforeEach(() => {
      engine.init(mockConfig);
    });

    it('subscribes to message changes', () => {
      const listener = jest.fn();
      engine.subscribe(listener);

      engine.setMessages([{ id: '1', role: 'user', content: 'Test', status: 'complete' }]);

      expect(listener).toHaveBeenCalled();
    });

    it('unsubscribes from message changes', () => {
      const listener = jest.fn();
      const unsubscribe = engine.subscribe(listener);

      unsubscribe();
      engine.setMessages([{ id: '1', role: 'user', content: 'Test', status: 'complete' }]);

      expect(listener).toHaveBeenCalledTimes(1); // Only initial call
    });
  });

  describe('Send User Message', () => {
    beforeEach(() => {
      engine.init(mockConfig);
    });

    it('sends user message successfully', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn().mockReturnValue({
            read: jest
              .fn()
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n'),
              })
              .mockResolvedValueOnce({ done: true, value: undefined }),
          }),
        },
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await engine.sendUserMessage({ prompt: 'Test message' });

      expect(global.fetch).toHaveBeenCalledWith(
        mockConfig.endpoint,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('does not send message when already streaming', async () => {
      // Set status to streaming
      (engine as any).status = 'streaming';

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await engine.sendUserMessage({ prompt: 'Test' });

      expect(consoleSpy).toHaveBeenCalledWith('[ChatEngine] Cannot send message while streaming');
      expect(global.fetch).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('handles missing config error', async () => {
      const newEngine = new ChatEngine();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await newEngine.sendUserMessage({ prompt: 'Test' });

      expect(consoleSpy).toHaveBeenCalledWith('[ChatEngine] Chat service config is missing');
      consoleSpy.mockRestore();
    });

    it('calls onStart callback', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn().mockReturnValue({
            read: jest.fn().mockResolvedValueOnce({ done: true, value: undefined }),
          }),
        },
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await engine.sendUserMessage({ prompt: 'Test' });

      expect(mockConfig.onStart).toHaveBeenCalled();
    });

    it('handles HTTP error', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await engine.sendUserMessage({ prompt: 'Test' });

      expect(mockConfig.onError).toHaveBeenCalled();
    });
  });

  describe('Abort Chat', () => {
    beforeEach(() => {
      engine.init(mockConfig);
    });

    it('aborts ongoing chat', () => {
      (engine as any).abortController = new AbortController();
      (engine as any).status = 'streaming';

      engine.abortChat();

      expect(engine.getStatus()).toBe('complete');
      expect(mockConfig.onAbort).toHaveBeenCalled();
    });

    it('does nothing when no abort controller', () => {
      engine.abortChat();
      expect(mockConfig.onAbort).not.toHaveBeenCalled();
    });
  });

  describe('Regenerate AI Message', () => {
    beforeEach(() => {
      engine.init(mockConfig);
    });

    it('regenerates last user message', async () => {
      const messages: ChatMessagesData[] = [
        { id: '1', role: 'user', content: 'Hello', status: 'complete' },
        { id: '2', role: 'assistant', content: 'Hi', status: 'complete' },
      ];
      engine.setMessages(messages, 'replace');

      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn().mockReturnValue({
            read: jest.fn().mockResolvedValueOnce({ done: true, value: undefined }),
          }),
        },
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await engine.regenerateAIMessage();

      expect(global.fetch).toHaveBeenCalled();
    });

    it('does nothing when no user messages', async () => {
      await engine.regenerateAIMessage();
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});

describe('AgentToolcallRegistry', () => {
  beforeEach(() => {
    agentToolcallRegistry.clear();
  });

  it('registers a toolcall config', () => {
    const config = {
      name: 'testTool',
      description: 'Test tool',
      parameters: [],
    };

    agentToolcallRegistry.register(config);

    expect(agentToolcallRegistry.get('testTool')).toEqual(config);
  });

  it('unregisters a toolcall config', () => {
    const config = {
      name: 'testTool',
      description: 'Test tool',
      parameters: [],
    };

    agentToolcallRegistry.register(config);
    agentToolcallRegistry.unregister('testTool');

    expect(agentToolcallRegistry.get('testTool')).toBeUndefined();
  });

  it('gets all registered configs', () => {
    const config1 = { name: 'tool1', description: 'Tool 1', parameters: [] };
    const config2 = { name: 'tool2', description: 'Tool 2', parameters: [] };

    agentToolcallRegistry.register(config1);
    agentToolcallRegistry.register(config2);

    const all = agentToolcallRegistry.getAll();
    expect(all.length).toBe(2);
  });

  it('clears all registered configs', () => {
    agentToolcallRegistry.register({ name: 'tool', description: 'Tool', parameters: [] });
    agentToolcallRegistry.clear();

    expect(agentToolcallRegistry.getAll().length).toBe(0);
  });
});

describe('StateManager', () => {
  beforeEach(() => {
    // Clear any existing state
    (stateManager as any).stateMap.clear();
    (stateManager as any).listeners.clear();
  });

  it('sets and gets state', () => {
    stateManager.setState('testKey', { data: 'value' });

    expect(stateManager.getState('testKey')).toEqual({ data: 'value' });
  });

  it('subscribes to state changes', () => {
    const listener = jest.fn();
    stateManager.subscribeToLatest(listener);

    stateManager.setState('key', 'value');

    expect(listener).toHaveBeenCalledWith('value', 'key');
  });

  it('unsubscribes from state changes', () => {
    const listener = jest.fn();
    const unsubscribe = stateManager.subscribeToLatest(listener);

    unsubscribe();
    stateManager.setState('key', 'value');

    expect(listener).not.toHaveBeenCalled();
  });
});
