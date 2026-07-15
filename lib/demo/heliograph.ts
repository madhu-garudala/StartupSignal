import { InvestigationRunSchema, type AgentReport, type InvestigationRun } from "@/lib/schemas/investigation";

const analyzedAt = "2026-07-15T14:00:00.000Z";
const demoBase = "https://demo.startupsignal.dev/heliograph";

const sources = [
  { id: "src-product", title: "Heliograph product overview", url: `${demoBase}/product`, sourceType: "Company website", excerpt: "Heliograph turns commercial-building energy telemetry into ranked retrofit plans and verified savings reports.", fetchedAt: analyzedAt, reliability: "high" as const, isDemo: true },
  { id: "src-pricing", title: "Plans and deployment model", url: `${demoBase}/pricing`, sourceType: "Pricing page", excerpt: "Annual contracts are priced per monitored square foot, with a paid 60-day portfolio pilot.", fetchedAt: analyzedAt, reliability: "high" as const, isDemo: true },
  { id: "src-docs", title: "Connector and verification documentation", url: `${demoBase}/docs`, sourceType: "Technical documentation", excerpt: "Read-only connectors ingest BMS, utility, weather, and occupancy data; savings baselines expose model assumptions and confidence bands.", fetchedAt: analyzedAt, reliability: "high" as const, isDemo: true },
  { id: "src-case", title: "Northline Properties pilot brief", url: `${demoBase}/case-study`, sourceType: "Company case study", excerpt: "A 14-building pilot identified $1.8M in modeled annual savings; $410K was verified after six months across completed measures.", fetchedAt: analyzedAt, reliability: "medium" as const, isDemo: true },
  { id: "src-github", title: "Public connector SDK", url: `${demoBase}/github`, sourceType: "Public repository snapshot", excerpt: "The fictional demo repository shows 22 releases over 14 months and adapters for five common building systems.", fetchedAt: analyzedAt, reliability: "medium" as const, isDemo: true },
  { id: "src-founders", title: "Team biographies", url: `${demoBase}/team`, sourceType: "Company website", excerpt: "Maya Chen previously led building optimization at GridForm; Leon Okafor built telemetry infrastructure for industrial control systems.", fetchedAt: analyzedAt, reliability: "medium" as const, isDemo: true },
  { id: "src-market", title: "Commercial retrofit market note", url: `${demoBase}/market-note`, sourceType: "Demo research note", excerpt: "Portfolio owners face energy-price pressure and disclosure mandates, while retrofit execution remains fragmented across auditors, controls vendors, and contractors.", fetchedAt: analyzedAt, reliability: "medium" as const, isDemo: true },
  { id: "src-careers", title: "Open roles", url: `${demoBase}/careers`, sourceType: "Careers page", excerpt: "Open roles include controls integration, energy modeling, enterprise implementation, and the first channel partnerships lead.", fetchedAt: analyzedAt, reliability: "high" as const, isDemo: true },
  { id: "src-competition", title: "Competitive product review", url: `${demoBase}/competition`, sourceType: "Demo analyst comparison", excerpt: "Incumbent energy-management suites emphasize monitoring; audit firms deliver bespoke projects; newer optimization tools compete on automation and speed to verified savings.", fetchedAt: analyzedAt, reliability: "medium" as const, isDemo: true },
] satisfies InvestigationRun["sources"];

const evidence = sources.map((source, index) => ({
  id: `ev-${index + 1}`,
  sourceId: source.id,
  title: source.title,
  url: source.url,
  sourceType: source.sourceType,
  excerpt: source.excerpt,
  reliability: source.reliability,
  agentIds: [
    ["discovery", "product"],
    ["product", "business"],
    ["technology", "risk"],
    ["customers", "market", "bear"],
    ["technology", "momentum"],
    ["founders"],
    ["market", "bull"],
    ["momentum", "business"],
    ["competition", "risk"],
  ][index],
  supports: [
    ["Clear workflow from telemetry to prioritized action"],
    ["Usage-linked annual contract with paid entry motion"],
    ["Integration depth and auditable verification are central to the product"],
    ["Early value signal exists, but comes from a company-authored case study"],
    ["Connector breadth and release cadence indicate active technical execution"],
    ["Founders show relevant domain and infrastructure experience"],
    ["Regulation and energy economics support category timing"],
    ["Hiring is concentrated on implementation capacity and channel distribution"],
    ["The market includes credible suites, services, and automation challengers"],
  ][index],
  discoveredAt: new Date(Date.parse(analyzedAt) + index * 11000).toISOString(),
  isDemo: true,
}));

function agent(
  id: string,
  role: string,
  stage: AgentReport["stage"],
  task: string,
  summary: string,
  finding: string,
  evidenceIds: string[],
  confidence: number,
  risks: string[] = [],
  unknowns: string[] = [],
): AgentReport {
  return {
    id, role, stage, task, summary,
    findings: [finding],
    claims: [{ id: `claim-${id}`, text: finding, type: evidenceIds.length ? "inference" : "assumption", confidence, evidenceIds, assumptions: [], agentId: id }],
    risks, unknowns, confidence,
    requestedFollowUp: unknowns.slice(0, 2),
  };
}

const agents: AgentReport[] = [
  agent("discovery", "Company Discovery", "discovery", "Mapping the company surface and canonical sources", "Heliograph is a building-energy intelligence platform for commercial portfolio owners.", "The product combines telemetry, retrofit prioritization, and post-project verification in one owner-facing workflow.", ["ev-1", "ev-2", "ev-3"], 0.91, [], ["Legal entity and incorporation date"]),
  agent("product", "Product Partner", "product", "Reviewing workflow, pricing, and adoption friction", "The value proposition is legible and tied to operating savings, but deployment crosses messy building systems.", "A paid pilot lowers procurement risk while integration effort may extend time-to-value.", ["ev-1", "ev-2", "ev-3"], 0.82, ["Integration-heavy onboarding"], ["Pilot-to-contract conversion rate"]),
  agent("founders", "Founder Partner", "founders", "Testing founder-market fit from public biographies", "The founding team has directly relevant energy-optimization and telemetry experience.", "Domain and infrastructure backgrounds fit the product, though prior company-building outcomes are not evidenced.", ["ev-6"], 0.72, ["Commercial leadership depth is unclear"], ["References", "Prior operating outcomes"]),
  agent("technology", "Technical Partner", "technology", "Examining connectors, verification, and replication risk", "Connector reliability and explainable savings baselines are more defensible than the dashboard layer.", "The integration corpus could compound, but public evidence does not establish a proprietary data advantage yet.", ["ev-3", "ev-5"], 0.76, ["Building-system fragmentation", "Incumbent bundling"], ["Model performance across building types"]),
  agent("market", "Market Partner", "market", "Sizing the wedge and testing timing", "The wedge benefits from energy economics and disclosure pressure, with a fragmented buying landscape.", "A broad retrofit market exists, but serviceable software spend and buying urgency remain assumptions.", ["ev-7"], 0.68, ["Long capital planning cycles"], ["Bottom-up serviceable market", "Budget ownership"]),
  agent("competition", "Competition Partner", "competition", "Mapping suites, services, and internal substitutes", "Heliograph competes with incumbent suites, consultants, controls vendors, and spreadsheets.", "Workflow integration is differentiated, but distribution and installed-base leverage favor incumbents.", ["ev-9"], 0.71, ["Bundled incumbent pricing", "Internal energy teams"], ["Win-loss data"]),
  agent("customers", "Customer Signal", "customers", "Separating customer outcomes from company claims", "One quantified pilot suggests potential economic value, but independent customer evidence is thin.", "Verified savings are promising and directionally relevant; the source remains company-authored and should be reference-checked.", ["ev-4"], 0.61, ["Reference concentration"], ["Retention", "Expansion", "Independent references"]),
  agent("business", "Business Model", "business", "Evaluating ACV logic, margins, and sales motion", "Per-square-foot annual pricing aligns with portfolio expansion, while implementation work may pressure margins.", "The paid-pilot motion can qualify value before an enterprise rollout, but economics are unknown.", ["ev-2", "ev-8"], 0.7, ["Services drag", "Enterprise sales cycles"], ["Gross margin", "ACV", "Net retention"]),
  agent("momentum", "Momentum Analyst", "momentum", "Reading hiring and release cadence as weak signals", "Hiring and release patterns suggest active execution rather than proven commercial acceleration.", "Integration and implementation roles fit current bottlenecks; a channel hire signals a distribution experiment.", ["ev-5", "ev-8"], 0.66, ["Hiring ahead of repeatability"], ["Headcount trend", "Revenue growth"]),
  agent("risk", "Risk Partner", "risks", "Constructing failure modes and evidence gaps", "The central risks are deployment complexity, weak independent traction evidence, and incumbent bundling.", "A technically credible product can still stall if implementation remains bespoke or savings fail to convert into budget urgency.", ["ev-3", "ev-4", "ev-9"], 0.84, ["Integration burden", "Procurement friction", "Platform response"], ["Cohort economics", "Security reviews"]),
  agent("bull", "Bull Analyst", "bull", "Building the strongest evidence-backed upside case", "Heliograph could become the decision layer for a large, mandatory retrofit cycle.", "If verified savings generalize and the connector corpus lowers deployment cost, data and workflow advantages can compound across portfolios.", ["ev-3", "ev-4", "ev-7"], 0.69, ["Thesis depends on generalizing one case"], ["Cross-portfolio benchmarks"]),
  agent("bear", "Bear Analyst", "bear", "Building the strongest failure case", "Heliograph may be a services-heavy feature that incumbents bundle into existing building suites.", "Long sales cycles and heterogeneous systems could prevent software margins before better-distributed incumbents close the gap.", ["ev-2", "ev-3", "ev-9"], 0.78, ["Margin compression", "Feature commoditization"], ["Implementation hours per building"]),
  agent("committee", "Managing Partner", "committee", "Reconciling evidence, dissent, and investability", "The committee sees a credible Watch with a clear path to Invest if commercial evidence improves.", "Product and founder fit are encouraging; current coverage cannot establish repeatability or durable economics.", evidence.map((item) => item.id), 0.8, ["Evidence is company-heavy"], ["Three independent customer references", "Cohort retention and margin data"]),
];

const heliographWithScenarios: InvestigationRun = InvestigationRunSchema.parse({
  id: "demo-heliograph-2026-07",
  mode: "demo",
  status: "complete",
  profile: {
    name: "Heliograph",
    domain: "heliograph.energy",
    url: `${demoBase}/home`,
    description: "Decision intelligence for commercial building retrofits and verified energy savings.",
    category: "Climate intelligence / property operations",
    stage: "Seed to Series A",
    stageInferred: true,
    location: "Chicago, IL",
    founders: ["Maya Chen", "Leon Okafor"],
    analyzedAt,
    faviconUrl: null,
  },
  sources,
  evidence,
  agents,
  committee: [
    { id: "cm-1", role: "Technical Partner", stance: "positive", statement: "The verification layer is the most interesting asset. Connector count alone is not a moat; normalized deployment learnings might become one.", evidenceIds: ["ev-3", "ev-5"], isDissent: false },
    { id: "cm-2", role: "Market Partner", stance: "positive", statement: "Energy pressure and disclosure rules create timing, but we still need a bottom-up view of budgets owners can approve this year.", evidenceIds: ["ev-7"], isDissent: false },
    { id: "cm-3", role: "Founder Partner", stance: "positive", statement: "The team has unusually direct problem context. We have evidence of fit, not yet evidence of venture-scale commercial execution.", evidenceIds: ["ev-6"], isDissent: false },
    { id: "cm-4", role: "Growth Partner", stance: "neutral", statement: "Paid pilots are sensible. The decision turns on conversion speed, expansion by square footage, and whether implementation effort falls each cohort.", evidenceIds: ["ev-2", "ev-8"], isDissent: false },
    { id: "cm-5", role: "Bull Analyst", stance: "positive", statement: "A trusted system of record for retrofit ROI can own the capital-allocation workflow, not just energy monitoring.", evidenceIds: ["ev-1", "ev-4", "ev-7"], isDissent: false },
    { id: "cm-6", role: "Bear Analyst", stance: "negative", statement: "The case study may mask bespoke labor. A major controls vendor can bundle a credible version and win through installed distribution.", evidenceIds: ["ev-4", "ev-9"], isDissent: true },
    { id: "cm-7", role: "Risk Partner", stance: "negative", statement: "No recommendation should outrun the missing cohort economics, security-review duration, and independent reference data.", evidenceIds: ["ev-2", "ev-3", "ev-4"], isDissent: false },
    { id: "cm-8", role: "Managing Partner", stance: "neutral", statement: "Watch. Advance when three references confirm repeatable savings and the company proves deployment effort declines with each portfolio.", evidenceIds: ["ev-3", "ev-4", "ev-6"], isDissent: false },
  ],
  verdict: {
    recommendation: "Watch",
    conviction: 67,
    confidence: 72,
    evidenceCoverage: 64,
    summary: "A credible, well-timed product with strong founder-market fit, held below Invest by thin independent traction evidence and uncertain deployment economics.",
    keyReasons: ["Clear economic buyer and measurable outcome", "Relevant technical and domain experience", "Potentially compounding integration workflow"],
    dissent: "The bear view expects incumbents to bundle equivalent analytics before Heliograph reaches software-like margins.",
    conditions: ["Three independent customer references", "Evidence of falling deployment hours per building", "Pilot conversion and expansion cohort data"],
    unansweredQuestions: ["What is gross margin after implementation labor?", "How often do recommended projects reach verified savings?", "Who owns budget and how long does security review take?"],
  },
  scores: [
    { id: "market", label: "Market attractiveness", score: 74, confidence: 0.68, evidenceCoverage: 0.58, supportingFactors: ["Energy and regulatory tailwinds"], opposingFactors: ["Slow capital cycles"], assumptions: ["Owners allocate new software budget"] },
    { id: "founder", label: "Founder strength", score: 81, confidence: 0.72, evidenceCoverage: 0.62, supportingFactors: ["Direct domain and infrastructure fit"], opposingFactors: ["Commercial scaling unproven"], assumptions: [] },
    { id: "product", label: "Product strength", score: 79, confidence: 0.82, evidenceCoverage: 0.78, supportingFactors: ["Clear, measurable workflow"], opposingFactors: ["Integration friction"], assumptions: [] },
    { id: "technology", label: "Technical defensibility", score: 68, confidence: 0.76, evidenceCoverage: 0.66, supportingFactors: ["Connector and verification depth"], opposingFactors: ["Dashboard layer is replicable"], assumptions: ["Deployment corpus compounds"] },
    { id: "competition", label: "Competitive position", score: 61, confidence: 0.71, evidenceCoverage: 0.55, supportingFactors: ["Owner-centric capital workflow"], opposingFactors: ["Incumbent distribution"], assumptions: [] },
    { id: "business", label: "Business model quality", score: 63, confidence: 0.7, evidenceCoverage: 0.48, supportingFactors: ["Expansion-linked pricing"], opposingFactors: ["Unknown services burden"], assumptions: ["Paid pilots convert"] },
    { id: "momentum", label: "Execution momentum", score: 69, confidence: 0.66, evidenceCoverage: 0.51, supportingFactors: ["Relevant hiring and release cadence"], opposingFactors: ["No revenue trend evidence"], assumptions: [] },
    { id: "risk", label: "Overall risk", score: 58, confidence: 0.84, evidenceCoverage: 0.69, supportingFactors: ["Enterprise and implementation risk"], opposingFactors: ["Measurable customer ROI"], assumptions: [] },
  ],
  probabilities: [
    { id: "next-round", label: "Raise next institutional round", range: "55-70%", horizon: "18 months", confidence: "medium", basis: "Founder fit, category timing, and product clarity; financing and traction are not evidenced.", assumptions: ["At least five repeatable deployments"], movers: ["Pilot conversion", "Independent references", "Gross margin"] },
    { id: "durable-pmf", label: "Reach durable product-market fit", range: "40-55%", horizon: "36 months", confidence: "low", basis: "Strong pain and measurable value offset by integration and buying-cycle risk.", assumptions: ["Deployment effort declines materially"], movers: ["Net retention", "Time to first verified savings"] },
    { id: "category-leader", label: "Become a category leader", range: "15-25%", horizon: "7 years", confidence: "low", basis: "Requires controlling the capital-allocation workflow before suites bundle the category.", assumptions: ["Data advantage compounds across portfolios"], movers: ["Channel distribution", "Portfolio benchmark quality"] },
    { id: "acquisition", label: "Meaningful acquisition", range: "25-40%", horizon: "5 years", confidence: "low", basis: "Controls, property software, and energy-service incumbents have strategic reasons to acquire the workflow.", assumptions: ["Product gains multi-portfolio adoption"], movers: ["Strategic partnerships", "Integration footprint"] },
    { id: "stagnation", label: "Shutdown or stagnation", range: "25-35%", horizon: "5 years", confidence: "medium", basis: "Implementation burden and incumbent bundling are credible failure paths.", assumptions: ["Capital remains constrained"], movers: ["Services mix", "Sales-cycle duration"] },
  ],
  memo: {
    title: "Heliograph Investment Memorandum",
    executiveSummary: "Heliograph is a fictional climate-software company that helps commercial property owners prioritize retrofits and verify energy savings. The investment case rests on an unusually clear ROI loop and relevant founder experience. The diligence case remains incomplete because independent customer evidence, cohort economics, and deployment repeatability are unknown.",
    thesis: "Heliograph can become the decision layer for commercial retrofit capital if its connector corpus reduces deployment cost and its verification system becomes trusted by portfolio owners, lenders, and service partners.",
    sections: [
      { id: "why-now", title: "Why now", body: "Energy volatility, disclosure requirements, and aging controls infrastructure increase the cost of delaying retrofit decisions. This is a source-backed category timing signal, not proof of software demand.", evidenceIds: ["ev-7"] },
      { id: "product", title: "Product", body: "The workflow moves from read-only telemetry ingestion to ranked retrofit plans and verified savings. The paid pilot is aligned with the buyer's need to prove value before a portfolio rollout.", evidenceIds: ["ev-1", "ev-2", "ev-3"] },
      { id: "founders", title: "Founder-market fit", body: "Maya Chen and Leon Okafor bring relevant building optimization and telemetry experience. Prior venture outcomes and commercial leadership remain unknown.", evidenceIds: ["ev-6"] },
      { id: "technology", title: "Technology and moat", body: "The credible technical wedge is not generic analytics; it is reliable integration plus auditable verification across heterogeneous systems. Defensibility depends on deployment learning compounding faster than incumbent response.", evidenceIds: ["ev-3", "ev-5"] },
      { id: "market", title: "Market and competition", body: "The opportunity is large in physical scope but software budget availability is not established. Incumbent suites, consultants, controls firms, and internal teams all compete for the job.", evidenceIds: ["ev-7", "ev-9"] },
      { id: "business", title: "Business model", body: "Annual per-square-foot pricing supports portfolio expansion. Implementation labor, gross margin, sales-cycle duration, and retention are unknown and must be treated as gating diligence.", evidenceIds: ["ev-2", "ev-8"] },
      { id: "bull", title: "Bull case", body: "Verified savings generalize, deployment time falls, and Heliograph owns the capital-allocation system of record across commercial portfolios.", evidenceIds: ["ev-3", "ev-4", "ev-7"] },
      { id: "bear", title: "Bear case", body: "Each building remains a custom integration, margins stay services-like, and an incumbent bundles adequate analytics into an installed platform.", evidenceIds: ["ev-3", "ev-4", "ev-9"] },
      { id: "decision", title: "Conditions for investment", body: "Advance from Watch only after independent references validate savings, cohort data shows pilot expansion, and deployment hours decline across comparable buildings.", evidenceIds: ["ev-2", "ev-4"] },
    ],
    generatedAt: analyzedAt,
    model: "StartupSignal deterministic demo dataset v1",
    methodology: "Evidence-first structured judgment. Demo evidence is fictional and exists only to exercise the product; it is not market research or investment advice.",
    changeLog: ["Initial committee memorandum generated from the fictional Heliograph demo corpus."],
  },
  scenarios: [
    { id: "platform", title: "Major platform launches a competing product", thesisDelta: "The thesis narrows from broad workflow ownership to best-in-class cross-platform verification. Distribution risk becomes the dominant factor.", recommendation: "Watch", convictionDelta: -12, confidenceDelta: 4, riskUpdates: ["Bundling pressure increases", "Channel neutrality becomes essential"], probabilityUpdates: [{ scenarioId: "category-leader", range: "8-15%", rationale: "Installed distribution compresses the available wedge." }, { scenarioId: "stagnation", range: "35-45%", rationale: "Pricing and sales pressure increase." }], memoEntry: "Stress test: incumbent platform entry reduced upside and elevated distribution risk." },
    { id: "raise", title: "Company raises $20M", thesisDelta: "Capital extends the integration runway but only improves the thesis if it funds repeatable connectors and channel distribution rather than bespoke implementation.", recommendation: "Watch", convictionDelta: 4, confidenceDelta: 0, riskUpdates: ["Execution scope expands", "Capital efficiency becomes a new diligence focus"], probabilityUpdates: [{ scenarioId: "durable-pmf", range: "45-60%", rationale: "More runway supports productization, with execution still unproven." }], memoEntry: "Stress test: a $20M raise improved runway but did not resolve repeatability." },
    { id: "sales-leader", title: "Exceptional enterprise sales leader joins", thesisDelta: "A proven sales leader may improve pipeline discipline and partner distribution, but cannot fix weak deployment economics.", recommendation: "Watch", convictionDelta: 6, confidenceDelta: 1, riskUpdates: ["Leadership concentration falls", "Go-to-market burn may rise"], probabilityUpdates: [{ scenarioId: "next-round", range: "62-75%", rationale: "Commercial execution credibility improves." }], memoEntry: "Stress test: enterprise sales leadership improved financing and distribution outlook." },
  ],
  warnings: ["DEMO DATA: Heliograph, its people, sources, metrics, and conclusions are fictional.", "This analysis is structured model judgment, not investment advice or fiduciary guidance."],
});

export const demoScenarioPrompts = [
  "Assume a major platform launches a competing product",
  "Assume the company raises $20M",
  "Assume the startup hires an exceptional enterprise sales leader",
];

export const demoScenarioUpdates = heliographWithScenarios.scenarios;
export const heliographDemo = InvestigationRunSchema.parse({ ...heliographWithScenarios, scenarios: [] });
