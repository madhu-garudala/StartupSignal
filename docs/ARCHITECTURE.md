# StartupSignal Architecture

StartupSignal is a Next.js App Router application that turns a company URL into a typed investment investigation. The browser renders a progressive command-center workspace, while all crawling, model access, URL security checks, and API keys remain inside Node.js serverless routes. Demo and live investigations converge on the same `InvestigationRun` contract.

## System context and request flow

```mermaid
flowchart LR
  user[Investor]

  subgraph browser[Browser - untrusted client]
    landing[Landing and URL input]
    client[StartupSignal client state]
    workspace[Investigation workspace]
    parser[NDJSON event parser and Zod validation]
  end

  subgraph vercel[Vercel - Next.js Node.js serverless]
    analyze[POST /api/analyze - max 60s]
    scenario[POST /api/scenario - max 30s]
    limiter[Best-effort in-memory rate limiter]
    demo[Deterministic Heliograph demo packet]
    crawler[Secure bounded crawler]
    synthesis[Responses API structured synthesis]
    indexed[Responses API indexed-source fallback]
    scenarioAI[Responses API scenario synthesis]
    schemas[Zod schemas and finalization]
  end

  sites[Submitted public website]
  openai[OpenAI Responses API and web search]

  user --> landing
  landing -->|URL plus live mode, or demo mode| client
  client -->|POST JSON| analyze
  analyze --> limiter
  limiter -->|demo| demo
  limiter -->|live| crawler
  crawler -->|HTTP requests| sites
  crawler -->|normalized first-party corpus| synthesis
  synthesis -->|responses.parse, store false| openai
  crawler -.->|only HTTP 403 or 429| indexed
  indexed -->|domain-filtered web search| openai
  demo --> schemas
  synthesis --> schemas
  indexed --> schemas
  schemas -->|run_started, stage, evidence, agent, committee, complete or error| analyze
  analyze -->|application/x-ndjson stream| parser
  parser --> workspace
  workspace -->|validated run plus counterfactual| scenario
  scenario --> limiter
  scenario -->|demo| demo
  scenario -->|live| scenarioAI
  scenarioAI -->|responses.parse, store false| openai
  scenarioAI --> schemas
  schemas -->|JSON ScenarioUpdate| workspace
```

The analysis route starts an NDJSON stream immediately. Demo mode emits deterministic staged events with short presentation delays. In live mode, discovery progress is emitted before a single structured Responses API synthesis; evidence, specialist, committee, and completion events are emitted after the returned packet passes validation. The OpenAI call itself is not token-streamed to the browser.

## Live investigation pipeline

```mermaid
flowchart TD
  request[Validated live analysis request]
  normalize[Normalize URL: HTTP or HTTPS only, no credentials, standard ports]
  robots[Fetch and apply robots.txt policy]
  fetch[Fetch homepage and selected same-origin pages]
  status{Fetch outcome}
  blocked{HTTP 403 or 429?}
  fallback[Indexed-source fallback]
  fail[Recoverable NDJSON error]
  bound[Read at most 500,000 bytes per page]
  oversized{Body exceeds limit?}
  truncate[Keep bounded prefix, cancel remainder, add coverage warning]
  extract[Cheerio extraction: remove active and non-content elements]
  corpus[Up to 4 source documents; excerpts bounded to 4,000 chars]
  direct[Direct Responses API structured synthesis]
  verify[Verify every indexed URL against actual tool sources and submitted domain]
  sufficient{At least 2 verified first-party sources?}
  medium[Create medium-reliability indexed evidence]
  validate[Zod parse model packet]
  refs[Filter claim and committee evidence IDs to known sources]
  run[Validate complete InvestigationRun]
  emit[Emit typed evidence, agents, debate, verdict, scenarios and memo]

  request --> normalize --> robots --> fetch --> status
  status -->|success| bound --> oversized
  oversized -->|yes| truncate --> extract
  oversized -->|no| extract
  extract --> corpus --> direct --> validate
  status -->|failure| blocked
  blocked -->|no| fail
  blocked -->|yes and API key present| fallback --> verify --> sufficient
  blocked -->|yes and no API key| fail
  sufficient -->|no| fail
  sufficient -->|yes| medium --> validate
  validate --> refs --> run --> emit
  validate -.->|missing or invalid structured output| fail
```

Direct crawling never fails solely because a page is larger than 500 KB. It retains the first 500,000 bytes, cancels the response stream, and carries a `SOURCE TRUNCATED` warning into the validated result. Only the homepage is mandatory; inaccessible secondary pages are skipped. Crawling is limited to the submitted origin, four pages, three redirects, eight seconds per fetch, supported text content types, and useful product/company paths.

The direct path sends only the bounded, normalized website corpus to `responses.parse`. If the homepage responds with HTTP 403 or 429, the indexed path instead requires web search, restricts it to the submitted hostname, cross-checks model-declared sources against returned tool sources and URL citations, rejects off-domain URLs, and requires at least two verified first-party sources. Indexed evidence is labeled medium reliability and its limitation is preserved in warnings.

## Trust and deployment boundaries

```mermaid
flowchart TB
  subgraph public[Public and untrusted zone]
    browser[Browser input and client state]
    dns[Public DNS]
    web[Remote website content and redirects]
    search[Web search results and opened pages]
  end

  subgraph edge[Vercel project boundary]
    subgraph functions[Ephemeral Node.js function instance]
      requests[Zod request validation]
      urlguard[URL and SSRF guard]
      dnscheck[IPv4 and IPv6 resolution checks]
      crawlguard[Redirect, timeout, page and byte bounds]
      sanitize[Inert extraction and untrusted-data envelope]
      orchestration[Deterministic orchestration]
      outputguard[Structured-output Zod validation and evidence-ID filtering]
      memory[Per-instance in-memory rate state]
    end
    env[Server-side environment: OPENAI_API_KEY and model names]
  end

  subgraph provider[OpenAI service boundary]
    responses[Responses API]
    webtool[Domain-filtered web search tool]
  end

  browser --> requests --> urlguard
  urlguard --> dnscheck --> dns
  dnscheck --> crawlguard --> web
  web --> sanitize --> orchestration
  search --> outputguard
  orchestration --> responses
  env --> responses
  responses --> outputguard --> browser
  responses --> webtool --> search
  requests --> memory
```

The SSRF guard blocks local/internal hostnames, credentials, non-standard ports, and private, reserved, link-local, multicast, documentation, and metadata IP ranges. DNS A and AAAA answers are checked before every fetch, including redirects; redirect targets are normalized and revalidated. This application-level check reduces risk but cannot replace network egress controls for high-assurance DNS-rebinding protection.

Remote HTML and search material are always data, never instructions. Active elements are removed, excerpts are bounded, source text is placed inside an explicit untrusted-data envelope, and system instructions prohibit following embedded commands or inventing unsupported facts. Model output must satisfy narrow Zod schemas; unknown evidence references are removed before the final run is parsed again.

## Runtime characteristics

| Area | Current behavior | Production implication |
| --- | --- | --- |
| Execution | One `POST /api/analyze` invocation, capped at 60 seconds | Broader research needs a durable queue and persisted run state |
| Streaming | Server-generated NDJSON events; `no-store` and `no-transform` | Keeps the workspace responsive without a separate realtime service |
| Demo | Keyless, deterministic fictional dataset | Reliable fallback independent of external sites and model availability |
| Persistence | Browser memory only | Refreshes and cross-device access do not preserve investigations |
| Rate limiting | Per-IP map in a warm function instance | Use a distributed store before broad public exposure |
| Evidence scope | Up to four first-party pages, or verified first-party indexed sources after 403/429 | Independent press, repositories, social sources, and broad diligence are not included |
| Secrets | `OPENAI_API_KEY` read only by server route code | Never prefix the API key with `NEXT_PUBLIC_` |
| Model state | Responses requests use `store: false` | The app owns no durable provider-side conversation or agent loop |

The scenario endpoint accepts a validated completed run and a bounded counterfactual. Demo scenarios are deterministic. Live scenarios call the Responses API without gathering new evidence, validate a `ScenarioUpdate`, and append the result to client state and the memo change log.
