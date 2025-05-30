# Supabase Setup Guide for Propellant

This guide will help you set up Supabase authentication for the Propellant application using the latest **@supabase/ssr** package and best practices.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new Supabase project
3. Node.js installed on your machine

## Environment Variables

Create a `.env.local` file in the frontend directory and add the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

## Supabase Configuration

### Authentication URLs

In your Supabase dashboard:

1. Go to **Authentication** > **URL Configuration**
2. Add these URLs to your allowed redirect URLs:

For development:
```
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:3000/dashboard
```

For production:
```
https://yourdomain.com
https://yourdomain.com/auth/callback
https://yourdomain.com/dashboard
```

## Architecture Overview

This setup follows the latest Supabase SSR (Server-Side Rendering) best practices for Next.js App Router:

### Client Types

1. **Browser Client** (`createClient()`)
   - For use in Client Components
   - Runs in the browser
   - Handles client-side authentication state

2. **Server Client** (`createServerSupabaseClient()`)
   - For use in Server Components, Server Actions, and Route Handlers
   - Runs on the server
   - Uses cookies for session management

3. **Middleware Client** (`updateSession()`)
   - For use in Next.js middleware
   - Refreshes authentication tokens
   - Handles session updates across requests

### Key Features

- **Secure cookie handling** with Supabase SSR
- **Automatic token refresh** via middleware
- **Type-safe** authentication flows
- **Server-side session management**
- **Protected routes** with middleware
- **OAuth support** (Google, GitHub, etc.)

## File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts       # OAuth callback handler
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── register/
│   │   │   └── page.tsx          # Register page
│   │   └── dashboard/
│   │       └── page.tsx          # Protected dashboard
│   ├── components/
│   │   └── header.tsx            # Navigation component
│   ├── lib/
│   │   └── supabase.ts           # Supabase client configuration
│   └── middleware.ts             # Auth middleware
├── .env.local                    # Environment variables
└── package.json
```

## Usage Examples

### Client Component (Browser)

```tsx
'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export function UserProfile() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return <div>Welcome, {user?.email}</div>
}
```

### Server Component

```tsx
import { createServerSupabaseClient, getUser } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  return <div>Hello {user.email}</div>
}
```

### Server Action

```tsx
import { createServerSupabaseClient } from '@/lib/supabase'

export async function updateProfile(formData: FormData) {
  'use server'
  
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Update user profile...
}
```

### Route Handler

```tsx
import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ user })
}
```

## Setup Instructions

1. Set up your Supabase project and add the environment variables
2. Configure authentication URLs in your Supabase dashboard
3. Run the development server: `npm run dev`
4. Visit `http://localhost:3000` to test the authentication flow

## Security Notes

- Always use `supabase.auth.getUser()` to verify authentication server-side
- Never trust `supabase.auth.getSession()` in server code
- Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser
- The `ANON_KEY` is safe to expose as it only allows public operations defined by RLS policies

## Troubleshooting

1. **Cookies not working**: Make sure your site is running on HTTPS in production
2. **Authentication loops**: Check your redirect URLs configuration
3. **Type errors**: Ensure all Supabase packages are up to date

For more information, visit the [Supabase Next.js documentation](https://supabase.com/docs/guides/auth/server-side/nextjs). 