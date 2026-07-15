import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", coverage: { reporter: ["text", "json"] } },
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
});
