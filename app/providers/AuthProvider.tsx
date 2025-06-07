'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { UserProfile } from '@/lib/supabase'
import { analytics } from '@/lib/analytics'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserSupabaseClient()

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  // Check if user is returning (has existing profile)
  const isReturningUser = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', userId)
        .single()

      if (error || !data) return false
      
      // If profile was created more than 5 minutes ago, consider them a returning user
      const profileAge = Date.now() - new Date(data.created_at).getTime()
      return profileAge > 5 * 60 * 1000 // 5 minutes
    } catch (error) {
      return false
    }
  }

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          const userProfile = await fetchProfile(session.user.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        analytics.trackError('unknown', 'Auth initialization failed', 'medium')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        
        if (session?.user) {
          setUser(session.user)
          const userProfile = await fetchProfile(session.user.id)
          setProfile(userProfile)
          
          // Track login events (but not initial page loads)
          if (event === 'SIGNED_IN') {
            const isReturning = await isReturningUser(session.user.id)
            analytics.trackLoginCompleted(isReturning)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        analytics.trackError('api_failure', `Signup failed: ${error.message}`, 'medium')
        return { error: error.message }
      }

      // Track successful signup
      if (data.user) {
        analytics.trackSignupCompleted(document.referrer || 'direct')
      }

      return {}
    } catch (error) {
      analytics.trackError('unknown', 'Unexpected signup error', 'high')
      return { error: 'An unexpected error occurred during sign up' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        analytics.trackError('api_failure', `Signin failed: ${error.message}`, 'medium')
        return { error: error.message }
      }

      // Track successful signin (detailed tracking happens in auth state change)
      return {}
    } catch (error) {
      analytics.trackError('unknown', 'Unexpected signin error', 'high')
      return { error: 'An unexpected error occurred during sign in' }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      
      // Track page view for signed out state
      analytics.trackPageView('Signed Out', {
        previous_state: 'authenticated'
      })
    } catch (error) {
      console.error('Error signing out:', error)
      analytics.trackError('api_failure', 'Signout failed', 'low')
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: 'No user logged in' }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) {
        analytics.trackError('api_failure', `Profile update failed: ${error.message}`, 'medium')
        return { error: error.message }
      }

      // Refresh profile data
      await refreshProfile()
      return {}
    } catch (error) {
      analytics.trackError('unknown', 'Unexpected profile update error', 'medium')
      return { error: 'An unexpected error occurred updating profile' }
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await fetchProfile(user.id)
      setProfile(userProfile)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 