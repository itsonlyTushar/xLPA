"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import XLPALogo from "@/components/XLPALogo";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12 lg:p-24 selection:bg-primary/30">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex items-center justify-between border-b border-white/5 pb-8">
          <XLPALogo href="/" size="lg" />
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-muted/40 hover:text-primary transition-colors uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </header>

        <main className="space-y-16">
          <section className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold font-playfair text-white tracking-tight">
              Privacy <span className="text-primary italic">Policy</span>
            </h1>
            <p className="text-muted/60 text-lg leading-relaxed">
              Last updated: March 24, 2024. Your privacy is fundamental to our mission of building a better engineering community.
            </p>
          </section>

          <div className="grid gap-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white font-playfair">1. Information We Collect</h2>
              <p className="leading-relaxed">
                We collect information to provide a personalized learning experience. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-3 marker:text-primary">
                <li>
                  <strong className="text-white">Account Information:</strong> We use Clerk for authentication. Your email and profile information are stored securely to manage your account and progress.
                </li>
                <li>
                  <strong className="text-white">Learning Activity:</strong> We track your progress through DSA challenges, Machine Coding modules, and System Design roadmaps to help you visualize your growth.
                </li>
                <li>
                  <strong className="text-white">Code Submissions:</strong> Code you write in the Studio is stored to allow you to resume your work across devices.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white font-playfair">2. How We Use Data</h2>
              <p className="leading-relaxed">
                Your data is used exclusively to power the xLPA ecosystem. We do not sell your personal information to third parties. Data is used to:
              </p>
              <ul className="list-disc pl-6 space-y-3 marker:text-primary">
                <li>Provide persistent access to your coding environment.</li>
                <li>Analyze aggregate patterns to improve our curriculum.</li>
                <li>Communicate critical updates regarding your account or the platform.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white font-playfair">3. Third-Party Services</h2>
              <p className="leading-relaxed">
                We leverage industry-standard services to ensure the best experience:
              </p>
              <ul className="list-disc pl-6 space-y-3 marker:text-primary">
                <li>
                  <strong className="text-white">Clerk:</strong> Provides secure authentication and user management.
                </li>
                <li>
                  <strong className="text-white">GitHub:</strong> If you choose to contribute to our open-source repositories.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white font-playfair">4. Your Rights</h2>
              <p className="leading-relaxed">
                You have full control over your data. You can request to view, modify, or delete your account information at any time through your dashboard settings or by contacting our community maintainers.
              </p>
            </section>
          </div>
        </main>

        <footer className="pt-20 border-t border-white/5 text-[10px] font-bold tracking-[0.2em] uppercase text-muted/30 text-center">
          &copy; 2024 Engineering Studio Inc. &bull; xLPA Ecosystem
        </footer>
      </div>
    </div>
  );
}
