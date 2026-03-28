export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Plugin {
  name: string;
  description: string;
  package: string;
}

export interface InstallMethod {
  label: string;
  command: string;
  description: string;
}

export interface Interface {
  name: string;
  status: "stable" | "experimental" | "planned";
  description: string;
}

export interface SiteData {
  version: string;
  features: Feature[];
  plugins: Plugin[];
  installMethods: InstallMethod[];
  interfaces: Interface[];
}
