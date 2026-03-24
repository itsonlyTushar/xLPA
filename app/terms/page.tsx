"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import XLPALogo from "@/components/XLPALogo";

export default function TermsOfUse() {
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
              Terms of <span className="text-primary italic">Use</span>
            </h1>
            <p className="text-muted/60 text-lg leading-relaxed">
              Last updated: March 24, 2024. By using xLPA, you agree to these terms.
            </p>
          </section>

          <div className="grid gap-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white font-playfair">1. Acceptable Use</h2>
              <p className="leading-relaxed">
                xLPA is a platform for learning and professional development. You agree to use the Studio environment responsibly. Prohibited activities include:
              </p>
              <ul className="list-disc pl-6 space-y-3 marker:text-primary">
                <li>Attempting to bypass security measures or access other users' private data.</li>
                <li>Executing malicious code or performing denial-of-service attacks on our infrastructure.</li>
                <li>Using the platform for any illegal activities or to harass community members.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white font-playfair">2. Intellectual Property</h2>
              <p className="leading-relaxed">
                The content provided on xLPA (curriculum, design, platform code) is owned by our community and maintainers.
              </p>
              <ul className="list-disc pl-6 space-y-3 marker:text-primary">
                <li>
                  <strong className="text-white">Your Code:</strong> You retain ownership of any code you write in the Studio. However, by using the platform, you grant us the right to store and process this code to provide the service.
                </li>
                <li>
                  <strong className="text-white">Contributions:</strong> If you contribute to our open-source repositories, your contributions will be governed by the repository&apos;s specific license (e.g., MIT).
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white font-playfair">3. Account Responsibility</h2>
              <p className="leading-relaxed">
                You are responsible for maintaining the security of your account. Do not share your login credentials. We are not liable for any loss or damage from your failure to comply with this security obligation.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white font-playfair">4. Disclaimer of Warranty</h2>
              <p className="leading-relaxed">
                xLPA is provided &quot;as is&quot; without any warranty. We do not guarantee that the platform will be error-free or uninterrupted. Use the platform and its curriculum at your own risk.
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
