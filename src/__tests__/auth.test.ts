import { SubstackAuth } from '../auth';
import { Cookie } from '../types';

describe('SubstackAuth', () => {
  const mockCookies: Cookie[] = [
    {
      name: 'substack.sid',
      value: 'test-session-id',
      domain: '.substack.com',
      path: '/',
      secure: true,
    },
    {
      name: 'substack.lli',
      value: 'test-lli-value',
      domain: '.substack.com',
      path: '/',
      secure: true,
    },
  ];

  test('should create auth with cookies array', () => {
    const auth = new SubstackAuth(undefined, mockCookies);
    expect(auth.isAuthenticated()).toBe(true);
  });

  test('should format cookies correctly', () => {
    const auth = new SubstackAuth(undefined, mockCookies);
    const cookieHeader = auth.getCookieString();
    expect(cookieHeader).toBe(
      'substack.sid=test-session-id; substack.lli=test-lli-value'
    );
  });

  test('should detect authentication status', () => {
    const auth = new SubstackAuth(undefined, mockCookies);
    expect(auth.isAuthenticated()).toBe(true);

    const emptyAuth = new SubstackAuth();
    expect(emptyAuth.isAuthenticated()).toBe(false);
  });

  test('should require substack.sid cookie for authentication', () => {
    const cookiesWithoutSid: Cookie[] = [
      {
        name: 'other.cookie',
        value: 'test-value',
        domain: '.substack.com',
        path: '/',
        secure: true,
      },
    ];

    const auth = new SubstackAuth(undefined, cookiesWithoutSid);
    expect(auth.isAuthenticated()).toBe(false);
  });
});
