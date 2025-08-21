# Next.js Usage Guide

## CSS Styles

The auth components require CSS styles to display properly. There are several ways to include them in your Next.js project:

### Method 1: Import in your layout (Recommended)

In your `app/layout.tsx` (App Router) or `pages/_app.tsx` (Pages Router):

```tsx
// App Router (app/layout.tsx)
import "auth-client/styles";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// Pages Router (pages/_app.tsx)
import "auth-client/styles";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

### Method 2: Import in your CSS file

In your global CSS file (e.g., `globals.css`):

```css
@import "auth-client/styles";
```

### Method 3: Copy CSS file manually

1. Copy `node_modules/auth-client/dist/auth-styles.css` to your `public` folder
2. Import it in your HTML head or CSS file

## Usage Examples

### Client Side (React Components)

```tsx
import { AuthModal, createAuthClient } from "auth-client";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL!,
});

export default function MyComponent() {
  return <AuthModal client={authClient} />;
}
```

### Server Side (API Routes, Server Components)

```tsx
// app/api/auth/route.ts
import { auth } from "auth-client/server";

export const authHandler = auth;
export { authHandler as GET, authHandler as POST };
```

```tsx
// Server Component
import { auth } from "auth-client/server";
import { headers } from "next/headers";

export default async function ServerComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <div>Welcome, {session.user.email}!</div>;
}
```

### Middleware

```tsx
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth-client/server";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session && request.nextUrl.pathname.startsWith("/protected")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*"],
};
```
