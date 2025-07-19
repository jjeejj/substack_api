// Example usage of the Substack API TypeScript library
import { Newsletter, Post, User } from './src';

async function main() {
  try {
    // Example 1: Working with a newsletter
    console.log('=== Newsletter Example ===');
    const newsletter = new Newsletter('https://example.substack.com');
    console.log('Newsletter URL:', newsletter.getUrl());
    console.log('Newsletter Subdomain:', newsletter.getSubdomain());

    // Example 2: Working with a post
    console.log('\n=== Post Example ===');
    const post = new Post('https://example.substack.com/p/sample-post');
    console.log('Post URL:', post.getUrl());
    console.log('Post Slug:', post.getSlug());
    console.log('Post Subdomain:', post.getSubdomain());

    // Example 3: Working with a user
    console.log('\n=== User Example ===');
    const user = new User('testuser');
    console.log('Username:', user.getUsername());
    console.log('Original Username:', user.getOriginalUsername());
    console.log('Was Redirected:', user.wasRedirected);

    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  main();
}

export { main };