# Server Functions Usage

This package exports server-side authentication functionality that can be used in Next.js server components, API routes, and middleware.

## Installation

```bash
npm install auth-client
```

## Server Usage

### Basic Setup

```typescript
// In your server-side code (API routes, server components)
import { auth, stellar } from "auth-client/server";
import { db } from "./db"; // Your database instance

// Create auth instance
const authInstance = auth(db);

// Or with custom stellar configuration
const authInstanceWithCustom = auth(db, {
  stellar: {
    network: "TESTNET",
    serverSecret: process.env.STELLAR_SERVER_SECRET!,
    webAuthDomain: "auth.example.com",
    homeDomain: "app.example.com",
    emailDomainName: "example.com",
  }
});
```

### Next.js API Route

```typescript
// pages/api/auth/[...auth].ts or app/api/auth/[...auth]/route.ts
import { auth } from "auth-client/server";
import { db } from "../../../lib/db";

const authInstance = auth(db);

export const { GET, POST } = authInstance.handler;
```

### Middleware

```typescript
// middleware.ts
import { auth } from "auth-client/server";
import { db } from "./lib/db";

const authInstance = auth(db);

export default authInstance.middleware;
```

### Server Components

```typescript
// In a server component
import { auth } from "auth-client/server";
import { db } from "./lib/db";

const authInstance = auth(db);

export default async function Page() {
  const session = await authInstance.getSession();
  
  if (!session) {
    redirect('/login');
  }

  return <div>Welcome, {session.user.email}</div>;
}
```

## Client Usage

For client-side components, use the main export:

```typescript
import { AuthModal, createAuthClient } from "auth-client";
import "auth-client/styles";
```

## Types

The server export includes TypeScript types for better development experience:

```typescript
import type { BetterAuthPlugin, StellarPluginOptions } from "auth-client/server";
```
