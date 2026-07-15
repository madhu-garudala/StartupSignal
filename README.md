# StartupSignal

StartupSignal turns a startup URL into an evidence-backed venture investigation, a structured AI investment committee verdict, scenario stress tests, and a living investment memo.

The application includes two paths:

- **Demo:** a deterministic, explicitly fictional Heliograph investigation that works without API keys or network access.
- **Live:** a bounded crawl of the submitted company website followed by a Zod-validated synthesis through the OpenAI Responses API.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the system, investigation pipeline, and trust-boundary diagrams.

## Stack

- Next.js 16 App Router, React 19, strict TypeScript
- Tailwind CSS 4 and Motion
- OpenAI JavaScript SDK using `responses.parse`
- Zod schemas for requests, events, model output, investigations, and scenarios
- Cheerio for inert HTML text extraction
- Vitest for security and schema coverage

## Local setup

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo mode needs no environment variables.

For live analysis, set the server-side variables in `.env.local`:

```bash
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-5.6-terra
OPENAI_SEARCH_MODEL=gpt-5.6-luna
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The API key is read only in Node.js route code and is never sent to the browser.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Deploy to Vercel

### Dashboard

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, select **Add New > Project** and import the repository.
3. Keep the detected framework preset as **Next.js** and the build command as `npm run build`.
4. Add `OPENAI_API_KEY` as a Production and Preview environment variable for live analysis.
5. Optionally add `OPENAI_MODEL=gpt-5.6-terra`.
6. Add `NEXT_PUBLIC_APP_URL` with the final `https://...vercel.app` or custom-domain origin.
7. Select **Deploy**. Demo mode remains available when `OPENAI_API_KEY` is omitted.

### CLI

```bash
npm install -g vercel
vercel login
vercel
vercel env add OPENAI_API_KEY production
vercel env add OPENAI_MODEL production
vercel env add NEXT_PUBLIC_APP_URL production
vercel --prod
```

Run `vercel env add` again for `preview` if live analysis is required on preview deployments.

## Security and reliability

The live crawler accepts only HTTP/S, removes credentials and fragments, limits ports, resolves DNS, blocks private/reserved/link-local/metadata destinations, revalidates redirects, honors a conservative robots policy, and caps redirects, time, pages, and retained response bytes. It accepts only text content and uses Cheerio to remove scripts, styles, frames, SVG, and forms before model input. Pages larger than 500 KB are truncated at the byte boundary, the remaining response stream is cancelled, and the resulting coverage warning is preserved in the verdict and memo.

When a public site returns HTTP 403 or 429 to the direct crawler, StartupSignal can fall back to the Responses API web search tool. That fallback is restricted to the submitted domain, cross-checks every displayed evidence URL against the tool's returned source list, marks the sources as indexed with medium reliability, and clearly records the direct-crawl failure in the investigation warnings.

Fetched content is wrapped as untrusted data. The model receives explicit instruction hierarchy, cannot browse beyond the supplied corpus in this release, and must return structured output parsed by Zod. Invalid outputs fail safely rather than reaching the client.

## Vercel constraints and limitations

- Live work runs inside one bounded request with `maxDuration = 60`. A production system with broad web research should use durable run storage and a queue instead of a longer serverless request.
- Direct crawling is intentionally limited to four same-origin pages. Sites may block automation, prohibit crawling, return client-rendered content, or time out. HTTP 403/429 responses use a first-party indexed-source fallback when an API key is configured; other access failures are reported without invented evidence.
- The in-memory rate limiter is best-effort per warm function instance. Add a distributed limiter such as Vercel KV or Upstash before broad public exposure.
- DNS is checked before each fetch and redirect, but network-level egress policy is the strongest defense against DNS rebinding in a high-assurance deployment.
- Live evidence is limited to the submitted company domain. Search engines, social networks, GitHub, press, and independent review sources are future connectors.
- The app does not persist runs across devices or browser refreshes and does not claim predictive accuracy or fiduciary authority.
