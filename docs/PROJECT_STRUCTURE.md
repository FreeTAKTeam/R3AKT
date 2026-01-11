# Project Structure

This repo is organized as a monorepo with deployable services, clients, and shared packages.

```
apps/                         # User-facing clients
  server/                     # Backend app shell (FastAPI/WebSocket entrypoint)
  web/                        # Browser UI (SPA)
  desktop/                    # Electron wrapper for the web client
  mobile-android/             # Android client app
services/                     # Backend microservices
  core-api/                   # Mission/entity/alert APIs
  telemetry-adapter/          # Reticulum Telemetry Hub ingestion
  lxmf-gateway/               # LXMF send/receive service
  plugin-runtime/             # Plugin lifecycle + runtime
  integrations/               # External systems
    home-assistant/           # Home Assistant integration service
packages/                     # Shared libraries
  r3akt-core/                 # Domain models, services, facades
  r3akt-protocol/             # REST/WebSocket message envelopes
  r3akt-schemas/              # JSON schemas for commands and domain objects
configs/                      # Example configs and templates
  reticulum/                  # RNS interface configs
  r3akt/                      # Server and service configs
  logging/                    # Logging/metrics configs
docs/                         # Specs and design docs
  architecture/               # Architecture notes and diagrams
  requirements/               # Requirements and planning
  adr/                        # Architecture decision records
infra/                        # Deployment artifacts
  docker/                     # Container images and compose files
  systemd/                    # Systemd units for services
  k8s/                        # Kubernetes manifests
scripts/                      # Dev and ops scripts
tests/                        # Cross-service tests
```

Notes:
- Use `apps/` for user-facing clients and entrypoints.
- Use `services/` for independently deployable backend processes.
- Put reusable code in `packages/` to keep service boundaries clean.
