import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

/**
 * Code Block Component with Language Label and Copy Button
 */
const CodeBlock = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeText = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy text: ', err);
    }
  };

  if (inline) {
    return (
      <code
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.85em',
          fontFamily: 'Consolas, Monaco, monospace',
          color: '#38bdf8'
        }}
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div
      style={{
        margin: '12px 0',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border-color, #334155)',
        background: '#0b0f19'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          background: '#131b2e',
          borderBottom: '1px solid var(--border-color, #334155)',
          fontSize: '0.74rem',
          color: '#94a3b8',
          fontFamily: 'Consolas, Monaco, monospace'
        }}
      >
        <span>{language ? language.toUpperCase() : 'CODE'}</span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            color: copied ? '#10b981' : '#94a3b8',
            cursor: 'pointer',
            fontSize: '0.74rem',
            padding: '2px 6px',
            borderRadius: '4px'
          }}
          title="Copy code"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      <pre
        style={{
          margin: 0,
          padding: '12px 14px',
          overflowX: 'auto',
          fontSize: '0.86rem',
          lineHeight: '1.5',
          fontFamily: 'Consolas, Monaco, monospace',
          color: '#f8fafc',
          background: '#0b0f19'
        }}
      >
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
};

/**
 * MarkdownMessage: Renders full GitHub-flavored Markdown
 * Headings, lists, tables, bold, italics, code blocks
 */
const MarkdownMessage = ({ content = '', isUser = false }) => {
  if (isUser) {
    return <span style={{ whiteSpace: 'pre-wrap' }}>{content}</span>;
  }

  return (
    <div className="nipix-markdown-content" style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          p({ children }) {
            return <p style={{ margin: '0 0 10px 0' }}>{children}</p>;
          },
          h1({ children }) {
            return <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '14px 0 8px 0', color: 'var(--text-main)' }}>{children}</h1>;
          },
          h2({ children }) {
            return <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '12px 0 6px 0', color: 'var(--text-main)' }}>{children}</h2>;
          },
          h3({ children }) {
            return <h3 style={{ fontSize: '0.98rem', fontWeight: 600, margin: '10px 0 4px 0', color: 'var(--text-main)' }}>{children}</h3>;
          },
          ul({ children }) {
            return <ul style={{ paddingLeft: '20px', margin: '6px 0 10px 0' }}>{children}</ul>;
          },
          ol({ children }) {
            return <ol style={{ paddingLeft: '20px', margin: '6px 0 10px 0' }}>{children}</ol>;
          },
          li({ children }) {
            return <li style={{ margin: '3px 0' }}>{children}</li>;
          },
          table({ children }) {
            return (
              <div style={{ overflowX: 'auto', margin: '10px 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.82rem' }}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th style={{ border: '1px solid var(--border-color, #334155)', padding: '6px 10px', background: 'rgba(255,255,255,0.06)', fontWeight: 600 }}>
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td style={{ border: '1px solid var(--border-color, #334155)', padding: '6px 10px' }}>
                {children}
              </td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote style={{ margin: '10px 0', padding: '6px 12px', borderLeft: '3px solid var(--accent-primary, #6366f1)', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '0 4px 4px 0' }}>
                {children}
              </blockquote>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default React.memo(MarkdownMessage);
