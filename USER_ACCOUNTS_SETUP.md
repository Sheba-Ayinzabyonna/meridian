# User Accounts & Authentication Setup

This guide prepares Meridian for user accounts (Phase 2+).

## 🔐 Authentication Architecture

### Current (MVP) — Session-Based
- No user accounts
- Data stored in sessionStorage (browser)
- Session resets on browser close
- No backend required

### Phase 2 — User Accounts
- Email/password or OAuth (Google, GitHub)
- JWT tokens for API authentication
- Backend database (Supabase, Firebase, PostgreSQL)
- Persistent user plans and progress

---

## 🚀 Integration Options

### Option 1: Supabase (Recommended for MVP → Scale)

**Advantages:**
- Easy setup
- Built-in authentication
- PostgreSQL database
- Real-time updates
- Free tier suitable for MVP

**Setup:**
```bash
npm install @supabase/supabase-js
```

**Environment variables:**
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example authentication:**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123!',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'SecurePassword123!',
});

// Save plan to database
await supabase
  .from('plans')
  .insert({
    user_id: user.id,
    plan_data: planObject,
    created_at: new Date(),
  });

// Retrieve user's plans
const { data: plans } = await supabase
  .from('plans')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

### Option 2: Firebase

**Advantages:**
- Simple authentication
- Firestore for data
- Built-in analytics
- Easy deployment

**Setup:**
```bash
npm install firebase
```

**Environment variables:**
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=meridian-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=meridian-xxxx
VITE_FIREBASE_STORAGE_BUCKET=meridian-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
```

### Option 3: Auth0

**Advantages:**
- Enterprise-grade
- Many integrations
- Fine-grained access control

**Setup:**
```bash
npm install @auth0/auth0-react
```

---

## 📊 Database Schema (Supabase Example)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Plans Table
```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  intake_data JSONB NOT NULL,
  plan_data JSONB NOT NULL,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Daily Check-ins Table
```sql
CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  feeling TEXT NOT NULL,
  affirmation TEXT,
  focus_area TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### Pro Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  plan_type TEXT DEFAULT 'pro',
  stripe_subscription_id TEXT,
  started_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 🔗 Authentication Flow (Phase 2)

```
Welcome Screen
    ↓
    [User logged in?]
    ├─ YES → Redirect to Dashboard
    └─ NO → Show Login/Sign Up
         ↓
    [Existing user?]
    ├─ YES → Login form
    └─ NO → Sign Up form
         ↓
    [Create account]
         ↓
    [Start intake] (same as current)
         ↓
    [Save intake + plan to database]
         ↓
    [Dashboard with past plans]
```

---

## 🔑 Context Implementation

```javascript
// contexts/AuthContext.jsx
import { createContext, useReducer, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if user is logged in on mount
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        dispatch({ type: 'SET_USER', payload: session.user });
      } else {
        dispatch({ type: 'CLEAR_USER' });
      }
    });
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 🎯 Migration Path (MVP → Phase 2)

1. **MVP (Current):** No accounts, sessionStorage
2. **Phase 2a:** Add optional account creation (not required)
3. **Phase 2b:** Migrate sessionStorage data to database on signup
4. **Phase 2c:** Dashboard showing past plans
5. **Phase 3:** Pro features and subscriptions

---

## 🔐 Security Considerations

- **Passwords:** Use bcrypt or let Auth provider handle (recommended)
- **Tokens:** Store JWT in httpOnly cookies (more secure than localStorage)
- **CORS:** Configure backend to allow only your domain
- **Rate Limiting:** Add on authentication endpoints
- **2FA:** Consider optional for Pro users

---

## 💳 Payment Integration (Pro Subscription)

### Option 1: Stripe

```bash
npm install @stripe/react-stripe-js stripe
```

**Flow:**
1. User clicks "Upgrade to Pro"
2. Show Stripe checkout modal
3. Upon successful payment, create subscription record
4. Unlock Pro features

### Option 2: Lemonsqueezy

Simpler than Stripe, built for indie developers.

### Option 3: Paddle

Similar to Lemonsqueezy, handles VAT automatically.

---

## 📞 Next Steps

When ready for Phase 2:

1. Choose authentication provider (Supabase recommended)
2. Create database schema
3. Add AuthContext to app
4. Create Login/SignUp pages
5. Add account dashboard
6. Migrate sessionStorage data on signup
7. Add Pro subscription flow
8. Implement email sending

For now, the MVP works perfectly without accounts!
