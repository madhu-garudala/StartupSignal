import * as cheerio from "cheerio";
import { assertPublicDestination, normalizePublicUrl, UrlSecurityError } from "@/lib/security/url";
import type { SourceDocument } from "@/lib/schemas/investigation";

const MAX_REDIRECTS = 3;
const MAX_BYTES = 500_000;
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_PAGES = 4;

type FetchedPage = { url: URL; html: string; contentType: string };

export class CrawlHttpError extends Error {
  constructor(public readonly status: number, public readonly url: string) {
    super(`Website returned HTTP ${status}.`);
    this.name = "CrawlHttpError";
  }
}

async function readBounded(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let bytes = 0;
  let output = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BYTES) {
      await reader.cancel();
      throw new UrlSecurityError("A fetched page exceeded the 500 KB safety limit.");
    }
    output += decoder.decode(value, { stream: true });
  }
  return output + decoder.decode();
}

export async function secureFetch(startUrl: URL, accept = "text/html, text/plain;q=0.9"): Promise<FetchedPage> {
  let url = startUrl;
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    await assertPublicDestination(url);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers: { Accept: accept, "User-Agent": "StartupSignalBot/1.0 (+bounded research crawler)" },
        cache: "no-store",
      });
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location || redirect === MAX_REDIRECTS) throw new UrlSecurityError("The website redirected too many times.");
        url = normalizePublicUrl(new URL(location, url).toString());
        continue;
      }
      if (!response.ok) throw new CrawlHttpError(response.status, url.toString());
      const contentType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() ?? "";
      if (!(contentType === "text/html" || contentType === "text/plain")) throw new UrlSecurityError("The URL did not return a supported text page.");
      return { url, html: await readBounded(response), contentType };
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new UrlSecurityError("Unable to fetch the website safely.");
}

function parseRobots(text: string) {
  const disallowed: string[] = [];
  let applies = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    if (key?.toLowerCase() === "user-agent") applies = value === "*" || value.toLowerCase() === "startupsignalbot";
    if (applies && key?.toLowerCase() === "disallow" && value) disallowed.push(value);
  }
  return (url: URL) => !disallowed.some((path) => path === "/" || url.pathname.startsWith(path));
}

async function robotsPolicy(origin: string) {
  try {
    const page = await secureFetch(new URL("/robots.txt", origin), "text/plain");
    return parseRobots(page.html);
  } catch {
    return () => true;
  }
}

function extractPage(page: FetchedPage, id: number): SourceDocument & { links: URL[] } {
  const $ = cheerio.load(page.html);
  $("script, style, noscript, iframe, svg, form").remove();
  const title = $("title").first().text().trim() || $("h1").first().text().trim() || page.url.hostname;
  const description = $("meta[name='description']").attr("content")?.trim();
  const text = $("main, article, body").first().text().replace(/\s+/g, " ").trim().slice(0, 12_000);
  const excerpt = [description, text].filter(Boolean).join(" ").slice(0, 4_000) || "No readable page copy was discovered.";
  const links = $("a[href]")
    .map((_, element) => {
      try { return new URL($(element).attr("href")!, page.url); } catch { return null; }
    })
    .get()
    .filter((url): url is URL => Boolean(url))
    .filter((url) => url.origin === page.url.origin && ["http:", "https:"].includes(url.protocol));

  return {
    id: `source-${id}`,
    title: title.slice(0, 180),
    url: page.url.toString(),
    sourceType: id === 1 ? "Company homepage" : "Company website",
    excerpt,
    fetchedAt: new Date().toISOString(),
    reliability: "high",
    isDemo: false,
    links,
  };
}

const usefulPath = /(product|platform|solution|pricing|about|team|founder|customer|case|docs|developer|career|job|blog)/i;

export async function crawlCompany(input: string) {
  const start = normalizePublicUrl(input);
  const allowed = await robotsPolicy(start.origin);
  if (!allowed(start)) throw new UrlSecurityError("The site robots policy disallows crawling the submitted page.");

  const first = extractPage(await secureFetch(start), 1);
  const queue = first.links
    .filter(allowed)
    .filter((url) => usefulPath.test(url.pathname))
    .filter((url, index, list) => list.findIndex((item) => item.pathname === url.pathname) === index)
    .slice(0, MAX_PAGES - 1);
  const { links: firstLinks, ...firstSource } = first;
  void firstLinks;
  const sources: SourceDocument[] = [firstSource];

  for (const url of queue) {
    try {
      const page = extractPage(await secureFetch(url), sources.length + 1);
      const { links: _links, ...source } = page;
      void _links;
      sources.push(source);
    } catch {
      // One inaccessible secondary page should not invalidate a usable homepage corpus.
    }
  }
  return { canonicalUrl: first.url, sources };
}
