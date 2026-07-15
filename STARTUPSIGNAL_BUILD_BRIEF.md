# StartupSignal — Codex Build Brief

## Project

**Name:** StartupSignal  
**GitHub repository:** `startup-signal`  
**Description:** StartupSignal is a multi-agent AI venture partner that turns a startup URL into autonomous due diligence, delivering evidence-backed investment theses, risk analysis, and continuously evolving investment memos.

## End Goal

Build a production-quality, Vercel-ready web application where a user pastes a startup website URL and StartupSignal performs an autonomous, evidence-backed venture analysis.

The experience should feel like an elite investment committee actively investigating a company in real time—not like a generic chatbot, static report generator, or RAG interface.

The initial version must be impressive enough to deploy publicly on Vercel and demonstrate:

- autonomous investigation
- multi-agent reasoning
- evidence collection
- structured debate
- uncertainty handling
- investment scoring
- counterfactual analysis
- a polished, futuristic user experience

---

# Core Product Experience

## Primary User Flow

1. User lands on a minimal homepage.
2. User pastes a startup URL.
3. The interface transforms into a live investigation command center.
4. Specialized agents analyze the startup from different perspectives.
5. Evidence appears as the agents work.
6. An investment committee debates the company.
7. The system produces:
   - company summary
   - founder analysis
   - product analysis
   - technology analysis
   - market analysis
   - competition analysis
   - customer signal analysis
   - business model analysis
   - hiring and momentum signals
   - bull case
   - bear case
   - key risks
   - unresolved questions
   - investment thesis
   - conviction rating
   - scenario probabilities
   - living investment memo
8. The user can run follow-up investigations and stress tests.

## Critical Design Principle

Every pixel should reinforce the feeling that an elite investment committee is actively investigating a company in real time.

Do not present the final answer instantly if a believable sequence of investigation, evidence collection, agent updates, and committee debate creates a more compelling experience.

Do not expose private chain-of-thought. Show concise agent status updates, evidence, conclusions, disagreements, confidence, and structured reasoning summaries.

---

# What This Product Is Not

Do not build:

- a generic chatbot
- a document-upload RAG demo
- a simple startup summary page
- a static score generator
- a fake dashboard with hardcoded conclusions
- a form followed by a wall of text
- a conventional admin dashboard
- an app whose main interface is a chat window

Chat may exist later as a secondary interaction model, but it must not define the product.

---

# Visual Direction

The UI should feel futuristic, premium, restrained, and highly polished.

Take broad inspiration from the design quality of:

- Vercel
- Linear
- Raycast
- Cursor
- Arc
- Stripe
- Apple Vision Pro interfaces
- modern developer tools
- mission-control dashboards

Do not directly copy any brand.

## Style

- dark-first interface
- near-black background
- subtle glass panels
- restrained gradients
- thin illuminated borders
- soft shadows
- strong typography
- generous spacing
- smooth transitions
- tasteful motion
- minimal visual noise
- no neon overload
- no crypto-dashboard aesthetic
- no excessive rounded-card grid
- no generic shadcn look without customization

## Suggested Palette

- Background: `#09090B`
- Elevated surfaces: `#111114`
- Secondary surfaces: `#17171C`
- Primary text: near-white
- Secondary text: muted cool gray
- Accent direction: cyan → electric blue → violet
- Success: restrained green
- Warning: amber
- Risk: coral or red

Use gradients and glow sparingly.

## Motion

Use motion to communicate state and progress:

- investigation phases animate into view
- agents transition between queued, running, and complete
- evidence cards appear as discovered
- progress indicators update smoothly
- conviction and coverage metrics animate when finalized
- committee statements stream sequentially
- graph elements reveal progressively
- avoid gratuitous animation

---

# Landing Page

The landing page should be extremely simple.

## Hero

Headline:

**Turn any startup URL into investment conviction.**

Supporting line:

StartupSignal autonomously investigates founders, product, market, technology, competition, momentum, and risk—then convenes an AI investment committee to produce an evidence-backed thesis.

## Main Input

A large URL input centered prominently:

`https://example-startup.com`

Primary CTA:

**Analyze Startup**

Secondary example links may be shown below, but keep the page clean.

## Optional Supporting Content

Below the fold:

- How it works
- Evidence-first analysis
- Multi-agent investment committee
- Scenario stress testing
- Living investment memo

The homepage should feel complete but not crowded.

---

# Investigation Workspace

After submission, transition into a full-screen workspace without a jarring hard reload.

## Recommended Layout

### Left Rail — Investigation Pipeline

Show all stages:

- Company Discovery
- Website Analysis
- Product
- Founders
- Technology
- Market
- Competition
- Customers
- Business Model
- Hiring & Momentum
- Risks
- Bull Case
- Bear Case
- Investment Committee
- Final Memo

Each stage has a state:

- queued
- running
- blocked
- complete
- low evidence
- failed

### Main Panel — Active Agent

Display the currently active agent with:

- agent role
- current task
- concise status updates
- evidence being examined
- emerging findings
- confidence
- missing information

Examples:

- Reviewing pricing and product positioning
- Comparing GitHub activity across competitors
- Checking founder execution history
- Mapping substitutes and adjacent competitors
- Estimating market timing and adoption barriers

### Right Rail — Evidence Stream

Show evidence as it is discovered:

- source title
- source type
- URL
- relevant excerpt or structured fact
- timestamp
- reliability level
- which agent used it
- claims supported by the evidence

Evidence should be clickable.

No major conclusion should appear without an evidence trail or a clear label that it is an inference.

---

# Specialized Agents

Implement the system as specialized analytical roles.

## 1. Company Discovery Agent

Responsibilities:

- identify company name
- extract canonical domain
- find product pages
- discover pricing
- discover docs
- discover blog
- discover careers
- discover social profiles
- discover GitHub organization or repositories
- discover founder names when publicly available
- find press and major announcements

Output a normalized company profile and list of sources.

## 2. Product Agent

Analyze:

- what the product actually does
- target customer
- use cases
- product maturity
- onboarding
- pricing
- positioning
- product differentiation
- user experience
- likely adoption friction
- whether the value proposition is clear

## 3. Founder Agent

Analyze public evidence about:

- founder background
- relevant expertise
- prior startups
- prior exits
- technical depth
- domain credibility
- execution signals
- public writing or talks
- founder-market fit

Avoid unsupported personality judgments.

## 4. Technology Agent

Analyze:

- technical architecture when discoverable
- developer documentation
- APIs
- GitHub repositories
- release velocity
- open-source traction
- technical differentiation
- implementation difficulty
- dependency risk
- platform risk
- whether the product is easily replicable
- whether a large incumbent could reproduce it

## 5. Market Agent

Analyze:

- category
- customer segment
- market maturity
- market size range
- growth drivers
- tailwinds
- timing
- regulatory factors
- adoption constraints
- expansion opportunities

Prefer ranges and assumptions over fake precision.

## 6. Competition Agent

Identify:

- direct competitors
- indirect competitors
- substitutes
- incumbents
- open-source alternatives
- internal-build alternatives
- platform threats

Create a competitor matrix covering:

- target customer
- positioning
- pricing
- strengths
- weaknesses
- differentiation
- likely winner by customer segment

## 7. Customer Signal Agent

Analyze publicly available signals from:

- case studies
- testimonials
- reviews
- forums
- Hacker News
- Reddit
- product launch communities
- public customer discussions
- documentation feedback
- public issue trackers

Separate actual customer evidence from general online commentary.

## 8. Business Model Agent

Analyze:

- pricing model
- likely revenue model
- gross-margin characteristics
- sales motion
- contract size
- buyer
- sales cycle
- expansion potential
- retention drivers
- monetization risk
- likely capital intensity

## 9. Hiring and Momentum Agent

Analyze:

- open roles
- role mix
- hiring velocity
- geographic expansion
- technical hiring priorities
- go-to-market hiring
- leadership hiring
- product release frequency
- GitHub momentum
- announcement cadence

Use these as weak signals, not absolute proof.

## 10. Risk Agent

Produce:

- top reasons the startup could fail
- platform dependency risks
- founder concentration risk
- regulatory risk
- technical risk
- distribution risk
- market timing risk
- pricing risk
- competition risk
- capital risk
- evidence gaps

## 11. Bull Agent

Construct the strongest evidence-backed case for why the startup could become a category leader.

## 12. Bear Agent

Construct the strongest evidence-backed case for why the startup could stall or fail.

## 13. Investment Committee Partner

Synthesize all agents, resolve disagreements, identify missing diligence, and issue the final recommendation.

---

# Investment Committee Experience

The committee should feel like a structured partner meeting.

Display concise sequential statements from roles such as:

- Technical Partner
- Market Partner
- Founder Partner
- Growth Partner
- Bull Analyst
- Bear Analyst
- Risk Partner
- Managing Partner

Each statement should reference evidence or explicitly identify assumptions.

The committee should debate:

- founder quality
- product value
- market timing
- competition
- technical moat
- distribution
- business model
- platform risk
- upside
- downside
- missing data

Then produce:

- recommendation
- conviction
- confidence
- evidence coverage
- key reasons
- dissenting view
- conditions required to invest
- unanswered diligence questions

Possible recommendations:

- Strong Invest
- Invest
- Watch
- Pass
- Strong Pass
- Insufficient Evidence

Avoid pretending the system has actual fiduciary authority.

---

# Final Analysis Dashboard

## Summary Header

Show:

- company name
- logo or favicon
- URL
- one-sentence description
- category
- stage estimate, clearly labeled as inferred
- location if known
- founders if known
- date analyzed

## Core Metrics

Show separate measures:

- Investment Conviction
- Model Confidence
- Evidence Coverage
- Market Attractiveness
- Founder Strength
- Product Strength
- Technical Defensibility
- Competitive Position
- Business Model Quality
- Execution Momentum
- Overall Risk

Do not compress everything into one unexplained number.

## Probability Scenarios

Include scenario-based estimates such as:

- probability of raising the next institutional round
- probability of meaningful acquisition
- probability of reaching durable product-market fit
- probability of becoming a category leader
- probability of shutdown or stagnation

Every probability must include:

- time horizon
- evidence basis
- assumptions
- confidence interval or confidence level
- top factors that would move the estimate

Avoid fake precision. Prefer ranges where appropriate.

## Key Sections

- Why Now
- Investment Thesis
- Founder-Market Fit
- Product
- Technology and Moat
- Market
- Competition
- Customers
- Business Model
- Momentum
- Bull Case
- Bear Case
- Key Risks
- Missing Information
- Conditions for Investment
- Final Recommendation

---

# Counterfactual and Stress-Test Mode

After the initial memo, present high-value follow-up actions:

- Assume a major platform launches a competing product
- Assume the startup raises $20M
- Assume growth stalls for twelve months
- Assume the company loses its largest customer
- Assume a stronger competitor cuts pricing by 50%
- Assume the startup hires an exceptional enterprise sales leader
- What must be true for this company to become a category leader?
- What evidence would most change the recommendation?
- Build the strongest bear case
- Build the strongest bull case
- Compare against a competitor
- Simulate a Series A partner meeting
- Predict the next twenty-four months

Running a scenario should update:

- thesis
- risks
- probabilities
- recommendation
- confidence
- memo change log

---

# Living Investment Memo

Create a polished memo view that feels like a premium research document.

The memo should include:

- executive summary
- recommendation
- company overview
- thesis
- key evidence
- market analysis
- product analysis
- founder analysis
- technology analysis
- competition
- business model
- risks
- bull case
- bear case
- scenario analysis
- unanswered questions
- source appendix
- generated date
- model and analysis metadata

Provide export-ready formatting, even if PDF export is implemented later.

---

# Evidence-First Reasoning

This is a non-negotiable system principle.

## Requirements

- Every major claim should link to one or more sources.
- Clearly distinguish:
  - observed fact
  - source claim
  - model inference
  - estimate
  - assumption
- Show uncertainty.
- Do not invent revenue, funding, customer counts, founder history, or traction.
- Unknown data must be labeled unknown.
- Contradictory evidence must be surfaced.
- Missing evidence should lower confidence and coverage.
- Probabilities must explain what drives them.
- Agents may disagree.
- The final memo should preserve important dissent.

---

# Data Strategy for Version 1

Do not attempt to build a universal startup database.

Start with a URL-driven investigation.

## Initial Sources

Use publicly reachable data such as:

- company website
- sitemap
- robots.txt
- metadata and Open Graph
- product pages
- pricing pages
- documentation
- blog
- careers page
- public GitHub repositories
- public press
- public founder pages
- public interviews
- public launch pages
- public reviews and discussions when accessible

## Data Collection Constraints

- Respect robots.txt and site terms.
- Use conservative request limits.
- Add timeouts.
- Prevent SSRF.
- Block localhost, private IP ranges, and cloud metadata endpoints.
- Limit crawl depth and page count.
- Sanitize fetched HTML.
- Never execute third-party scripts.
- Do not attempt to bypass authentication, paywalls, CAPTCHAs, or access controls.
- Do not scrape sources that prohibit access.
- Degrade gracefully when data is unavailable.

## Demo Reliability

Because public crawling is unreliable, include a polished demo mode with one or more precomputed startup datasets.

The application must still support live URL analysis, but the demo path should always work during a presentation.

Clearly label demo data.

---

# Technical Stack

Use:

- Next.js with App Router
- TypeScript
- React
- Tailwind CSS
- customized shadcn/ui primitives where useful
- Framer Motion or Motion
- Lucide icons
- OpenAI Responses API
- Vercel AI SDK where it improves streaming
- Zod for schemas and validation
- server-side fetching for investigation
- Vercel-ready deployment
- environment variables for secrets
- strict TypeScript
- ESLint
- production-safe error handling

Use current stable versions compatible with Vercel at implementation time.

## Deployment Requirements

- deployable on Vercel
- no local-only dependencies
- no filesystem persistence assumptions
- no long-running background process required for the core demo
- use serverless-safe architecture
- use timeouts and bounded concurrency
- provide `.env.example`
- provide deployment instructions
- provide graceful fallback when API keys are missing
- provide a demo mode that works without private integrations

---

# Suggested Architecture

```text
app/
  page.tsx
  analyze/
  api/
    analyze/
    investigate/
    scenario/
    report/

components/
  landing/
  investigation/
  evidence/
  committee/
  verdict/
  memo/
  shared/

lib/
  ai/
  agents/
  orchestration/
  schemas/
  scoring/
  evidence/
  crawling/
  security/
  prompts/
  demo/
  utils/

types/
```

## Core Domain Models

Define strict schemas for:

- CompanyProfile
- SourceDocument
- EvidenceItem
- Claim
- AgentTask
- AgentFinding
- AgentReport
- CommitteeStatement
- CommitteeVerdict
- ScoreDimension
- ProbabilityScenario
- InvestmentMemo
- InvestigationRun
- ScenarioRun

Each claim should support:

- id
- text
- type
- confidence
- evidenceIds
- assumptions
- agentId

---

# Orchestration Model

Use a deterministic orchestration layer.

Do not allow agents to freely recurse without limits.

Recommended flow:

1. Normalize URL
2. Securely fetch homepage
3. Discover relevant pages
4. Build source corpus
5. Create company profile
6. Run specialist agents with bounded parallelism
7. Validate agent outputs
8. Retry or repair malformed outputs
9. Run bull and bear synthesis
10. Run committee debate
11. Compute structured scores
12. Generate final memo
13. Stream progress throughout

## Agent Output Rules

Every agent must return structured JSON validated with Zod.

Include:

- summary
- findings
- claims
- evidence references
- risks
- unknowns
- confidence
- requested follow-up data

If validation fails:

- perform a repair attempt
- preserve logs
- fall back safely
- never crash the entire run because one agent failed

---

# Scoring Philosophy

Do not claim scientific predictive accuracy.

The scores should represent structured model judgment based on available evidence.

## Recommended Dimensions

Each dimension includes:

- score from 0 to 100
- label
- confidence
- evidence coverage
- supporting factors
- opposing factors
- assumptions

Do not create an overall score by arbitrary averaging without explanation.

The final recommendation should be generated from:

- structured dimensions
- confidence
- evidence coverage
- critical failure conditions
- committee synthesis

---

# Streaming and State

The user should see progress immediately.

Stream:

- phase changes
- agent status
- evidence discoveries
- concise findings
- errors and recoveries
- committee statements
- final metric updates

For the initial deployment, in-memory run state is acceptable if implemented cleanly, but design interfaces so persistence can later move to a database.

Avoid requiring a database for the first public demo unless it materially improves reliability.

---

# Demo Data

Include at least one high-quality demo company dataset that exercises the entire interface.

The demo should include:

- company profile
- evidence items
- agent outputs
- debate
- scores
- probabilities
- final memo
- scenario update

The demo must not impersonate real private diligence or present fabricated claims as current facts.

A fictional startup is acceptable and may be preferable.

---

# Security

Implement:

- URL validation
- SSRF protection
- private-address blocking
- redirect limits
- fetch size limits
- content-type checks
- HTML sanitization
- rate limiting or basic abuse protection
- prompt-injection resistance for fetched web content
- explicit instruction hierarchy separating source content from system instructions
- output validation
- secret protection
- no API keys exposed to the client

Treat website content as untrusted data, never as instructions.

---

# Accessibility and Responsiveness

- keyboard accessible
- visible focus states
- semantic HTML
- adequate contrast
- reduced-motion support
- responsive desktop and tablet layouts
- usable mobile summary view
- no horizontal overflow
- loading and error states
- skeletons where appropriate

The primary experience may be optimized for desktop, but it must remain usable on mobile.

---

# Build Phases

## Phase 1 — Futuristic Product Shell

Build:

- polished landing page
- startup URL input
- animated transition into workspace
- investigation pipeline
- active-agent view
- evidence stream
- complete demo data path
- responsive layout

The app must already look impressive.

## Phase 2 — Live Investigation Engine

Build:

- secure URL fetch
- page discovery
- source extraction
- evidence normalization
- company profile
- specialist agents
- streaming status
- schema validation
- graceful error handling

## Phase 3 — Investment Committee

Build:

- bull and bear agents
- structured committee debate
- score dimensions
- conviction
- confidence
- evidence coverage
- final verdict
- dissenting view

## Phase 4 — Memo and Scenarios

Build:

- living memo
- source appendix
- scenario actions
- thesis and probability updates
- change log
- comparison-ready architecture

---

# Definition of Done

The first deployable release is complete when:

1. A user can paste a startup URL.
2. The app begins a visible investigation immediately.
3. The user sees multiple specialist agents work.
4. Evidence appears and is linked to claims.
5. The committee debates the startup.
6. The app produces a structured verdict and memo.
7. Unknown information is labeled honestly.
8. The interface looks polished and distinctive.
9. The application deploys successfully to Vercel.
10. A reliable demo mode exists.
11. The README explains setup and deployment.
12. No secret is exposed to the browser.
13. `npm run build`, linting, and type checking pass.

---
