"use client";

import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowUpRight, Check, ChevronRight,
  Circle, CircleDashed, Clock3, ExternalLink, FileText, Gauge, LoaderCircle, Network,
  Play, Printer, Radar, RefreshCw, Scale, ShieldAlert, Sparkles, Target, Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { BrandMark } from "@/components/brand-mark";
import { demoScenarioPrompts } from "@/lib/demo/heliograph";
import { pipelineStages } from "@/lib/orchestration/events";
import { ScenarioUpdateSchema, type AgentReport, type CommitteeStatement, type EvidenceItem, type InvestigationRun } from "@/lib/schemas/investigation";

export type StageState = { status: "queued" | "running" | "complete" | "low_evidence" | "failed"; message: string };
export type WorkspaceTab = "investigation" | "verdict" | "scenarios" | "memo";

type Props = {
  mode: "demo" | "live";
  targetUrl: string;
  running: boolean;
  run: InvestigationRun | null;
  setRun: React.Dispatch<React.SetStateAction<InvestigationRun | null>>;
  stages: Record<string, StageState>;
  agents: AgentReport[];
  evidence: EvidenceItem[];
  committee: CommitteeStatement[];
  error: string | null;
  tab: WorkspaceTab;
  setTab: (tab: WorkspaceTab) => void;
  onReset: () => void;
  onDemo: () => void;
};

const tabs: { id: WorkspaceTab; label: string; icon: typeof Radar }[] = [
  { id: "investigation", label: "Investigation", icon: Radar },
  { id: "verdict", label: "Verdict", icon: Gauge },
  { id: "scenarios", label: "Stress tests", icon: Zap },
  { id: "memo", label: "Memo", icon: FileText },
];

function StatusIcon({ status }: { status?: StageState["status"] }) {
  if (status === "running") return <LoaderCircle size={13} className="animate-spin text-[var(--cyan)]" />;
  if (status === "complete") return <Check size={13} className="text-[var(--green)]" />;
  if (status === "low_evidence") return <AlertTriangle size={13} className="text-[var(--amber)]" />;
  if (status === "failed") return <AlertTriangle size={13} className="text-[var(--red)]" />;
  return <Circle size={8} className="text-[#475158]" />;
}

function ModeBadge({ mode }: { mode: "demo" | "live" }) {
  return <span className={`mono border px-2 py-1 text-[9px] uppercase ${mode === "demo" ? "border-[#765b31] bg-[#281e12] text-[var(--amber)]" : "border-[#24565c] bg-[#102327] text-[var(--cyan)]"}`}>{mode === "demo" ? "Fictional demo data" : "Live website evidence"}</span>;
}

export function Workspace(props: Props) {
  const completed = Object.values(props.stages).filter((stage) => stage.status === "complete" || stage.status === "low_evidence").length;
  const progress = props.run ? 100 : Math.round((completed / pipelineStages.length) * 100);
  const activeAgent = props.agents.at(-1);
  const canOpen = Boolean(props.run);

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      <header className="no-print sticky top-0 z-40 border-b border-[#202629] bg-[rgba(8,9,10,.94)] backdrop-blur-xl">
        <div className="flex h-14 items-center gap-4 px-3 sm:px-5">
          <button onClick={props.onReset} className="focus-ring hidden items-center gap-2 text-[#89969c] hover:text-white sm:flex" title="New investigation">
            <ArrowLeft size={16} /><BrandMark />
          </button>
          <button onClick={props.onReset} className="focus-ring sm:hidden" title="New investigation"><BrandMark compact /></button>
          <div className="hidden h-5 w-px bg-[#293034] lg:block" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-xs font-semibold text-[#dce3e6]">{props.run?.profile.name || props.targetUrl}</span>
              <span className="hidden sm:inline"><ModeBadge mode={props.mode} /></span>
            </div>
          </div>
          <div className="hidden w-40 items-center gap-3 md:flex">
            <div className="h-1 flex-1 overflow-hidden bg-[#242b2f]"><div className="meter-fill h-full bg-[var(--cyan)]" style={{ width: `${progress}%` }} /></div>
            <span className="mono w-8 text-right text-[9px] text-[#89969c]">{progress}%</span>
          </div>
          <span className="flex items-center gap-2 text-[10px] text-[#7e8a90]">
            <span className={`size-1.5 ${props.running ? "animate-pulse bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)]" : "bg-[var(--green)]"}`} />
            {props.running ? "ANALYZING" : props.run ? "MEMO READY" : "HALTED"}
          </span>
        </div>
        <nav className="flex h-11 items-end gap-1 overflow-x-auto px-3 sm:px-5" aria-label="Workspace views">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} disabled={!canOpen && id !== "investigation"} onClick={() => props.setTab(id)} className={`focus-ring flex h-10 shrink-0 items-center gap-2 border-b px-3 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${props.tab === id ? "border-[var(--cyan)] text-white" : "border-transparent text-[#7f8b91] hover:text-white"}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </nav>
      </header>

      {props.error && (
        <div className="no-print mx-auto mt-4 flex max-w-[1500px] items-center gap-3 border border-[#5b302e] bg-[#211313] px-4 py-3 text-sm text-[#f2a29d]">
          <ShieldAlert size={17} className="shrink-0" /><span className="flex-1">{props.error}</span>
          {props.mode === "live" && <button onClick={props.onDemo} className="focus-ring shrink-0 border border-[#654f2f] px-3 py-1.5 text-xs text-[var(--amber)]">Open demo</button>}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={props.tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>
          {props.tab === "investigation" && <InvestigationView {...props} activeAgent={activeAgent} />}
          {props.tab === "verdict" && props.run && <VerdictView run={props.run} onMemo={() => props.setTab("memo")} />}
          {props.tab === "scenarios" && props.run && <ScenarioView run={props.run} setRun={props.setRun} mode={props.mode} />}
          {props.tab === "memo" && props.run && <MemoView run={props.run} />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

function InvestigationView(props: Props & { activeAgent?: AgentReport }) {
  return (
    <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[224px_minmax(0,1fr)] xl:grid-cols-[224px_minmax(0,1fr)_340px]">
      <aside className="no-print hidden min-h-[calc(100vh-101px)] border-r border-[#202629] p-4 lg:block">
        <div className="mono mb-4 flex items-center justify-between text-[9px] uppercase text-[#718087]"><span>Investigation pipeline</span><span>{Object.keys(props.stages).length}/15</span></div>
        <ol className="space-y-0.5">
          {pipelineStages.map((stage, index) => {
            const state = props.stages[stage.id];
            return (
              <li key={stage.id} className={`relative flex min-h-9 items-center gap-3 border-l px-3 text-[11px] ${state?.status === "running" ? "border-[var(--cyan)] bg-[#10191b] text-white" : "border-[#242c30] text-[#829097]"}`}>
                <StatusIcon status={state?.status} />
                <span className="min-w-0 flex-1 truncate">{stage.label}</span>
                <span className="mono text-[8px] text-[#515d63]">{String(index + 1).padStart(2, "0")}</span>
              </li>
            );
          })}
        </ol>
      </aside>

      <section className="min-w-0 border-r border-[#202629]">
        <div className="border-b border-[#202629] px-4 py-5 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="mono text-[9px] uppercase text-[var(--cyan)]">Active intelligence node</div>
              <h1 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{props.activeAgent?.role || "Secure discovery"}</h1>
            </div>
            {props.activeAgent && <div className="flex items-center gap-2 text-xs text-[#87949a]"><Activity size={14} className="text-[var(--cyan)]" />Confidence {Math.round(props.activeAgent.confidence * 100)}%</div>}
          </div>
        </div>

        <div className="relative overflow-hidden border-b border-[#202629] px-4 py-8 sm:px-7">
          <div className="signal-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="scan-line pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--cyan)] opacity-30" />
          <div className="relative grid gap-8 md:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#7f8c92]"><Network size={15} /> Current mandate</div>
              <p className="mt-3 max-w-[760px] text-lg leading-8 text-[#e4eaec]">{props.activeAgent?.task || "Validating the destination, respecting source policy, and mapping reachable company evidence."}</p>
              <div className="mt-7 border-l border-[var(--cyan-dim)] pl-4">
                <div className="mono text-[9px] uppercase text-[#78868c]">Emerging conclusion</div>
                <p className="mt-2 text-sm leading-6 text-[#aeb8bd]">{props.activeAgent?.summary || "No conclusion issued. Evidence collection is still in progress."}</p>
              </div>
            </div>
            <div className="relative mx-auto grid size-[190px] place-items-center rounded-full border border-[#263238] bg-[#0a0d0f]">
              <div className="absolute inset-4 rounded-full border border-[#2f3a3f]" />
              <div className="absolute inset-9 rounded-full border border-dashed border-[#31545a] motion-safe:animate-[spin_16s_linear_infinite]" />
              <div className="absolute left-1/2 top-0 h-full w-px bg-[#1d292d]" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-[#1d292d]" />
              <div className="z-10 grid size-14 place-items-center rounded-full border border-[#3c737a] bg-[#102025] shadow-[0_0_35px_rgba(107,230,239,.12)]"><Radar size={23} className="text-[var(--cyan)]" /></div>
              <span className="absolute bottom-4 right-7 size-1.5 bg-[var(--amber)] shadow-[0_0_10px_var(--amber)]" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2">
          <div className="border-b border-[#202629] p-4 sm:p-7 lg:border-b-0 lg:border-r">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold">Findings</h2><span className="mono text-[9px] text-[#637178]">REASONING SUMMARY</span></div>
            <div className="space-y-3">
              {(props.activeAgent?.findings || ["Awaiting the first validated specialist report."]).map((finding, index) => (
                <div key={finding} className="flex gap-3 border-t border-[#1e2528] py-3 text-sm leading-6 text-[#aeb8bd]"><span className="mono text-[9px] text-[var(--cyan)]">0{index + 1}</span><span>{finding}</span></div>
              ))}
            </div>
          </div>
          <div className="p-4 sm:p-7">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold">Unknowns</h2><span className="mono text-[9px] text-[#637178]">CONFIDENCE LIMITERS</span></div>
            <div className="space-y-2">
              {(props.activeAgent?.unknowns.length ? props.activeAgent.unknowns : ["Source coverage is being established."]).map((unknown) => (
                <div key={unknown} className="flex items-start gap-3 border border-[#252c30] bg-[#0b0e10] p-3 text-xs leading-5 text-[#909ca2]"><CircleDashed size={14} className="mt-0.5 shrink-0 text-[var(--amber)]" />{unknown}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#202629] p-4 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold"><Scale size={15} /> Committee channel</h2>
            <span className="mono text-[9px] text-[#647178]">{props.committee.length} STATEMENTS</span>
          </div>
          <div className="space-y-1">
            {props.committee.length ? props.committee.map((statement) => <CommitteeRow key={statement.id} statement={statement} />) : <p className="border border-dashed border-[#263034] p-5 text-center text-xs text-[#68757b]">Committee opens after specialist review.</p>}
          </div>
        </div>
        <EvidenceRail evidence={props.evidence} mode={props.mode} mobile />
      </section>

      <EvidenceRail evidence={props.evidence} mode={props.mode} />
    </div>
  );
}

function CommitteeRow({ statement }: { statement: CommitteeStatement }) {
  const color = statement.stance === "positive" ? "text-[var(--green)]" : statement.stance === "negative" ? "text-[var(--red)]" : "text-[var(--amber)]";
  return (
    <motion.article initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className={`grid gap-2 border-l px-4 py-4 sm:grid-cols-[130px_1fr] ${statement.isDissent ? "border-[var(--red)] bg-[#16100f]" : "border-[#2d373b] bg-[#0b0e10]"}`}>
      <div><span className={`mono text-[9px] uppercase ${color}`}>{statement.role}</span>{statement.isDissent && <div className="mt-1 text-[9px] text-[var(--red)]">DISSENT</div>}</div>
      <p className="text-xs leading-5 text-[#a8b3b8]">{statement.statement}</p>
    </motion.article>
  );
}

function EvidenceRail({ evidence, mode, mobile = false }: { evidence: EvidenceItem[]; mode: "demo" | "live"; mobile?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <aside className={mobile ? "no-print border-t border-[#202629] p-4 xl:hidden" : "no-print hidden max-h-[calc(100vh-101px)] overflow-y-auto p-4 xl:block fine-scroll"}>
      <div className="sticky top-0 z-10 -mx-1 mb-4 flex items-center justify-between bg-[#08090a] px-1 pb-3">
        <div><div className="mono text-[9px] uppercase text-[#708087]">Evidence stream</div><div className="mt-1 text-xs text-[#a7b1b6]">{evidence.length} sources discovered</div></div>
        <Target size={16} className="text-[var(--cyan)]" />
      </div>
      <div className="space-y-2">
        {evidence.map((item, index) => (
          <motion.article key={item.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="border border-[#242c30] bg-[#0c0f11]">
            <button onClick={() => setOpen(open === item.id ? null : item.id)} className="focus-ring w-full p-3 text-left">
              <div className="mb-3 flex items-center justify-between gap-2"><span className="mono text-[8px] text-[#657279]">EV-{String(index + 1).padStart(2, "0")}</span><span className={`text-[9px] uppercase ${item.reliability === "high" ? "text-[var(--green)]" : item.reliability === "medium" ? "text-[var(--amber)]" : "text-[var(--red)]"}`}>{item.reliability} reliability</span></div>
              <h3 className="text-xs font-semibold leading-5 text-[#dce3e5]">{item.title}</h3>
              <p className={`mt-2 text-[11px] leading-5 text-[#7f8c92] ${open === item.id ? "" : "line-clamp-3"}`}>{item.excerpt}</p>
              <div className="mt-3 flex items-center justify-between"><span className="text-[9px] text-[#637077]">{item.sourceType}</span><ChevronRight size={12} className={`transition-transform ${open === item.id ? "rotate-90" : ""}`} /></div>
            </button>
            {open === item.id && (
              <div className="border-t border-[#242c30] px-3 py-3">
                <div className="text-[9px] uppercase text-[#627077]">Supports</div>
                {item.supports.map((claim) => <p key={claim} className="mt-2 text-[10px] leading-4 text-[#9ba6ab]">{claim}</p>)}
                {mode === "live" ? <a href={item.url} target="_blank" rel="noreferrer noopener" className="focus-ring mt-3 flex items-center gap-1.5 text-[10px] text-[var(--cyan)]">Open source <ExternalLink size={11} /></a> : <span className="mt-3 block text-[9px] uppercase text-[var(--amber)]">Fictional demo source</span>}
              </div>
            )}
          </motion.article>
        ))}
        {!evidence.length && <div className="border border-dashed border-[#263034] p-6 text-center text-xs text-[#68757b]">Scanning reachable company pages...</div>}
      </div>
    </aside>
  );
}

function VerdictView({ run, onMemo }: { run: InvestigationRun; onMemo: () => void }) {
  return (
    <div className="mx-auto max-w-[1380px] px-4 py-7 sm:px-7">
      <section className="grid gap-6 border-b border-[#252c30] pb-8 lg:grid-cols-[1fr_330px]">
        <div>
          <div className="flex flex-wrap items-center gap-3"><ModeBadge mode={run.mode} /><span className="mono text-[9px] text-[#718087]">ANALYZED {new Date(run.profile.analyzedAt).toLocaleDateString()}</span></div>
          <h1 className="mt-5 text-4xl font-semibold text-white">{run.profile.name}</h1>
          <p className="mt-3 max-w-[780px] text-base leading-7 text-[#9ea9ae]">{run.profile.description}</p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#718087]"><span>{run.profile.category}</span><span>{run.profile.stage} {run.profile.stageInferred && "(inferred)"}</span><span>{run.profile.location}</span><span>{run.profile.founders.join(" · ") || "Founders unknown"}</span></div>
        </div>
        <div className="border-l border-[#344047] bg-[#0d1113] p-5">
          <div className="mono text-[9px] uppercase text-[#708087]">Committee recommendation</div>
          <div className="mt-3 flex items-end justify-between"><span className="text-3xl font-semibold text-white">{run.verdict.recommendation}</span><span className="mono text-[10px] text-[var(--cyan)]">{run.verdict.conviction}/100</span></div>
          <p className="mt-4 text-xs leading-5 text-[#91a0a6]">{run.verdict.summary}</p>
          <button onClick={onMemo} className="focus-ring mt-5 flex items-center gap-2 text-xs font-semibold text-[var(--cyan)]">Read committee memo <ArrowUpRight size={14} /></button>
        </div>
      </section>

      <section className="border-b border-[#252c30] py-4">
        {run.warnings.slice(0, 2).map((warning) => (
          <div key={warning} className="mt-2 flex items-start gap-2 text-[10px] leading-5 text-[#8f9ca2] first:mt-0">
            <AlertTriangle size={13} className="mt-0.5 shrink-0 text-[var(--amber)]" />{warning}
          </div>
        ))}
      </section>

      <section className="grid border-b border-[#252c30] lg:grid-cols-3">
        {[
          ["Investment conviction", run.verdict.conviction, "Structured committee judgment"],
          ["Model confidence", run.verdict.confidence, "Confidence in available conclusions"],
          ["Evidence coverage", run.verdict.evidenceCoverage, "Coverage of material diligence areas"],
        ].map(([label, value, note]) => (
          <div key={label} className="border-b border-[#252c30] py-7 lg:border-b-0 lg:border-r lg:px-7 first:pl-0 last:border-r-0">
            <div className="flex items-end justify-between"><span className="text-xs text-[#86939a]">{label}</span><span className="text-2xl font-semibold text-white">{value}%</span></div>
            <div className="mt-4 h-1 bg-[#242c30]"><div className="meter-fill h-full bg-[var(--cyan)]" style={{ width: `${value}%` }} /></div>
            <p className="mt-3 text-[10px] text-[#627077]">{note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 py-8 xl:grid-cols-[1.1fr_.9fr]">
        <div>
          <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">Decision matrix</h2><span className="mono text-[9px] text-[#68767c]">SCORE / CONFIDENCE / COVERAGE</span></div>
          <div className="border-y border-[#252c30]">
            {run.scores.map((score) => (
              <div key={score.id} className="grid grid-cols-[1fr_52px] items-center gap-5 border-b border-[#1f2629] py-4 last:border-b-0 sm:grid-cols-[180px_1fr_52px]">
                <span className="text-xs text-[#a9b3b8]">{score.label}</span>
                <div className="hidden h-1 bg-[#232b2f] sm:block"><div className={`meter-fill h-full ${score.id === "risk" ? "bg-[var(--red)]" : "bg-[var(--cyan)]"}`} style={{ width: `${score.score}%` }} /></div>
                <span className="mono text-right text-xs text-white">{score.score}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">Scenario probabilities</h2><span className="mono text-[9px] text-[#68767c]">RANGES, NOT FORECASTS</span></div>
          <div className="space-y-2">
            {run.probabilities.map((scenario) => (
              <article key={scenario.id} className="border border-[#252d31] bg-[#0c0f11] p-4">
                <div className="flex items-start justify-between gap-4"><div><h3 className="text-xs font-semibold text-[#dce3e5]">{scenario.label}</h3><span className="mt-1 block text-[9px] text-[#657279]">{scenario.horizon} · {scenario.confidence} confidence</span></div><span className="mono shrink-0 text-sm text-[var(--cyan)]">{scenario.range}</span></div>
                <p className="mt-3 text-[10px] leading-4 text-[#849097]">{scenario.basis}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid border-t border-[#252c30] md:grid-cols-3">
        <VerdictList title="Key reasons" items={run.verdict.keyReasons} tone="positive" />
        <VerdictList title="Conditions to invest" items={run.verdict.conditions} tone="neutral" />
        <VerdictList title="Unanswered diligence" items={run.verdict.unansweredQuestions} tone="negative" />
      </section>
      <div className="mt-6 border-l border-[var(--red)] bg-[#15100f] p-5"><div className="mono text-[9px] uppercase text-[var(--red)]">Preserved dissent</div><p className="mt-2 text-sm leading-6 text-[#b8aaab]">{run.verdict.dissent}</p></div>
    </div>
  );
}

function VerdictList({ title, items, tone }: { title: string; items: string[]; tone: "positive" | "neutral" | "negative" }) {
  const color = tone === "positive" ? "text-[var(--green)]" : tone === "negative" ? "text-[var(--red)]" : "text-[var(--amber)]";
  return <div className="border-b border-[#252c30] py-6 md:border-b-0 md:border-r md:px-6 first:pl-0 last:border-r-0"><h3 className={`mono text-[9px] uppercase ${color}`}>{title}</h3><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-[#98a4aa]"><ChevronRight size={12} className={`mt-1 shrink-0 ${color}`} />{item}</li>)}</ul></div>;
}

function ScenarioView({ run, setRun, mode }: { run: InvestigationRun; setRun: Props["setRun"]; mode: "demo" | "live" }) {
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const latest = run.scenarios.at(-1);
  const prompts = mode === "demo" ? demoScenarioPrompts : ["Assume a major platform launches a competing product", "Assume growth stalls for twelve months", "What evidence would most change the recommendation?"];

  async function execute(scenario: string) {
    if (!scenario.trim()) return;
    setLoading(scenario);
    setError(null);
    try {
      const response = await fetch("/api/scenario", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ run, scenario }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Scenario failed.");
      const update = ScenarioUpdateSchema.parse(body.update);
      setRun((current) => current ? ({
        ...current,
        scenarios: [...current.scenarios.filter((item) => item.id !== update.id), update],
        verdict: { ...current.verdict, recommendation: update.recommendation, conviction: Math.max(0, Math.min(100, current.verdict.conviction + update.convictionDelta)), confidence: Math.max(0, Math.min(100, current.verdict.confidence + update.confidenceDelta)) },
        probabilities: current.probabilities.map((item) => ({ ...item, range: update.probabilityUpdates.find((change) => change.scenarioId === item.id)?.range || item.range })),
        memo: { ...current.memo, thesis: update.thesisDelta, changeLog: [...current.memo.changeLog, update.memoEntry] },
      }) : current);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Scenario failed."); }
    finally { setLoading(null); }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-7">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <section>
          <div className="mono text-[9px] uppercase text-[var(--cyan)]">Counterfactual lab</div>
          <h1 className="mt-3 text-3xl font-semibold">Stress the thesis.</h1>
          <p className="mt-4 text-sm leading-6 text-[#8e9aa0]">Each scenario is an assumption layer. Existing evidence remains fixed while the committee recomputes the decision.</p>
          <div className="mt-7 space-y-2">
            {prompts.map((prompt) => (
              <button key={prompt} onClick={() => execute(prompt)} disabled={Boolean(loading)} className="focus-ring group flex w-full items-center gap-3 border border-[#273034] bg-[#0c0f11] p-4 text-left text-xs text-[#aab5ba] transition-colors hover:border-[#3d4a50] hover:text-white disabled:opacity-50">
                {loading === prompt ? <LoaderCircle size={15} className="animate-spin text-[var(--cyan)]" /> : <Play size={14} className="text-[var(--cyan)]" />}<span className="flex-1">{prompt}</span><ChevronRight size={13} />
              </button>
            ))}
          </div>
          <div className="mt-3 flex border border-[#273034] bg-[#0c0f11] p-1">
            <input value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="Test another assumption" maxLength={500} className="focus-ring h-11 min-w-0 flex-1 bg-transparent px-3 text-xs outline-none placeholder:text-[#5f6b71]" />
            <button onClick={() => execute(custom)} disabled={Boolean(loading) || custom.trim().length < 3} className="focus-ring grid size-11 place-items-center bg-[#e9f8f9] text-[#091012] disabled:opacity-30" title="Run scenario"><ArrowUpRight size={16} /></button>
          </div>
          {error && <p className="mt-3 text-xs text-[var(--red)]">{error}</p>}
        </section>

        <section className="border-l border-[#283136] bg-[#0b0e10] p-5 sm:p-7">
          <div className="flex items-center justify-between"><div className="mono text-[9px] uppercase text-[#718087]">Scenario impact</div><Sparkles size={15} className="text-[var(--amber)]" /></div>
          {latest ? (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">{latest.title}</h2>
              <div className="mt-6 grid grid-cols-3 border-y border-[#293136] py-5 text-center">
                <div className="border-r border-[#293136]"><span className="mono block text-lg text-white">{latest.recommendation}</span><span className="text-[9px] text-[#68757b]">DECISION</span></div>
                <div className="border-r border-[#293136]"><span className={`mono block text-lg ${latest.convictionDelta >= 0 ? "text-[var(--green)]" : "text-[var(--red)]"}`}>{latest.convictionDelta > 0 ? "+" : ""}{latest.convictionDelta}</span><span className="text-[9px] text-[#68757b]">CONVICTION</span></div>
                <div><span className="mono block text-lg text-[var(--cyan)]">{latest.confidenceDelta > 0 ? "+" : ""}{latest.confidenceDelta}</span><span className="text-[9px] text-[#68757b]">CONFIDENCE</span></div>
              </div>
              <div className="mt-6"><div className="mono text-[9px] uppercase text-[#68757b]">Thesis delta</div><p className="mt-3 text-sm leading-7 text-[#acb7bc]">{latest.thesisDelta}</p></div>
              <div className="mt-6"><div className="mono text-[9px] uppercase text-[#68757b]">Risk updates</div>{latest.riskUpdates.map((risk) => <div key={risk} className="mt-2 flex gap-2 border-l border-[var(--red)] bg-[#15100f] px-3 py-2 text-xs text-[#b9aaab]"><AlertTriangle size={13} className="shrink-0 text-[var(--red)]" />{risk}</div>)}</div>
              <div className="mt-6 space-y-2">{latest.probabilityUpdates.map((update) => <div key={update.scenarioId} className="flex items-start justify-between gap-5 border-t border-[#252d31] py-3"><p className="text-[10px] leading-4 text-[#7e8b91]">{update.rationale}</p><span className="mono shrink-0 text-xs text-[var(--cyan)]">{update.range}</span></div>)}</div>
            </div>
          ) : <div className="grid min-h-[440px] place-items-center text-center"><div><Clock3 size={28} className="mx-auto text-[#3b474c]" /><p className="mt-4 text-sm text-[#78858b]">No counterfactual applied</p><p className="mt-2 text-xs text-[#505c62]">Baseline conviction remains {run.verdict.conviction}/100.</p></div></div>}
        </section>
      </div>
    </div>
  );
}

function MemoView({ run }: { run: InvestigationRun }) {
  const sourceMap = useMemo(() => new Map(run.evidence.map((item, index) => [item.id, index + 1])), [run.evidence]);
  return (
    <div className="mx-auto max-w-[980px] px-4 py-8 sm:px-7">
      <div className="no-print mb-4 flex items-center justify-between"><ModeBadge mode={run.mode} /><button onClick={() => window.print()} className="focus-ring flex items-center gap-2 border border-[#2c363b] px-3 py-2 text-xs text-[#a7b2b7] hover:text-white"><Printer size={14} /> Print memo</button></div>
      <article className="memo-print border border-[#293136] bg-[#0d1012] px-5 py-8 sm:px-12 sm:py-12">
        <header className="border-b border-[#30393d] pb-10">
          <div className="flex items-center justify-between"><BrandMark /><span className="mono text-[9px] text-[#68757b]">IC MEMORANDUM</span></div>
          <h1 className="mt-12 text-4xl font-semibold leading-tight">{run.memo.title}</h1>
          <div className="mt-5 flex flex-wrap gap-4 text-[10px] text-[#78858b]"><span>{new Date(run.memo.generatedAt).toLocaleString()}</span><span>{run.memo.model}</span><span>{run.evidence.length} evidence items</span></div>
        </header>
        <section className="border-b border-[#30393d] py-9"><div className="mono text-[9px] uppercase text-[var(--cyan)]">Executive summary</div><p className="mt-4 text-base leading-8 text-[#c6ced2]">{run.memo.executiveSummary}</p></section>
        <section className="border-b border-[#30393d] py-9"><div className="flex items-center justify-between"><div className="mono text-[9px] uppercase text-[var(--cyan)]">Recommendation</div><span className="text-xl font-semibold">{run.verdict.recommendation}</span></div><p className="mt-4 text-sm leading-7 text-[#a6b1b6]">{run.memo.thesis}</p></section>
        {run.memo.sections.map((section, index) => (
          <section key={section.id} className="grid border-b border-[#30393d] py-9 sm:grid-cols-[42px_1fr]">
            <span className="mono text-[9px] text-[#5f6c72]">{String(index + 1).padStart(2, "0")}</span>
            <div><h2 className="text-xl font-semibold">{section.title}</h2><p className="mt-4 text-sm leading-7 text-[#a5b0b5]">{section.body}</p>{section.evidenceIds.length > 0 && <div className="mt-4 flex gap-1.5">{section.evidenceIds.map((id) => <span key={id} className="mono border border-[#314047] px-1.5 py-0.5 text-[8px] text-[var(--cyan)]">[{sourceMap.get(id) || "?"}]</span>)}</div>}</div>
          </section>
        ))}
        {run.memo.changeLog.length > 0 && <section className="border-b border-[#30393d] py-9"><h2 className="text-xl font-semibold">Memo change log</h2>{run.memo.changeLog.map((entry, index) => <div key={`${entry}-${index}`} className="mt-4 flex gap-3 text-xs leading-5 text-[#8e9ba1]"><RefreshCw size={13} className="mt-1 shrink-0 text-[var(--amber)]" />{entry}</div>)}</section>}
        <section className="py-9"><h2 className="text-xl font-semibold">Source appendix</h2><ol className="mt-6 space-y-4">{run.evidence.map((item, index) => <li key={item.id} className="grid gap-2 text-xs sm:grid-cols-[30px_1fr_auto]"><span className="mono text-[var(--cyan)]">[{index + 1}]</span><div><div className="text-[#c6ced1]">{item.title}</div><div className="mt-1 text-[10px] text-[#68757b]">{item.sourceType} · {item.reliability} reliability</div></div>{run.mode === "live" ? <a href={item.url} target="_blank" rel="noreferrer noopener" className="no-print text-[#849197] hover:text-white"><ExternalLink size={13} /></a> : <span className="mono text-[8px] text-[var(--amber)]">DEMO</span>}</li>)}</ol></section>
        <footer className="border-t border-[#30393d] pt-7 text-[10px] leading-5 text-[#68757b]">{run.memo.methodology}</footer>
      </article>
    </div>
  );
}
