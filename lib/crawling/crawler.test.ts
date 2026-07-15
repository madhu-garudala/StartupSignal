import { describe, expect, it } from "vitest";
import { readBoundedBody } from "@/lib/crawling/crawler";

describe("readBoundedBody", () => {
  it("returns a complete body below the configured limit", async () => {
    const result = await readBoundedBody(new Response("startup signal"), 32);

    expect(result).toEqual({ text: "startup signal", truncated: false, bytesRead: 14 });
  });

  it("retains only the bounded prefix and cancels oversized content", async () => {
    const result = await readBoundedBody(new Response("0123456789oversized"), 10);

    expect(result).toEqual({ text: "0123456789", truncated: true, bytesRead: 10 });
  });

  it("applies the limit in bytes rather than JavaScript characters", async () => {
    const result = await readBoundedBody(new Response("ééé"), 4);

    expect(new TextEncoder().encode(result.text).byteLength).toBe(4);
    expect(result.truncated).toBe(true);
  });
});
