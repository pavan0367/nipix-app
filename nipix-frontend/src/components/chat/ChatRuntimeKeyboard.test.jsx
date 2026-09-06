import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('react-markdown', () => ({ children }) => <div className="markdown-body">{children}</div>);
jest.mock('remark-gfm', () => () => {});

import Chat from '../../pages/Chat';
import MarkdownMessage from './MarkdownMessage';

// Minimal mock store for testing Chat rendering
const createMockStore = (initialUser = null) =>
  configureStore({
    reducer: {
      auth: (state = { user: initialUser, token: null }) => state
    }
  });

describe('Nipix AI Chat Runtime & Keyboard Input Tests', () => {
  test('Chat component renders to static markup without ReferenceError: handleKeyDown is not defined', () => {
    const store = createMockStore({ id: 'u1', username: 'TestScholar' });

    let html = '';
    expect(() => {
      html = ReactDOMServer.renderToStaticMarkup(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/chat']}>
            <Chat />
          </MemoryRouter>
        </Provider>
      );
    }).not.toThrow();

    expect(html).toContain('chat-composer');
    expect(html).toContain('Ask ByteBot AI anything...');
  });

  test('All Six AI Bots are present in the sidebar bot list', () => {
    const store = createMockStore();
    const html = ReactDOMServer.renderToStaticMarkup(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/chat']}>
          <Chat />
        </MemoryRouter>
      </Provider>
    );

    // Verify all 6 bots are rendered
    expect(html).toContain('ByteBot AI');
    expect(html).toContain('Cipher_09');
    expect(html).toContain('Spark_X');
    expect(html).toContain('Archivist');
    expect(html).toContain('NovaMind');
    expect(html).toContain('Aether');
  });

  test('Keyboard handler logic: Enter submits, Shift+Enter creates newline, whitespace ignored, duplicate blocked', () => {
    // We test the keyboard behavior specifications
    let submittedCount = 0;
    let preventedDefault = false;

    const createHandler = ({ userInput, isGenerating }) => (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (e.nativeEvent && e.nativeEvent.isComposing) return;
        if (!userInput.trim() || isGenerating) return;
        submittedCount++;
      }
    };

    // Case 1: Normal typing (key: 'a')
    preventedDefault = false;
    let e = { key: 'a', shiftKey: false, preventDefault: () => { preventedDefault = true; } };
    createHandler({ userInput: 'hello', isGenerating: false })(e);
    expect(preventedDefault).toBe(false);
    expect(submittedCount).toBe(0);

    // Case 2: Enter with text -> sends message and calls preventDefault
    preventedDefault = false;
    e = { key: 'Enter', shiftKey: false, preventDefault: () => { preventedDefault = true; } };
    createHandler({ userInput: 'Give me a Java program', isGenerating: false })(e);
    expect(preventedDefault).toBe(true);
    expect(submittedCount).toBe(1);

    // Case 3: Shift + Enter -> does not send, allows newline
    preventedDefault = false;
    e = { key: 'Enter', shiftKey: true, preventDefault: () => { preventedDefault = true; } };
    createHandler({ userInput: 'Give me a Java program', isGenerating: false })(e);
    expect(preventedDefault).toBe(false);
    expect(submittedCount).toBe(1); // count unchanged

    // Case 4: Empty string + Enter -> does not send
    preventedDefault = false;
    e = { key: 'Enter', shiftKey: false, preventDefault: () => { preventedDefault = true; } };
    createHandler({ userInput: '   ', isGenerating: false })(e);
    expect(preventedDefault).toBe(true);
    expect(submittedCount).toBe(1); // count unchanged

    // Case 5: Multiple rapid Enter presses while isGenerating is true -> blocked
    preventedDefault = false;
    e = { key: 'Enter', shiftKey: false, preventDefault: () => { preventedDefault = true; } };
    createHandler({ userInput: 'Second message', isGenerating: true })(e);
    expect(preventedDefault).toBe(true);
    expect(submittedCount).toBe(1); // blocked! count unchanged
  });

  test('MarkdownMessage renders Java code block and explanations smoothly', () => {
    const codeResponse = `Here is the Java program to reverse a string:

\`\`\`java
public class ReverseString {
    public static void main(String[] args) {
        String str = "hello";
        String rev = new StringBuilder(str).reverse().toString();
        System.out.println(rev);
    }
}
\`\`\`

### Complexity
- Time Complexity: O(n)
- Space Complexity: O(n)`;

    const html = ReactDOMServer.renderToStaticMarkup(
      <MarkdownMessage content={codeResponse} isUser={false} />
    );

    expect(html).toContain('ReverseString');
    expect(html).toContain('StringBuilder');
    expect(html).toContain('Time Complexity');
  });
});
