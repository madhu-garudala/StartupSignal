import { z } from "zod";

export const ClaimTypeSchema = z.enum([
  "observed_fact",
  "source_claim",
  "inference",
  "estimate",
  "assumption",
]);

export const ReliabilitySchema = z.enum(["high", "medium", "low"]);

export const CompanyProfileSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  url: z.url(),
  description: z.string().min(1),
  category: z.string().min(1),
  stage: z.string().min(1),
  stageInferred: z.boolean(),
  location: z.string().min(1),
  founders: z.array(z.string()),
  analyzedAt: z.string(),
  faviconUrl: z.url().nullable(),
});

export const SourceDocumentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
  sourceType: z.string().min(1),
  excerpt: z.string().min(1),
  fetchedAt: z.string(),
  reliability: ReliabilitySchema,
  isDemo: z.boolean().default(false),
});

export const EvidenceItemSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
  sourceType: z.string().min(1),
  excerpt: z.string().min(1),
  reliability: ReliabilitySchema,
  agentIds: z.array(z.string()).min(1),
  supports: z.array(z.string()).min(1),
  discoveredAt: z.string(),
  isDemo: z.boolean().default(false),
});

export const ClaimSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  type: ClaimTypeSchema,
  confidence: z.number().min(0).max(1),
  evidenceIds: z.array(z.string()),
  assumptions: z.array(z.string()),
  agentId: z.string().min(1),
});

export const AgentReportSchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1),
  stage: z.enum(["discovery", "website", "product", "founders", "technology", "market", "competition", "customers", "business", "momentum", "risks", "bull", "bear", "committee", "memo"]),
  task: z.string().min(1),
  summary: z.string().min(1),
  findings: z.array(z.string()).min(1),
  claims: z.array(ClaimSchema),
  risks: z.array(z.string()),
  unknowns: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  requestedFollowUp: z.array(z.string()),
});

export const CommitteeStatementSchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1),
  stance: z.enum(["positive", "neutral", "negative"]),
  statement: z.string().min(1),
  evidenceIds: z.array(z.string()),
  isDissent: z.boolean(),
});

export const ScoreDimensionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  score: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  evidenceCoverage: z.number().min(0).max(1),
  supportingFactors: z.array(z.string()),
  opposingFactors: z.array(z.string()),
  assumptions: z.array(z.string()),
});

export const ProbabilityScenarioSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  range: z.string().min(1),
  horizon: z.string().min(1),
  confidence: ReliabilitySchema,
  basis: z.string().min(1),
  assumptions: z.array(z.string()),
  movers: z.array(z.string()).min(1),
});

export const CommitteeVerdictSchema = z.object({
  recommendation: z.enum([
    "Strong Invest",
    "Invest",
    "Watch",
    "Pass",
    "Strong Pass",
    "Insufficient Evidence",
  ]),
  conviction: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  evidenceCoverage: z.number().min(0).max(100),
  summary: z.string().min(1),
  keyReasons: z.array(z.string()).min(1),
  dissent: z.string().min(1),
  conditions: z.array(z.string()).min(1),
  unansweredQuestions: z.array(z.string()).min(1),
});

export const MemoSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  evidenceIds: z.array(z.string()),
});

export const InvestmentMemoSchema = z.object({
  title: z.string().min(1),
  executiveSummary: z.string().min(1),
  thesis: z.string().min(1),
  sections: z.array(MemoSectionSchema).min(1),
  generatedAt: z.string(),
  model: z.string().min(1),
  methodology: z.string().min(1),
  changeLog: z.array(z.string()),
});

export const ScenarioUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  thesisDelta: z.string().min(1),
  recommendation: CommitteeVerdictSchema.shape.recommendation,
  convictionDelta: z.number().min(-100).max(100),
  confidenceDelta: z.number().min(-100).max(100),
  riskUpdates: z.array(z.string()).min(1),
  probabilityUpdates: z.array(
    z.object({ scenarioId: z.string(), range: z.string(), rationale: z.string() }),
  ),
  memoEntry: z.string().min(1),
});

export const InvestigationRunSchema = z.object({
  id: z.string().min(1),
  mode: z.enum(["demo", "live"]),
  status: z.enum(["queued", "running", "complete", "partial", "failed"]),
  profile: CompanyProfileSchema,
  sources: z.array(SourceDocumentSchema),
  evidence: z.array(EvidenceItemSchema),
  agents: z.array(AgentReportSchema).min(1),
  committee: z.array(CommitteeStatementSchema).min(1),
  verdict: CommitteeVerdictSchema,
  scores: z.array(ScoreDimensionSchema).min(1),
  probabilities: z.array(ProbabilityScenarioSchema).min(1),
  memo: InvestmentMemoSchema,
  scenarios: z.array(ScenarioUpdateSchema),
  warnings: z.array(z.string()),
});

export const AnalysisRequestSchema = z.object({
  url: z.string().trim().min(1).max(2048),
  mode: z.enum(["demo", "live"]),
});

export const ScenarioRequestSchema = z.object({
  run: InvestigationRunSchema,
  scenario: z.string().trim().min(3).max(500),
});

export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;
export type SourceDocument = z.infer<typeof SourceDocumentSchema>;
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;
export type Claim = z.infer<typeof ClaimSchema>;
export type AgentReport = z.infer<typeof AgentReportSchema>;
export type CommitteeStatement = z.infer<typeof CommitteeStatementSchema>;
export type ScoreDimension = z.infer<typeof ScoreDimensionSchema>;
export type ProbabilityScenario = z.infer<typeof ProbabilityScenarioSchema>;
export type CommitteeVerdict = z.infer<typeof CommitteeVerdictSchema>;
export type InvestmentMemo = z.infer<typeof InvestmentMemoSchema>;
export type ScenarioUpdate = z.infer<typeof ScenarioUpdateSchema>;
export type InvestigationRun = z.infer<typeof InvestigationRunSchema>;
