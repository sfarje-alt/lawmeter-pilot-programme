import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  account_type: 'admin' | 'user';
  organization_id: string | null;
  client_id: string | null;
  last_login_at: string | null;
  last_daily_popup_shown: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, accountType: 'admin' | 'user', clientId?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  shouldShowDailyPopup: boolean;
  dismissDailyPopup: () => Promise<void>;
  updateProfileClientId: (clientId: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [shouldShowDailyPopup, setShouldShowDailyPopup] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  };

  const checkDailyPopup = (profileData: Profile | null) => {
    if (!profileData) return false;
    
    const today = new Date().toISOString().split('T')[0];
    const lastShown = profileData.last_daily_popup_shown;
    
    return !lastShown || lastShown < today;
  };

  const updateLastLogin = async (userId: string) => {
    await supabase
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch with setTimeout to avoid deadlock
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            setShouldShowDailyPopup(checkDailyPopup(profileData));
            
            if (event === 'SIGNED_IN') {
              await updateLastLogin(session.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
          setShouldShowDailyPopup(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(profileData => {
          setProfile(profileData);
          setShouldShowDailyPopup(checkDailyPopup(profileData));
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, accountType: 'admin' | 'user', clientId?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          account_type: accountType,
          client_id: clientId || null,
        },
      },
    });

    // If signup successful and we have a clientId, update the profile
    if (!error && data.user && clientId) {
      await supabase
        .from('profiles')
        .update({ client_id: clientId })
        .eq('id', data.user.id);
    }

    return { error };
  };

  const updateProfileClientId = async (clientId: string) => {
    if (!user) return { error: new Error('No user logged in') };
    
    const { error } = await supabase
      .from('profiles')
      .update({ client_id: clientId })
      .eq('id', user.id);
    
    if (!error) {
      // Refresh profile
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth?mode=reset`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { error };
  };

  const dismissDailyPopup = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('profiles')
      .update({ last_daily_popup_shown: today })
      .eq('id', user.id);
    
    setShouldShowDailyPopup(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        shouldShowDailyPopup,
        dismissDailyPopup,
        updateProfileClientId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
