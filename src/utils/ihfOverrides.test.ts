import { describe, it, expect } from 'vitest';
import { extractListingId } from './ihfOverrides';

describe('extractListingId', () => {
  it('returns listing id from url', () => {
    const original = window.location.href;
    Object.defineProperty(window, 'location', {
      value: { href: 'https://test.com/property?id=12345' },
      writable: true
    });
    expect(extractListingId()).toBe('12345');
    window.location.href = original;
  });

  it('returns empty string when no id', () => {
    const original = window.location.href;
    Object.defineProperty(window, 'location', {
      value: { href: 'https://test.com/property' },
      writable: true
    });
    expect(extractListingId()).toBe('');
    window.location.href = original;
  });
});
