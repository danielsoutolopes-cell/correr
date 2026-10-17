import { runSeed } from "./seed";

runSeed()
  .then(() => {
    console.log("[Seed Runner] Completed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("[Seed Runner] Failed:", err);
    process.exit(1);
  });
