"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { LogOut, Flame, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-black/60 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <span className="font-bold text-xl tracking-tight font-playfair">
            <span className="font-pacifico font-normal lowercase mx-1">x</span>
            LPA
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-muted">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
            <span>0 DAY STREAK</span>
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
