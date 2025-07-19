import { Newsletter } from '../newsletter';

describe('Newsletter', () => {
  let newsletter: Newsletter;

  beforeEach(() => {
    newsletter = new Newsletter('https://example.substack.com');
  });

  test('should extract subdomain from URL', () => {
    expect(newsletter.getSubdomain()).toBe('example');
  });

  test('should build correct URL', () => {
    expect(newsletter.getUrl()).toBe('https://example.substack.com');
  });

  test('should handle custom domain URLs', () => {
    const customNewsletter = new Newsletter('https://custom-domain.com');
    expect(customNewsletter.getSubdomain()).toBe('custom-domain.com');
  });

  test('should throw error for invalid URL', () => {
    expect(() => {
      new Newsletter('invalid-url');
    }).toThrow();
  });
});
