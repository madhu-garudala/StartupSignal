"use client";

import Image from "next/image";
import { ArrowRight, CircuitBoard, DatabaseZap, Scale, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { BrandMark } from "@/components/brand-mark";

type Props = {
  url: string;
  setUrl: (url: string) => void;
  error: string | null;
  onAnalyze: () => void;
  onDemo: () => void;
};

const capabilities = [
  { icon: DatabaseZap, title: "Evidence before opinion", copy: "Claims preserve source, reliability, uncertainty, and missing proof." },
  { icon: CircuitBoard, title: "Specialists with a mandate", copy: "Product, founder, technical, market, growth, and risk perspectives." },
  { icon: Scale, title: "A committee, not a score", copy: "Bull and bear cases survive into a structured partner decision." },
];

export function Landing({ url, setUrl, error, onAnalyze, onDemo }: Props) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08090a]">
      <section className="relative flex min-h-[92vh] flex-col border-b border-[#1c2225]">
        <Image src="/command-orbit.png" alt="Abstract orbital analysis instrument" fill priority sizes="100vw" className="object-cover opacity-[.34]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,9,10,.24),rgba(8,9,10,.58)_55%,#08090a_98%)]" />
        <div className="signal-grid pointer-events-none absolute inset-0 opacity-40" />
        <header className="relative z-10 mx-auto flex w-full max-w-[1240px] items-center justify-between px-5 py-6 md:px-8">
          <BrandMark />
          <button onClick={onDemo} className="focus-ring flex items-center gap-2 text-xs font-semibold text-[#c7d0d4] transition-colors hover:text-white">
            <Sparkles size={14} /> Run demo
          </button>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-[1040px] flex-1 flex-col items-center justify-center px-5 pb-20 pt-12 text-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
            <div className="mono mb-5 text-[10px] uppercase text-[#9aa8ae]">Autonomous venture diligence // evidence protocol active</div>
            <h1 className="text-balance mx-auto max-w-[900px] text-5xl font-semibold leading-[1.02] tracking-normal text-white md:text-7xl">
              Turn any startup URL into investment conviction.
            </h1>
            <p className="text-balance mx-auto mt-6 max-w-[720px] text-base leading-7 text-[#aab4b9] md:text-lg">
              StartupSignal investigates founders, product, market, technology, competition, momentum, and risk, then convenes an AI investment committee around the evidence.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .55 }} className="mt-10 w-full max-w-[760px]">
            <div className="glass flex flex-col gap-2 border border-[#374147] p-2 shadow-[0_20px_80px_rgba(0,0,0,.5),0_0_40px_rgba(107,230,239,.05)] sm:flex-row">
              <label className="sr-only" htmlFor="startup-url">Startup website URL</label>
              <input
                id="startup-url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && onAnalyze()}
                placeholder="https://example-startup.com"
                className="focus-ring h-14 min-w-0 flex-1 bg-transparent px-4 text-base text-white outline-none placeholder:text-[#667178]"
                autoComplete="url"
              />
              <button onClick={onAnalyze} className="focus-ring flex h-14 items-center justify-center gap-2 bg-[#eaf9fa] px-6 text-sm font-bold text-[#071012] transition-colors hover:bg-white">
                Analyze startup <ArrowRight size={17} />
              </button>
            </div>
            <div className="mt-3 flex min-h-5 items-center justify-between gap-4 px-1 text-left">
              <span className="text-xs text-[var(--red)]" role="alert">{error}</span>
              <button onClick={onDemo} className="focus-ring ml-auto shrink-0 text-xs text-[#87959b] underline decoration-[#384248] underline-offset-4 hover:text-white">Explore fictional Heliograph demo</button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 md:px-8">
        <div className="mb-12 flex max-w-[760px] items-start gap-4">
          <span className="mono mt-1 text-[10px] text-[var(--cyan)]">01 / PROTOCOL</span>
          <h2 className="text-balance text-3xl font-semibold leading-tight text-white md:text-4xl">From open web evidence to a decision you can interrogate.</h2>
        </div>
        <div className="grid border-y border-[#202629] md:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, copy }, index) => (
            <article key={title} className="border-b border-[#202629] px-0 py-8 md:border-b-0 md:border-r md:px-7 md:last:border-r-0">
              <div className="mb-8 flex items-center justify-between">
                <Icon size={20} strokeWidth={1.4} className="text-[var(--cyan)]" />
                <span className="mono text-[10px] text-[#5f6b70]">0{index + 1}</span>
              </div>
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#8d989e]">{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
