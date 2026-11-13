# R3AKT — Sovereign Situational Awareness

English/Italian public information site for the R3AKT ecosystem: LXMF-rs / Rust RNS, REM, RCH, YARA, wearables, sensors and planned integrations. Built with React and Vite. The build prerenders the home page and the deployed site needs only a static web host.

## Run locally

Use Node.js 22.13 or newer and npm.

```sh
npm ci
npm run dev
```

For a production preview:

```sh
npm run build
npm run typecheck
npm test
npm start
```

Open the local URL printed by the command. The production preview defaults to port 4173. `dist/` is the deployable website, including the home page, `404.html`, bundled JavaScript and CSS, fonts, images, benchmark data and `.nojekyll`.

## Deploy with GitHub Pages

1. In **FreeTAKTeam/R3AKT → Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
2. Push changes to `website/` on `main`, or run **Actions → Deploy GitHub Pages → Run workflow** on `main`.
3. The [workflow](../.github/workflows/pages.yml) builds and validates the site from `website/` and deploys only `website/dist/`. The deploy job reports the published URL.

`actions/configure-pages` supplies `base_path` as `PAGES_BASE_PATH`. Vite normalizes it to `/R3AKT/` for `https://freetakteam.github.io/R3AKT/`, or `/` for a root site. Bundled assets and files in `public/` use that same base. Sections such as `#roadmap` and `#performance` are anchors on the home page. Unknown paths use the custom `404.html`, which links back to the deployed home.

### Build a repository-path export manually

Bash:

```sh
PAGES_BASE_PATH=/R3AKT npm run build
PAGES_BASE_PATH=/R3AKT npm test
PAGES_BASE_PATH=/R3AKT npm start
```

PowerShell:

```powershell
$env:PAGES_BASE_PATH = '/R3AKT'
npm run build
npm test
npm start
```

Run these commands from `website/` and open `http://127.0.0.1:4173/R3AKT/`. Leave `PAGES_BASE_PATH` unset for a root deployment. A path change requires a new build.

## Maintain capabilities and roadmap

Edit `app/releases.ts` for release tags and plugin versions, and `app/features.ts` for English/Italian descriptions, statuses and evidence links. `app/feature-roadmap.tsx` renders the filters and cards. Update the review date there whenever feature evidence is refreshed. Content is a reviewed snapshot.

| Status | Meaning |
| --- | --- |
| Published | A published product release is linked. Read its acceptance limits. |
| Preview | Downloadable testing build or proof of concept; not a stable-product claim. |
| In development | Implementation or source work exists; release/device acceptance may remain. |
| Soon | Announced upcoming integration; release details are pending. |
| Planned | Research or roadmap work, without a shipped integration. |

Release and roadmap review: 13 November 2026.

- [RCH Python 2.9.6](https://github.com/FreeTAKTeam/Reticulum-Community-Hub/releases/tag/2.9.6): published Python-based package and desktop distribution. Python remains the default; the optional Rust mission-sync bridge is disabled by default. This Published entry is distinct from the RCH 3.0 Rust Preview entry.

- [LXMF-rs v0.16.1](https://github.com/FreeTAKTeam/LXMF-rs/releases/tag/v0.16.1) is the stable release. The [v0.16.2-rc.1 maintenance candidate](https://github.com/FreeTAKTeam/LXMF-rs/releases/tag/v0.16.2-rc.1) is listed separately under Preview.
- [REM 1.6.2](https://github.com/FreeTAKTeam/reticulum_mobile_emergency_management/releases/tag/1.6.2) uses LXMF-rs 0.16.1, includes Complete and Light APKs, and introduces provisional R3S/1 sensor geometry. The [release manifest](https://github.com/FreeTAKTeam/reticulum_mobile_emergency_management/releases/download/1.6.2/release-manifest.json) records signed standalone APKs for Watch Status 1.1.5, ATN Rangefinder 0.4.5, BLE Heart Rate 1.0.1, and goTenna Mesh 0.2.0-beta.2. The goTenna beta remains under Preview. Hardware qualification limits and compatibility details are in the release notes.
- [RCH 3.0.0-preview.38](https://github.com/FreeTAKTeam/Reticulum-Community-Hub/releases/tag/v3.0.0-preview.38) ships Linux AMD64 archive and Debian packages with the matching LXMF-rs release candidate.
- [YARA v1.0.0-beta.3](https://github.com/FreeTAKTeam/YARA/releases/tag/v1.0.0-beta.3) ships unsigned desktop beta builds with multiple identities and a Backbone Client interface. It stays under Preview.
- [REM Tactical T-Rex 2](https://github.com/FreeTAKTeam/rem-tactical-trex2) is in Preview, with documented builds for REM Tactical 1.3.29 and REM Sync 0.1.32. Zepp Store availability is unconfirmed. The Watch Status APK is a separate, published Android component.
- [R3AKTClient](https://github.com/FreeTAKTeam/R3AKTClient) is the shared Rust crate source for REM and RCH. Drone command and control remains in development; provisional sensor geometry does not establish drone control.

## Source structure

```text
.github/workflows/pages.yml   GitHub Pages build and deployment
app/page.tsx                  Existing landing page and language switch
app/rust-stack.tsx             Prominent Rust RNS foundation, capabilities and links
app/releases.ts               Release tags, plugin versions and download links
app/features.ts               Capability content, statuses and source links
app/feature-roadmap.tsx        Filterable capability/roadmap section
app/globals.css               Responsive visual system
app/layout.tsx                Metadata and fonts
public/                       Logos and favicon
scripts/build-static.mjs      Vite build, home prerender and .nojekyll
vite.config.ts                GitHub Pages base path and static HTML entries
tests/static-export.test.mjs   Export content, asset paths and anchor checks
dist/                         Generated website; not tracked
```

GitHub Pages serves this build as static files. Font licenses are included in `dist/licenses/`.

The Italian home includes six [REM tutorials from Resta Connesso](https://www.youtube.com/playlist?list=PLait08aJQUoA). Each card has an Italian summary, a YouTube player loaded on demand and a direct link. The two original demonstration links open YouTube externally. Vite bundles the locally installed Fontsource fonts. Project licenses differ; consult each linked repository for software licensing. Existing branding assets are retained from the supplied site.

## Benchmark reports and motion

The Performance section charts 18 matched workloads from the [corrected LXMF-rs study](https://github.com/FreeTAKTeam/LXMF-rs/blob/v0.16.1/docs/performance.md). Choose P50, P95, P99 or throughput to see the speed ratio and both measured values for every workload. The November source dataset is pinned and hash-checked; `scripts/prepare-benchmarks.mjs` regenerates the compact chart data on each build. `public/benchmarks/provenance.json` records the source and digest.

app/motion-effects.tsx adds scroll reveals, reading progress and a pause control. CSS animates the radar sweep, packet flow, signal bars, beacons, instrument cards and chart transitions. The network display is an illustration, not live telemetry. Reduced-motion preferences are respected; page content remains visible without animation or JavaScript.
