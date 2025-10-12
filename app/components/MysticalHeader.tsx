"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { User, LogOut, History } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Button } from "./ui/button"
import { AuthModal } from "./auth/AuthModal"

export function MysticalHeader() {
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="font-witchcraft text-2xl text-amber-400 hover:text-amber-300 transition-colors">
            TarotSnap
          </Link>
          
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/50">
                    <History className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => setShowAuthModal(true)}
                className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/50"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}

