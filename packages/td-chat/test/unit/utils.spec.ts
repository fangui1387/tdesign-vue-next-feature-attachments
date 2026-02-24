import {
  isAIMessage,
  isToolCallContent,
  getMessageContentForCopy,
  ToolCallContent,
  ToolCall,
} from '@/types';

describe('Utils', () => {
  describe('isToolCallContent', () => {
    it('returns true for valid ToolCallContent', () => {
      const content: ToolCallContent = {
        type: 'tool-call',
        toolCall: {
          id: '1',
          type: 'function',
          function: {
            name: 'test',
            arguments: '{}',
          },
        },
      };
      expect(isToolCallContent(content)).toBe(true);
    });

    it('returns false for string content', () => {
      expect(isToolCallContent('Hello')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isToolCallContent(null)).toBe(false);
    });

    it('returns false for object without type', () => {
      expect(isToolCallContent({ toolCall: {} })).toBe(false);
    });

    it('returns false for object with wrong type', () => {
      expect(isToolCallContent({ type: 'text' })).toBe(false);
    });
  });

  describe('isAIMessage', () => {
    it('returns true for valid AI message', () => {
      const message = { role: 'assistant', content: 'Hello' };
      expect(isAIMessage(message)).toBe(true);
    });

    it('returns false for user message', () => {
      const message = { role: 'user', content: 'Hello' };
      expect(isAIMessage(message)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isAIMessage(null)).toBe(false);
    });

    it('returns false for object without role', () => {
      expect(isAIMessage({ content: 'Hello' })).toBe(false);
    });
  });

  describe('getMessageContentForCopy', () => {
    it('returns string content as is', () => {
      expect(getMessageContentForCopy('Hello world')).toBe('Hello world');
    });

    it('returns empty string for undefined', () => {
      expect(getMessageContentForCopy(undefined as any)).toBe('');
    });

    it('returns empty string for null', () => {
      expect(getMessageContentForCopy(null as any)).toBe('');
    });

    it('handles array with string items', () => {
      const content = ['Line 1', 'Line 2'];
      expect(getMessageContentForCopy(content)).toBe('Line 1\nLine 2');
    });

    it('handles array with ToolCallContent', () => {
      const toolCall: ToolCallContent = {
        type: 'tool-call',
        toolCall: {
          id: '1',
          type: 'function',
          function: {
            name: 'getWeather',
            arguments: '{"city":"Beijing"}',
          },
        },
      };
      const content: (string | ToolCallContent)[] = ['Hello', toolCall];
      expect(getMessageContentForCopy(content)).toBe('Hello\n[Tool Call: getWeather]');
    });

    it('handles single ToolCallContent', () => {
      const toolCall: ToolCallContent = {
        type: 'tool-call',
        toolCall: {
          id: '1',
          type: 'function',
          function: {
            name: 'search',
            arguments: '{"query":"test"}',
          },
        },
      };
      expect(getMessageContentForCopy(toolCall)).toBe('[Tool Call: search]');
    });

    it('handles empty array', () => {
      expect(getMessageContentForCopy([])).toBe('');
    });

    it('handles array with unknown item types', () => {
      const content = [123, true, {}];
      expect(getMessageContentForCopy(content as any)).toBe('\n\n');
    });
  });
});
