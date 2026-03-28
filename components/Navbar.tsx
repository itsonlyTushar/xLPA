"use client";

import { useUser, useClerk, useSession } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { createClerkSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import Link from "next/link";
import { LogOut, Flame, User as UserIcon, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useUser();
  const { session } = useSession();
  const { signOut } = useClerk();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function fetchStreak() {
      if (!session || !user || !isSupabaseConfigured) return;
      const supabase = createClerkSupabaseClient(session);
      const { data } = await supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", user.id)
        .single();
      
      if (data) setStreak(data.current_streak);
    }
    fetchStreak();
  }, [session, user]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-black/60 backdrop-blur-md shrink-0">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-muted hover:text-foreground md:hidden transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-muted">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
            <span>{streak} DAY STREAK</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt=""
                    className="w-7 h-7 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-muted" />
                  </div>
                )}
              </div>
              <button
                onClick={() => signOut()}
                className="text-muted hover:text-foreground transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
