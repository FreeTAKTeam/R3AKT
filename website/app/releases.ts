const github = "https://github.com/FreeTAKTeam";

function release(repo: string, tag: string) {
  const repository = `${github}/${repo}`;
  return { repository, tag, notes: `${repository}/releases/tag/${tag}` };
}

export const remRelease = release("reticulum_mobile_emergency_management", "1.6.2");
export const remAsset = (name: string) => `${remRelease.repository}/releases/download/${remRelease.tag}/${name}`;
export const rchPython = release("Reticulum-Community-Hub", "2.9.6");
export const rchRust = release("Reticulum-Community-Hub", "v3.0.0-preview.38");
export const lxmfStable = release("LXMF-rs", "v0.16.1");
export const lxmfCandidate = release("LXMF-rs", "v0.16.2-rc.1");
export const yaraRelease = release("YARA", "v1.0.0-beta.3");
export const remPluginVersions = { atn: "0.4.5", watch: "1.1.5", gotenna: "0.2.0-beta.2", heartRate: "1.0.1" };
export const atnSetup = `${github}/atn-rangefinder/blob/corvo/implement-adapter/android/README.md`;
