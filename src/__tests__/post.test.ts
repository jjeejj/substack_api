import { Post } from '../post';

describe('Post', () => {
  let post: Post;

  beforeEach(() => {
    post = new Post('https://example.substack.com/p/test-post');
  });

  test('should extract subdomain and slug from URL', () => {
    expect(post.getSubdomain()).toBe('example');
    expect(post.getSlug()).toBe('test-post');
  });

  test('should build correct URL', () => {
    expect(post.getUrl()).toBe('https://example.substack.com/p/test-post');
  });

  test('should throw error for invalid URL', () => {
    expect(() => {
      new Post('invalid-url');
    }).toThrow();
  });

  test('should throw error for URL without slug', () => {
    expect(() => {
      new Post('https://example.substack.com');
    }).toThrow();
  });
});
