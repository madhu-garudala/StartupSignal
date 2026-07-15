import { describe, expect, it } from "vitest";
import { assertPublicDestination, isPrivateAddress, normalizePublicUrl, UrlSecurityError } from "@/lib/security/url";

describe("normalizePublicUrl", () => {
  it("normalizes a public hostname and removes fragments", () => {
    expect(normalizePublicUrl("Example.com/path#secret").toString()).toBe("https://example.com/path");
  });

  it.each([
    "http://localhost",
    "http://127.0.0.1",
    "http://10.0.0.4",
    "http://169.254.169.254/latest/meta-data",
    "http://[::1]",
    "file:///etc/passwd",
    "https://user:pass@example.com",
    "https://example.com:8080",
    "https://service.internal",
  ])("blocks unsafe target %s", (target) => {
    expect(() => normalizePublicUrl(target)).toThrow(UrlSecurityError);
  });
});

describe("address validation", () => {
  it.each(["0.0.0.0", "10.20.30.40", "100.64.1.2", "172.31.0.1", "192.168.1.1", "198.18.0.1", "198.51.100.2", "203.0.113.4", "::1", "fc00::1", "fe80::1", "2001:db8::1", "::ffff:127.0.0.1", "::ffff:7f00:1"])("classifies %s as private or reserved", (address) => {
    expect(isPrivateAddress(address)).toBe(true);
  });

  it.each(["8.8.8.8", "1.1.1.1", "2606:4700:4700::1111"])("allows public address %s", (address) => {
    expect(isPrivateAddress(address)).toBe(false);
  });

  it("rejects hostnames when any DNS answer is private", async () => {
    await expect(assertPublicDestination(new URL("https://example.com"), async () => ["93.184.216.34", "127.0.0.1"])).rejects.toThrow(UrlSecurityError);
  });

  it("allows a hostname with only public DNS answers", async () => {
    await expect(assertPublicDestination(new URL("https://example.com"), async () => ["93.184.216.34"])).resolves.toBeUndefined();
  });
});
