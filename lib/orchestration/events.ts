import { z } from "zod";
import { AgentReportSchema, CommitteeStatementSchema, EvidenceItemSchema } from "@/lib/schemas/investigation";

export const InvestigationEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("run_started"), runId: z.string(), mode: z.enum(["demo", "live"]), url: z.string() }),
  z.object({ type: z.literal("stage"), stageId: z.string(), status: z.enum(["queued", "running", "complete", "low_evidence", "failed"]), message: z.string() }),
  z.object({ type: z.literal("evidence"), evidenceId: z.string(), evidence: EvidenceItemSchema }),
  z.object({ type: z.literal("agent"), agentId: z.string(), agent: AgentReportSchema }),
  z.object({ type: z.literal("committee"), statementId: z.string(), statement: CommitteeStatementSchema }),
  z.object({ type: z.literal("complete"), run: z.unknown() }),
  z.object({ type: z.literal("error"), message: z.string(), recoverable: z.boolean() }),
]);

export type InvestigationEvent = z.infer<typeof InvestigationEventSchema>;

export const pipelineStages = [
  { id: "discovery", label: "Company discovery" },
  { id: "website", label: "Website analysis" },
  { id: "product", label: "Product" },
  { id: "founders", label: "Founders" },
  { id: "technology", label: "Technology" },
  { id: "market", label: "Market" },
  { id: "competition", label: "Competition" },
  { id: "customers", label: "Customers" },
  { id: "business", label: "Business model" },
  { id: "momentum", label: "Hiring & momentum" },
  { id: "risks", label: "Risks" },
  { id: "bull", label: "Bull case" },
  { id: "bear", label: "Bear case" },
  { id: "committee", label: "Investment committee" },
  { id: "memo", label: "Final memo" },
] as const;

export type PipelineStageId = (typeof pipelineStages)[number]["id"];
