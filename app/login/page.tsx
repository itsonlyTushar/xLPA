"use client";

import { useSignIn, useUser } from "@clerk/nextjs";
import { Zap } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import XLPALogo from "@/components/XLPALogo";
import Grainient from "@/components/Grainient";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  const handleGithubLogin = async () => {
    if (!signIn) return;

    try {
      await signIn.sso({
        strategy: "oauth_github",
        redirectUrl: "/dashboard",
        redirectCallbackUrl: "/sso-callback",
      });
    } catch (error) {
      console.error("Error logging in with GitHub:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-black relative overflow-hidden">
      {/* Background Grainient */}
      <div className="absolute inset-0 z-0 opacity-100">
        <Grainient
          color1="#030303"
          color2="#363e0f "
          color3="#030302"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-8">
            <XLPALogo href="/" size="2xl" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-10 shadow-2xl">
          <button
            onClick={handleGithubLogin}
            disabled={!signIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-black px-6 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>

          <div id="clerk-captcha"></div>

          <div className="mt-8 text-center text-sm text-muted/40">
            By signing in, you agree to level up your engineering skills.
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted/60 hover:text-primary transition-colors inline-flex items-center gap-1 group"
          >
            Explore{" "}
            <XLPALogo showLogoOnly size="xs" className="text-foreground/90" />{" "}
            first
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
