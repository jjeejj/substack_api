import { User } from '../user';

describe('User', () => {
  let user: User;

  beforeEach(() => {
    user = new User('testuser');
  });

  test('should store username correctly', () => {
    expect(user.getUsername()).toBe('testuser');
    expect(user.getOriginalUsername()).toBe('testuser');
  });

  test('should not be redirected initially', () => {
    expect(user.wasRedirected).toBe(false);
  });

  test('should handle redirect following option', () => {
    const userWithoutRedirects = new User('testuser', undefined, false);
    expect(userWithoutRedirects.getUsername()).toBe('testuser');
  });
});
