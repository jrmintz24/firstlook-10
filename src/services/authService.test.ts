import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn()
    }
  }
}));

import { signInWithProvider } from './authService';
import { supabase } from '@/integrations/supabase/client';

const oauthMock = supabase.auth.signInWithOAuth as vi.Mock;

interface GlobalWithWindow {
  window: { location: { href: string } };
}
const globalWithWindow = global as unknown as GlobalWithWindow;

beforeEach(() => {
  oauthMock.mockReset();
  globalWithWindow.window = { location: { href: '' } };
});

describe('signInWithProvider', () => {
  it('redirects when OAuth returns a URL', async () => {
    oauthMock.mockResolvedValue({ data: { url: 'https://example.com' }, error: null });
    const result = await signInWithProvider('google', 'buyer');
    expect(result.error).toBeNull();
    expect(globalWithWindow.window.location.href).toBe('https://example.com');
  });

  it('does not redirect if no URL is returned', async () => {
    oauthMock.mockResolvedValue({ data: null, error: null });
    const result = await signInWithProvider('google', 'buyer');
    expect(result.error).toBeNull();
    expect(globalWithWindow.window.location.href).toBe('');
  });
});
