# R3AKT – Codex Task List

This task list is derived from the frozen R3AKT architecture, domain-object specification, and Reticulum-based microservices design.  
Tasks are ordered to support **incremental, testable delivery** and **Codex-friendly execution**.

---

## 0. Repository & Baseline

- [ ] Create new Git repository `r3akt`
- [ ] Define top-level structure:
  - `core/`
  - `services/`
  - `schemas/`
  - `docs/`
  - `tools/`
- [ ] Add Python packaging baseline (`pyproject.toml`)
- [ ] Add development dependencies (asyncio, pydantic, sqlalchemy, msgpack, RNS, LXMF)
- [ ] Configure linting, formatting, and basic CI

---

## 1. Reticulum & Identity Foundations

- [ ] Implement Reticulum bootstrap module
- [ ] Create identity management utilities
  - identity creation
  - identity loading
  - identity persistence
- [ ] Implement R3AKT destination types:
  - `r3akt.actor.*`
  - `r3akt.node.*`
  - `r3akt.space.*`
- [ ] Implement announce strategy for node and space identities
- [ ] Document identity lifecycle and key storage

---

## 2. LXMF Transport Layer

- [ ] Implement LXMF ingress service
- [ ] Implement LXMF egress service
- [ ] Support message metadata extraction:
  - sender identity
  - timestamp
  - message hash / correlation id
- [ ] Implement ACK handling (best-effort, at-least-once semantics)
- [ ] Add propagation-node compatibility tests

---

## 3. Core Event Model

- [ ] Implement immutable Event envelope (per `event.json`)
- [ ] Implement Command envelope (per `command.json`)
- [ ] Implement Topic model (hierarchical, RTH-style)
- [ ] Implement Domain Object envelope (Nomadnet-inspired)
- [ ] Add JSON Schema validation for all envelopes
- [ ] Add schema versioning strategy

---

## 4. Event Persistence & Retention

- [ ] Design event storage abstraction
- [ ] Implement append-only event store
- [ ] Implement time-based retention policies
- [ ] Implement per-topic retention overrides
- [ ] Add replay capability (bounded by retention)
- [ ] Implement audit log persistence (who/what/when/why)

---

## 5. Derived State & Confidence Engine

- [ ] Implement derived-state cache
- [ ] Implement confidence model (0.0–1.0)
- [ ] Support multiple competing hypotheses
- [ ] Implement event-type-specific conflict handlers
- [ ] Define default freshness and trust heuristics
- [ ] Provide read-only query interface for state views

---

## 6. Topic & Subscription Management

- [ ] Implement topic registry
- [ ] Implement implicit topic creation on first use
- [ ] Implement explicit subscribe / unsubscribe commands
- [ ] Implement implicit subscription via topic matching
- [ ] Enforce capability-based fan-out filtering
- [ ] Add topic audit logging

---

## 7. Capability & Security Layer

- [ ] Implement capability registry
- [ ] Implement admin-only capability assignment
- [ ] Enforce capability checks on ingress
- [ ] Implement identity revocation (Reticulum blackhole)
- [ ] Implement separation of admin vs operator identities
- [ ] Add security-related audit events

---

## 8. Core Runtime & Facades

- [ ] Implement core runtime bootstrap
- [ ] Implement bounded contexts:
  - telemetry
  - command
  - topic
- [ ] Implement facades for all cross-context interaction
- [ ] Implement internal async event bus
- [ ] Ensure no cross-context direct coupling

---

## 9. HTTP / OpenAPI Control Plane

- [ ] Implement FastAPI-based control API
- [ ] Implement endpoints from OpenAPI spec:
  - health
  - metrics
  - identities
  - capabilities
  - topics
  - retention
  - audit search
- [ ] Ensure HTTP commands map 1:1 to LXMF commands
- [ ] Generate server stubs from OpenAPI (contract-first)
- [ ] Add OpenAPI schema validation tests

---

## 10. Plugin & Microservice Runtime

- [ ] Implement plugin manager
- [ ] Define plugin manifest format
- [ ] Support dynamic load/unload of plugins
- [ ] Allow plugins to:
  - register schemas
  - register commands
  - register handlers
- [ ] Implement plugin sandboxing rules
- [ ] Define plugin governance & signing model (placeholder)

---

## 11. Auxiliary Services

### Analytics Service
- [ ] Implement analytics job model
- [ ] Implement windowed aggregation over events
- [ ] Implement confidence-aware aggregation
- [ ] Implement Analytics OpenAPI endpoints

### ATAK / CoT Gateway
- [ ] Implement CoT → Event translation
- [ ] Implement Event → CoT translation
- [ ] Handle duplication and conflicting CoT updates
- [ ] Implement gateway configuration API

### Meshtastic Gateway
- [ ] Implement Meshtastic message ingestion
- [ ] Translate Meshtastic payloads to events
- [ ] Implement gateway configuration API

### Agent Runtime
- [ ] Implement agent registration
- [ ] Enforce read-only + publish-only constraint
- [ ] Implement agent lifecycle (start/stop)
- [ ] Add agent audit logging

---

## 12. Observability & Operations

- [ ] Implement structured logging
- [ ] Implement metrics collection
- [ ] Implement health checks
- [ ] Add basic operational dashboards (optional)
- [ ] Document operational procedures

---

## 13. Tooling & Model Generation

- [ ] Generate UML models from code
- [ ] Generate Sparx EA XMI from architecture
- [ ] Validate EA import round-trip
- [ ] Maintain Markdown ↔ model traceability
- [ ] Prepare Codex prompts for each bounded context

---

## 14. Testing Strategy

- [ ] Unit tests for domain logic
- [ ] Integration tests for LXMF flows
- [ ] Reticulum-in-the-loop tests
- [ ] Offline / partition simulation tests
- [ ] Conflict and duplication scenario tests

---

## 15. Documentation

- [ ] Architecture overview (from spec)
- [ ] Developer guide
- [ ] Plugin developer guide
- [ ] Security & trust model documentation
- [ ] Deployment profiles (civilian / SAR / restricted)

---

## 16. Deferred / Open Questions

- [ ] Resolve base map & offline tile strategy
- [ ] Define performance envelopes
- [ ] Finalize plugin governance model
- [ ] Home Assistant integration patterns

---

**End state:**  
A resilient, event-centric, Reticulum-native situational awareness platform fully aligned with the R3AKT architecture.
