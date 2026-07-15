# StartupSignal Implementation Plan

1. **Foundation** - Initialize a strict Next.js App Router project, design tokens, domain schemas, test tooling, and Vercel-safe configuration.
2. **Reliable demo** - Build a fictional, explicitly labeled investigation with a staged event stream covering agents, evidence, committee debate, verdict, scenarios, and memo.
3. **Command center** - Implement the responsive landing-to-workspace transition, investigation pipeline, active analysis surface, evidence rail, verdict dashboard, and print-ready memo.
4. **Live engine** - Add URL normalization, DNS/IP SSRF defenses, robots-aware bounded crawling, safe text extraction, basic rate limits, and Responses API structured output validated with Zod.
5. **Stress tests** - Add deterministic demo scenarios and a validated live scenario endpoint that updates the thesis, risks, probabilities, recommendation, and memo change log.
6. **Hardening and delivery** - Cover security utilities and schemas with tests, add accessibility and reduced-motion behavior, document environment/deployment constraints, and pass lint, type-check, tests, and production build.

## Vercel Constraints

- Serverless requests cannot provide durable background jobs or reliable in-memory run persistence. This release streams within a bounded request; production-scale investigations should move run state and long work to durable storage and a queue.
- Public sites can be slow, block automated requests, or prohibit crawling. The live crawler uses strict limits and degrades honestly; the demo path remains fully deterministic.
- In-memory rate limiting is best-effort per warm instance. Public deployment should add a distributed limiter before broad exposure.
- DNS can change between validation and connection. The fetcher revalidates every redirect and resolves all advertised addresses, but high-assurance egress control ultimately belongs at the network layer.
- Vercel function duration varies by plan. Live analysis is capped and configured for a 60-second function budget; the keyless demo has no external dependency.
