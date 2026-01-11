# R3AKT – Codex Prompts & Acceptance Criteria

This document expands `tasks.md` with **Codex execution prompts** and **acceptance criteria**.
Each section is intended to be fed directly to Codex as a self-contained task batch.

---

## 0. Repository & Baseline

### Codex Prompt
> Initialize a new Python project named `r3akt` following modern Python packaging practices.  
> Create a clean repository structure that supports a Reticulum/LXMF-based core and auxiliary services.  
> Prioritize readability, modularity, and testability over optimization.

### Tasks & Acceptance Criteria
- **Create repository structure**
  - AC: `core/`, `services/`, `schemas/`, `docs/`, `tools/` directories exist.
- **Python packaging baseline**
  - AC: `pyproject.toml` present; project installable with `pip install -e .`.
- **Dependencies**
  - AC: RNS, LXMF, asyncio, pydantic, sqlalchemy, msgpack import without error.
- **CI baseline**
  - AC: CI pipeline runs lint + tests on push.

---

## 1. Reticulum & Identity Foundations

### Codex Prompt
> Implement Reticulum bootstrap and identity management utilities for R3AKT.  
> The system must create, persist, load, and announce Reticulum identities suitable for a server and domain namespaces.

### Tasks & Acceptance Criteria
- **Reticulum bootstrap**
  - AC: Node can start RNS and announce itself.
- **Identity lifecycle**
  - AC: Identities can be created, persisted, reloaded across restarts.
- **R3AKT destination types**
  - AC: Destinations follow `r3akt.actor.*`, `r3akt.node.*`, `r3akt.space.*`.
- **Announce strategy**
  - AC: Identities appear via Reticulum announces.

---

## 2. LXMF Transport Layer

### Codex Prompt
> Implement LXMF ingress and egress services for R3AKT.  
> All operational communication must pass through LXMF with at-least-once semantics.

### Tasks & Acceptance Criteria
- **Ingress**
  - AC: Incoming LXMF messages decoded and normalized.
- **Egress**
  - AC: Outgoing messages sent and ACKs tracked.
- **Metadata extraction**
  - AC: Sender identity, timestamp, and correlation ID captured.
- **Propagation compatibility**
  - AC: Messages survive offline periods via propagation nodes.

---

## 3. Core Event Model

### Codex Prompt
> Implement the immutable event and command model for R3AKT using JSON Schema validation.  
> Events are authoritative; commands are request/response overlays.

### Tasks & Acceptance Criteria
- **Event envelope**
  - AC: Matches `event.json`; immutable once stored.
- **Command envelope**
  - AC: Matches `command.json`; supports correlation IDs.
- **Topic model**
  - AC: Hierarchical dot-separated topics supported.
- **Schema validation**
  - AC: Invalid payloads are rejected with explicit errors.

---

## 4. Event Persistence & Retention

### Codex Prompt
> Implement an append-only event store with time-based retention and auditing.  
> Persistence must tolerate power loss and partial failure.

### Tasks & Acceptance Criteria
- **Append-only store**
  - AC: Events never mutated or deleted directly.
- **Retention policies**
  - AC: Events expire based on TTL.
- **Replay**
  - AC: Event replay possible within retention window.
- **Audit log**
  - AC: All state-affecting actions recorded (who/what/when/why).

---

## 5. Derived State & Confidence Engine

### Codex Prompt
> Build a derived-state engine that computes mutable views from immutable events.  
> Conflicts are expected and represented via confidence scores and competing hypotheses.

### Tasks & Acceptance Criteria
- **Derived state cache**
  - AC: State recomputable from event log.
- **Confidence model**
  - AC: All derived state includes 0.0–1.0 confidence.
- **Conflict handling**
  - AC: Multiple hypotheses can coexist.
- **Query API**
  - AC: Read-only access to state snapshots.

---

## 6. Topic & Subscription Management

### Codex Prompt
> Implement hierarchical topic management and hybrid subscription logic.  
> Topics act as mission and operational scopes.

### Tasks & Acceptance Criteria
- **Topic registry**
  - AC: Topics created explicitly or implicitly.
- **Subscriptions**
  - AC: Explicit subscribe/unsubscribe supported.
- **Implicit matching**
  - AC: Events routed based on topic hierarchy.
- **Fan-out filtering**
  - AC: Capability + topic filtering enforced.

---

## 7. Capability & Security Layer

### Codex Prompt
> Implement capability-based security and identity governance for R3AKT.  
> Trust is layered and revocation must be immediate.

### Tasks & Acceptance Criteria
- **Capability registry**
  - AC: Capabilities defined and versioned.
- **Admin enforcement**
  - AC: Only admin identities modify capabilities.
- **Revocation**
  - AC: Revoked identities are blackholed.
- **Audit**
  - AC: Security events logged.

---

## 8. Core Runtime & Facades

### Codex Prompt
> Implement the R3AKT core runtime as a modular monolith with strict internal boundaries.  
> Contexts communicate only through async events.

### Tasks & Acceptance Criteria
- **Runtime bootstrap**
  - AC: Core starts cleanly on SBC-class hardware.
- **Bounded contexts**
  - AC: No cross-context imports.
- **Internal event bus**
  - AC: Async, non-blocking delivery.
- **Facades**
  - AC: All inter-context access via facades.

---

## 9. HTTP / OpenAPI Control Plane

### Codex Prompt
> Implement the FastAPI control plane strictly from OpenAPI contracts.  
> HTTP is administrative; LXMF remains authoritative.

### Tasks & Acceptance Criteria
- **OpenAPI compliance**
  - AC: Implementation matches spec exactly.
- **Admin endpoints**
  - AC: Health, identities, capabilities, topics, retention, audit work.
- **Mapping**
  - AC: HTTP commands translate to LXMF commands.
- **Validation**
  - AC: Schema validation enforced.

---

## 10. Auxiliary Services

### Codex Prompt
> Implement auxiliary services as event-driven, loosely coupled components.  
> Each service owns its storage and communicates via LXMF events.

### Tasks & Acceptance Criteria
- **Analytics**
  - AC: Windowed, confidence-aware aggregation.
- **ATAK / CoT Gateway**
  - AC: Bidirectional CoT ↔ Event translation.
- **Meshtastic Gateway**
  - AC: Mesh payloads converted to events.
- **Agent Runtime**
  - AC: Agents are read-only + publish-only.

---

## 11. Observability & Operations

### Codex Prompt
> Add operational observability suitable for constrained environments.

### Tasks & Acceptance Criteria
- **Logging**
  - AC: Structured logs.
- **Metrics**
  - AC: Basic counters and gauges exposed.
- **Health**
  - AC: Liveness and readiness endpoints.

---

## 12. Testing Strategy

### Codex Prompt
> Implement tests that reflect real-world mesh, offline, and conflict conditions.

### Tasks & Acceptance Criteria
- **Unit tests**
  - AC: Core domain logic covered.
- **Integration**
  - AC: LXMF round-trip tests.
- **Offline simulation**
  - AC: Partition scenarios tested.
- **Conflict scenarios**
  - AC: Conflicting events handled without crashes.

---

## 13. Documentation

### Codex Prompt
> Produce documentation that enables third-party extension and field deployment.

### Tasks & Acceptance Criteria
- **Developer guide**
  - AC: New developer can run core locally.
- **Plugin guide**
  - AC: Third-party plugin example works.
- **Security docs**
  - AC: Trust and revocation model documented.
- **Deployment profiles**
  - AC: Civilian / SAR / restricted profiles described.

---

**End of Codex execution plan.**
