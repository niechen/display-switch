import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

if (process.platform !== "darwin")
  throw new Error("Build on macOS with Xcode Command Line Tools.");
mkdirSync("assets", { recursive: true });
for (const arch of ["arm64", "x86_64"]) {
  execFileSync(
    "xcrun",
    [
      "swiftc",
      "-O",
      "-target",
      `${arch}-apple-macosx13.0`,
      "native/DisplayControl.swift",
      "-o",
      resolve(`assets/display-control-${arch}`),
    ],
    { stdio: "inherit" },
  );
  execFileSync(
    "/usr/bin/codesign",
    ["--force", "--sign", "-", `assets/display-control-${arch}`],
    { stdio: "inherit" },
  );
}
