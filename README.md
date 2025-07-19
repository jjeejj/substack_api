# Substack API TypeScript

An unofficial TypeScript client library for interacting with Substack newsletters and content. <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>

## Overview

This library provides TypeScript interfaces for interacting with Substack's unofficial API, allowing you to: <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>

- Retrieve newsletter posts, podcasts, and recommendations
- Get user profile information and subscriptions  
- Fetch post content and metadata
- Search for posts within newsletters
- Access paywalled content that you have written or paid for with user-provided authentication

## Installation

```bash
npm install substack-api-ts
# or
yarn add substack-api-ts
# or
pnpm add substack-api-ts
```

## Usage Examples

### Working with Newsletters

```typescript
import { Newsletter } from 'substack-api-ts';

// Initialize a newsletter by its URL
const newsletter = new Newsletter("https://example.substack.com");

// Get recent posts (returns Post objects)
const recentPosts = await newsletter.getPosts({ limit: 5 });

// Get posts sorted by popularity
const topPosts = await newsletter.getPosts({ sorting: "top", limit: 10 });

// Search for posts
const searchResults = await newsletter.searchPosts("machine learning", { limit: 3 });

// Get podcast episodes
const podcasts = await newsletter.getPodcasts({ limit: 5 });

// Get recommended newsletters
const recommendations = await newsletter.getRecommendations();

// Get newsletter authors
const authors = await newsletter.getAuthors();
```

### Working with Posts

```typescript
import { Post } from 'substack-api-ts';

// Initialize a post by its URL
const post = new Post("https://example.substack.com/p/post-slug");

// Get post metadata
const metadata = await post.getMetadata();

// Get the post's HTML content
const content = await post.getContent();

// Check if post is paywalled
const isPaywalled = await post.isPaywalled();
```

### Accessing Paywalled Content with Authentication

To access paywalled content, you need to provide your own session cookies from a logged-in Substack session: <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>

```typescript
import { Newsletter, Post, SubstackAuth } from 'substack-api-ts';

// Set up authentication with your cookies
const auth = new SubstackAuth("path/to/your/cookies.json");

// Use authentication with newsletters
const newsletter = new Newsletter("https://example.substack.com", auth);
const posts = await newsletter.getPosts({ limit: 5 }); // Can now access paywalled posts

// Use authentication with individual posts
const post = new Post("https://example.substack.com/p/paywalled-post", auth);
const content = await post.getContent(); // Can now access paywalled content

// Check if a post is paywalled
if (await post.isPaywalled()) {
    console.log("This post requires a subscription");
}
```

### Getting Your Cookies

To access paywalled content, you need to export your browser cookies from a logged-in Substack session. The cookies should be in JSON format with the following structure: <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>

```json
[
  {
    "name": "substack.sid",
    "value": "your_session_id",
    "domain": ".substack.com",
    "path": "/",
    "secure": true
  },
  {
    "name": "substack.lli", 
    "value": "your_lli_value",
    "domain": ".substack.com",
    "path": "/",
    "secure": true
  }
]
```

**Important:** Only use your own cookies from your own authenticated session. This feature is intended for users to access their own subscribed or authored content programmatically. <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>

### Working with Users

```typescript
import { User } from 'substack-api-ts';

// Initialize a user by their username
const user = new User("username");

// Get user profile information
const profileData = await user.getRawData();

// Get user ID and name
const userId = await user.getId();
const name = await user.getName();

// Get user's subscriptions
const subscriptions = await user.getSubscriptions();
```

### Handling Renamed Accounts

Substack allows users to change their handle (username) at any time. When this happens, the old API endpoints return 404 errors. This library automatically handles these redirects by default. <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>

#### Automatic Redirect Handling

```typescript
import { User } from 'substack-api-ts';

// This will automatically follow redirects if the handle has changed
const user = new User("oldhandle"); // Will find the user even if they renamed to "newhandle"

// Check if a redirect occurred
const profile = await user.getRawData();
if (user.wasRedirected) {
    console.log(`User was renamed from ${user.originalUsername} to ${user.username}`);
}
```

#### Manual Handle Resolution

You can also manually resolve handle redirects: <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>

```typescript
import { resolveHandleRedirect } from 'substack-api-ts';

const newHandle = await resolveHandleRedirect("oldhandle");
if (newHandle) {
    console.log(`Handle was renamed to: ${newHandle}`);
}
```

## API Reference

### Classes

- **Newsletter**: Main class for interacting with Substack newsletters
- **Post**: Class for working with individual posts
- **User**: Class for user profile and subscription management
- **SubstackAuth**: Authentication helper for accessing paywalled content

### Types

The library includes comprehensive TypeScript type definitions for all API responses and options.

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Limitations

- This is an unofficial library and not endorsed by Substack <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>
- APIs may change without notice, potentially breaking functionality <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>
- Rate limiting may be enforced by Substack <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>
- Authentication requires users to provide their own session cookies <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>
- Users are responsible for complying with Substack's terms of service when using authentication features <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>

## Disclaimer

This package is not affiliated with, endorsed by, or connected to Substack in any way. Use at your own risk and ensure compliance with Substack's terms of service. <mcreference link="https://github.com/NHagar/substack_api" index="0">0</mcreference>
