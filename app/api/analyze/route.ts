import { analyzeIndexedSite, analyzeSources } from "@/lib/ai/live-analysis";
import { CrawlHttpError, crawlCompany } from "@/lib/crawling/crawler";
import { heliographDemo } from "@/lib/demo/heliograph";
import { pipelineStages, type InvestigationEvent } from "@/lib/orchestration/events";
import { AnalysisRequestSchema, InvestigationRunSchema, type InvestigationRun } from "@/lib/schemas/investigation";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { UrlSecurityError } from "@/lib/security/url";
import { normalizePublicUrl } from "@/lib/security/url";

export const runtime = "nodejs";
export const maxDuration = 60;

const encoder = new TextEncoder();
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function line(event: InvestigationEvent) {
  return encoder.encode(`${JSON.stringify(event)}\n`);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!checkRateLimit(ip).allowed) return Response.json({ error: "Too many investigations. Try again in a minute." }, { status: 429 });
  const body = AnalysisRequestSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: "A valid URL and analysis mode are required." }, { status: 400 });

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: InvestigationEvent) => controller.enqueue(line(event));
      const runId = body.data.mode === "demo" ? heliographDemo.id : `live-${crypto.randomUUID()}`;
      send({ type: "run_started", runId, mode: body.data.mode, url: body.data.url });
      try {
        if (body.data.mode === "demo") {
          for (let index = 0; index < pipelineStages.length; index += 1) {
            const stage = pipelineStages[index];
            send({ type: "stage", stageId: stage.id, status: "running", message: `Investigating ${stage.label.toLowerCase()}` });
            const agent = heliographDemo.agents.find((item) => item.stage === stage.id);
            if (agent) send({ type: "agent", agentId: agent.id, agent });
            const item = heliographDemo.evidence[index % heliographDemo.evidence.length];
            if (index < heliographDemo.evidence.length) send({ type: "evidence", evidenceId: item.id, evidence: item });
            if (stage.id === "committee") for (const statement of heliographDemo.committee.slice(0, 4)) send({ type: "committee", statementId: statement.id, statement });
            await sleep(index < 3 ? 260 : 150);
            send({ type: "stage", stageId: stage.id, status: stage.id === "customers" ? "low_evidence" : "complete", message: stage.id === "customers" ? "Limited independent evidence" : `${stage.label} complete` });
          }
          for (const statement of heliographDemo.committee.slice(4)) send({ type: "committee", statementId: statement.id, statement });
          send({ type: "complete", run: heliographDemo });
        } else {
          send({ type: "stage", stageId: "discovery", status: "running", message: "Validating destination and robots policy" });
          let run: InvestigationRun;
          try {
            const crawled = await crawlCompany(body.data.url);
            send({ type: "stage", stageId: "discovery", status: "complete", message: `${crawled.sources.length} bounded sources collected` });
            send({ type: "stage", stageId: "website", status: "complete", message: "Untrusted page copy normalized" });
            send({ type: "stage", stageId: "product", status: "running", message: "Responses API committee is analyzing the corpus" });
            run = InvestigationRunSchema.parse(await analyzeSources(crawled.canonicalUrl, crawled.sources));
          } catch (error) {
            if (!(error instanceof CrawlHttpError) || ![403, 429].includes(error.status)) throw error;
            if (!process.env.OPENAI_API_KEY) throw new Error(`Direct crawling was blocked (HTTP ${error.status}), and indexed-source fallback requires OPENAI_API_KEY.`);
            const canonicalUrl = normalizePublicUrl(body.data.url).toString();
            send({ type: "stage", stageId: "discovery", status: "low_evidence", message: `Direct crawl returned HTTP ${error.status}; switching to verified first-party index` });
            send({ type: "stage", stageId: "website", status: "running", message: `Searching indexed pages only on ${new URL(canonicalUrl).hostname}` });
            run = InvestigationRunSchema.parse(await analyzeIndexedSite(canonicalUrl, error.status));
            send({ type: "stage", stageId: "website", status: "low_evidence", message: `${run.sources.length} indexed first-party sources verified` });
          }
          for (const item of run.evidence) send({ type: "evidence", evidenceId: item.id, evidence: item });
          for (const agent of run.agents) {
            send({ type: "agent", agentId: agent.id, agent });
            send({ type: "stage", stageId: agent.stage, status: "complete", message: agent.summary });
          }
          for (const statement of run.committee) send({ type: "committee", statementId: statement.id, statement });
          send({ type: "stage", stageId: "memo", status: "complete", message: "Validated investment memo assembled" });
          send({ type: "complete", run });
        }
      } catch (error) {
        const message = error instanceof UrlSecurityError || error instanceof Error ? error.message : "Investigation failed safely.";
        send({ type: "error", message, recoverable: true });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
