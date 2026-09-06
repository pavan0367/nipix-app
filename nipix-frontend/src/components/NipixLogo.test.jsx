import React from 'react';
import ReactDOMServer from 'react-dom/server';
import NipixLogo from './NipixLogo';

describe('NipixLogo Component Tests', () => {
  test('renders logo image with default properties and object-fit contain', () => {
    const html = ReactDOMServer.renderToStaticMarkup(<NipixLogo />);
    expect(html).toContain('<img');
    expect(html).toContain('alt="Nipix Logo"');
    expect(html).toContain('object-fit:contain');
    expect(html).toContain('height:38px');
    expect(html).toContain('width:46px');
    expect(html).toContain('background:transparent');
    expect(html).toContain('border:none');
  });

  test('respects custom size and custom dimensions', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <NipixLogo size={40} />
    );
    expect(html).toContain('<img');
    expect(html).toContain('height:40px');
    expect(html).toContain('width:48px');
    expect(html).toContain('object-fit:contain');
  });

  test('allows explicit width or height overrides', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <NipixLogo height="30px" width="36px" />
    );
    expect(html).toContain('<img');
    expect(html).toContain('height:30px');
    expect(html).toContain('width:36px');
  });
});
