"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { Zap, LogOut, Flame, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 h-14">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">DSA Learner</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>0 day streak</span>
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
