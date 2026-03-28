import type { SiteData, Plugin } from "@/types/content";

const GITHUB_RAW =
  "https://raw.githubusercontent.com/albinotonnina/echos/main";

const FALLBACK: SiteData = {
  version: "0.13.1",
  features: [
    {
      title: "Capture",
      description:
        "Send anything — voice notes, URLs, text, images. EchOS extracts, summarizes, and tags it automatically.",
      icon: "inbox",
    },
    {
      title: "Search",
      description:
        "Hybrid search combining full-text (BM25) and semantic vectors with Reciprocal Rank Fusion. Find what you mean, not just what you typed.",
      icon: "search",
    },
    {
      title: "Write",
      description:
        "Generate blog posts, emails, and threads grounded in your notes — in your voice, trained on your writing examples.",
      icon: "pen-tool",
    },
  ],
  plugins: [
    {
      name: "YouTube",
      description: "Transcript extraction",
      package: "@echos/plugin-youtube",
    },
    {
      name: "Article",
      description: "Web article extraction",
      package: "@echos/plugin-article",
    },
    {
      name: "Twitter",
      description: "Tweet thread extraction",
      package: "@echos/plugin-twitter",
    },
    {
      name: "Image",
      description: "Image storage & analysis",
      package: "@echos/plugin-image",
    },
    {
      name: "Digest",
      description: "Daily knowledge digest",
      package: "@echos/plugin-digest",
    },
    {
      name: "Journal",
      description: "Periodic journaling",
      package: "@echos/plugin-journal",
    },
  ],
  installMethods: [
    {
      label: "Homebrew",
      command: "brew install echos && echos-setup",
      description: "macOS — quickest path",
    },
    {
      label: "One-liner",
      command:
        "curl -sSL https://raw.githubusercontent.com/albinotonnina/echos/main/install.sh | bash",
      description: "Linux / macOS — auto-installs everything",
    },
    {
      label: "Docker",
      command: "docker compose up -d",
      description: "Production — isolated, reproducible",
    },
    {
      label: "Manual",
      command: "git clone https://github.com/albinotonnina/echos.git && cd echos && pnpm install && pnpm build",
      description: "Full control — build from source",
    },
  ],
  interfaces: [
    {
      name: "Telegram",
      status: "stable",
      description: "Primary interface — voice, text, media",
    },
    {
      name: "CLI",
      status: "stable",
      description: "Standalone terminal interface",
    },
    {
      name: "Web",
      status: "experimental",
      description: "REST API + web UI",
    },
  ],
};

async function fetchText(path: string): Promise<string | null> {
  try {
    const res = await fetch(`${GITHUB_RAW}/${path}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

function parseVersion(packageJson: string): string {
  try {
    const pkg = JSON.parse(packageJson);
    return pkg.version || FALLBACK.version;
  } catch {
    return FALLBACK.version;
  }
}

function parsePlugins(packageJson: string): Plugin[] {
  try {
    const pkg = JSON.parse(packageJson);
    const workspaces: string[] = pkg.pnpm?.overrides
      ? []
      : Object.keys(pkg.devDependencies || {});

    // Look for plugin workspace references
    const pluginPackages = Object.keys(pkg.dependencies || {})
      .concat(Object.keys(pkg.devDependencies || {}))
      .filter((dep) => dep.startsWith("@echos/plugin-"));

    if (pluginPackages.length === 0) return FALLBACK.plugins;

    return pluginPackages.map((pkg) => ({
      name: pkg.replace("@echos/plugin-", "").replace(/-/g, " "),
      description: "",
      package: pkg,
    }));
  } catch {
    return FALLBACK.plugins;
  }
}

export async function getSiteData(): Promise<SiteData> {
  const packageJson = await fetchText("package.json");

  if (!packageJson) {
    return FALLBACK;
  }

  const version = parseVersion(packageJson);

  return {
    ...FALLBACK,
    version,
  };
}
