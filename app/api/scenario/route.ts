import { analyzeScenario } from "@/lib/ai/live-analysis";
import { demoScenarioUpdates } from "@/lib/demo/heliograph";
import { ScenarioRequestSchema } from "@/lib/schemas/investigation";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!checkRateLimit(`scenario:${ip}`, 10).allowed) return Response.json({ error: "Scenario limit reached. Try again shortly." }, { status: 429 });
  const body = ScenarioRequestSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: "A valid investigation and scenario are required." }, { status: 400 });
  try {
    if (body.data.run.mode === "demo") {
      const normalized = body.data.scenario.toLowerCase();
      const match = demoScenarioUpdates.find((item) => normalized.includes(item.title.toLowerCase().replace("company ", ""))) ||
        (normalized.includes("platform") ? demoScenarioUpdates[0] : normalized.includes("20m") ? demoScenarioUpdates[1] : demoScenarioUpdates[2]);
      return Response.json({ update: match });
    }
    if (!process.env.OPENAI_API_KEY) return Response.json({ error: "Live scenarios require OPENAI_API_KEY." }, { status: 503 });
    return Response.json({ update: await analyzeScenario(body.data.run, body.data.scenario) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Scenario analysis failed." }, { status: 500 });
  }
}
