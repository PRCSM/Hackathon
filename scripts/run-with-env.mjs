import { loadEnvConfig } from "@next/env";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables dynamically based on process.cwd()
loadEnvConfig(process.cwd());

// Dynamic import of the actual script now that env is loaded
import("./run-migration.mjs");
