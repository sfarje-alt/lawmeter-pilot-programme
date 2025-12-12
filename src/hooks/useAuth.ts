import { useState, useEffect } from 'react';

const DEMO_USERNAME = "pieromalca";
const DEMO_PASSWORD = "pieromalca";
const AUTH_KEY = "lawmeter_demo_auth";
const EXPIRY_HOURS = 24;

interface AuthState {
  authenticated: boolean;
  expiresAt: number;
}

export function useAuth() {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const auth: AuthState = JSON.parse(stored);
        if (auth.authenticated && auth.expiresAt > Date.now()) {
          setUser(DEMO_USERNAME);
        } else {
          localStorage.removeItem(AUTH_KEY);
        }
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      const expiresAt = Date.now() + EXPIRY_HOURS * 60 * 60 * 1000;
      const auth: AuthState = { authenticated: true, expiresAt };
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      setUser(DEMO_USERNAME);
      return { error: null };
    }
    return { error: { message: "Invalid username or password" } };
  };

  const signOut = async () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    return { error: null };
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
}
