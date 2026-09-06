import React from 'react';
import ReactDOMServer from 'react-dom/server';
import NipixLogo from './NipixLogo';

describe('NipixLogo Component Tests', () => {
  test('renders logo image with default properties and object-fit contain', () => {
    const html = ReactDOMServer.renderToStaticMarkup(<NipixLogo />);
    expect(html).toContain('<img');
    expect(html).toContain('alt="Nipix Logo"');
    expect(html).toContain('object-fit:contain');
    expect(html).toContain('width:40px');
    expect(html).toContain('height:40px');
  });

  test('respects custom size and custom styling', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <NipixLogo size={64} style={{ borderRadius: '14px' }} glow />
    );
    expect(html).toContain('<img');
    expect(html).toContain('width:64px');
    expect(html).toContain('height:64px');
    expect(html).toContain('border-radius:14px');
    expect(html).toContain('object-fit:contain');
    expect(html).toContain('box-shadow:');
  });

  test('renders full banner variant when requested', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <NipixLogo variant="full" />
    );
    expect(html).toContain('<img');
    expect(html).toContain('width:180px');
    expect(html).toContain('height:auto');
  });
});
