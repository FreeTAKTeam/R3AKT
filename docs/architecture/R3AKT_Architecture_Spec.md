# R3AKT Architecture Specification (Interview-Derived)

**Version:** 0.2  
**Date:** 2026-02-06  
**Scope:** R3AKT server architecture (core + auxiliary services) for Reticulum/LXMF situational awareness.
**Status:** Canonical implementation baseline.

## 1. Purpose and Constraints

R3AKT is a new system (greenfield) built on prior work (RTH, Reticulum OpenAPI) and is **tightly coupled to the Reticulum ecosystem**. It targets **edge-first, intermittently connected** deployments, including environments without IP connectivity.

**Hard constraints**
- Low-power hardware support (e.g., SBC-class nodes)
- Must function without IP connectivity
- Must interoperate with ATAK via CoT
- Must be usable by non-technical operators

**System authority**
- A single designated node acts as the authoritative server.
- If the server is unavailable, clients operate in degraded mode and rely on Reticulum **propagation nodes** for store-and-forward until the server returns.

## 2. Actors and Responsibilities

### 2.1 Actor categories
- Human operators (field users, commanders)
- Administrative operators (separate identities and tooling)
- Automated agents (analytics and publication only)
- External systems (ATAK, sensors, gateways) as producers and consumers

### 2.2 Capability model
- Clients are classified and managed **by declared/discovered capabilities**.
- Capability assignment and revocation is performed by **server administrators only**.

## 3. Domain and Information Model

### 3.1 Event-centric model
R3AKT is **event-centric** (CoT-like): messages/events are authoritative inputs; derived objects and views are mutable.

- Events are **immutable** once stored.
- Derived domain objects (units, assets, missions, tracks) are mutable and updated by event application.

### 3.2 Event identity and retention
- Event identity is derived from **(Reticulum identity + timestamp)**.
- Events are persisted with **time-based retention**.

### 3.3 Confidence and conflicts
Conflicts are expected and normal. The system models state as degrees of truth:
- Every derived state observation carries **confidence ∈ [0.0, 1.0]**
- Conflict handling is **event-type-specific**, and may preserve multiple competing hypotheses rather than forcing a single truth.

### 3.4 Missions as topics
Missions/operations are represented as **hierarchical topic namespaces**, RTH-style, e.g.:
- `northAmerica.can.ns.hurricane.poldo`

Rules:
- An event may be associated with **zero or more** topics.
- Topics are admin-managed but may be implicitly created by the server upon first use.

### 3.5 Object identity
Domain objects are identified using a Nomadnet-inspired structure:
- A Reticulum identity acts as a namespace root
- Objects are addressed by hierarchical paths under that identity
- Some identifiers may be emergent (event-derived) where required

## 4. Interaction and Communication Model

### 4.1 Dominant pattern
- Primary pattern: **asynchronous, event-driven** client ↔ server interactions.

### 4.2 Commands vs events
- Commands and events are separate message classes.
- Commands use synchronous semantics (request/ack/result) over an asynchronous transport.
- Every command MUST pass explicit capability authorization before execution; unauthorized commands are rejected and audited.

### 4.3 Transport
- Authoritative transport: **LXMF over Reticulum**.

### 4.4 Delivery and back-pressure
- Delivery is treated as **at-least-once** (ACK-based; tentative).
- Slow/offline handling relies on **propagation nodes** with retention/limits (buffer with expiration).

### 4.5 Fan-out and subscriptions
- Server distribution is filtered by **capabilities + topics**.
- Subscriptions are hybrid:
  - explicit subscribe/unsubscribe operations
  - implicit matching based on topic usage

## 5. Architecture Structure and Components

### 5.1 Top-level decomposition
Hybrid structure:
- **Core monolith** (Python, multiprocessing on a single node)
- **Auxiliary services** (polyglot allowed)

### 5.2 Core monolith responsibilities
The core monolith owns:
- LXMF ingress/egress
- Event persistence and retention
- Topic management and subscriptions
- Capability enforcement and security checks

### 5.3 Auxiliary services
Auxiliary services interact with the core via **event-based messaging over Reticulum/LXMF** and own their own storage:
- Analytics / aggregation engine
- ATAK / CoT gateway
- AI / automated agents runtime (publication + analytics only)
- Meshtastic gateway

## 6. Non-Functional Requirements

- Highest priority: **resilience under partial failure**
- Latency: **minutes acceptable** in degraded conditions
- Consistency: **no defined global consistency model**
- Availability: **best-effort**
- Resources: Raspberry Pi–class primary; adapt to variable resources
- Observability: operational metrics + health status
- Upgrades: manual; downtime acceptable

## 7. Security, Trust, Governance

- Layered trust boundaries: network, identity, application
- Identities are administrator-approved; revocation via Reticulum denylisting/blackhole
- Full audit trail required (who/what/when/why)
- Governance is deployment-specific

## 8. Artifact Strategy

- Primary outputs: architecture specification + AsyncAPI (Reticulum/LXMF) + OpenAPI (HTTP).
- AsyncAPI is authoritative for command/event contracts over Reticulum/LXMF.
- OpenAPI is authoritative for northbound HTTP control APIs and auxiliary-service HTTP endpoints.
- Contract mapping between OpenAPI operations and AsyncAPI messages MUST be explicit and testable.
- Automation expectations: code generation and UML/EA model generation.

**Decision traceability**
- `docs/adr/0001-hybrid-core-plus-auxiliary-services.md`
- `docs/adr/0002-asyncapi-for-reticulum-openapi-for-http.md`
- `docs/adr/0003-explicit-capability-authorization-on-every-command.md`

---

## Appendix A. Decision Log

| ID | Area | Decision |
|---|---|---|
| DL-01 | Intent | New system build (greenfield) with reuse/refactor of RTH and Reticulum OpenAPI. |
| DL-02 | Scope boundary | New core system, tightly coupled to the Reticulum ecosystem. |
| DL-03 | Operational context | Edge-first, intermittently connected nodes. |
| DL-04 | Hard constraints | Low-power hardware; no IP dependency; ATAK/CoT interoperability; usability by non-technical operators. |
| DL-05 | State authority | Single designated node (logical R3AKT server). |
| DL-06 | Failure tolerance | Clients operate degraded using propagation nodes; deferred synchronization. |
| DL-07 | Data durability | Context-dependent; data loss and conflicts expected. |
| DL-08 | Security baseline | Reticulum-native identity-based encryption and authentication. |
| DL-09 | Deployment environments | Civilian, public safety/SAR, and military/restricted. |
| DL-10 | Actor categories | Human operators; automated clients/agents; external systems; administrative operators. |
| DL-11 | Authority distribution | Context-dependent by operation type. |
| DL-12 | Client classification | Capability-based (declared and discovered). |
| DL-13 | Capability authority | Server administrator only assigns/revokes capabilities. |
| DL-14 | External systems | Data producers and consumers. |
| DL-15 | Automated agents | Read-only analytics/aggregation + autonomous data publication only. |
| DL-16 | Admin separation | Hard separation (distinct identities and tooling). |
| DL-17 | Domain scope | Missions, situational picture, actors/units, messages/events, assets/resources. |
| DL-18 | Domain primacy | Messages/events are authoritative (CoT-like). |
| DL-19 | Event persistence | Persisted with time-based retention. |
| DL-20 | Event identity | Reticulum identity + timestamp. |
| DL-21 | Situational picture | Hybrid: cached state derived from events. |
| DL-22 | Conflict handling | Event-type-specific rules; non-binary state with confidence. |
| DL-23 | Confidence | Numeric 0.0–1.0 confidence score. |
| DL-24 | Mutability | Events immutable; derived objects mutable. |
| DL-25 | Object identity | Hybrid: Reticulum identity + hierarchical namespace; event-derived aspects. |
| DL-26 | Missions/operations | Topic-based hierarchical namespaces (RTH-style). |
| DL-27 | Event-topic binding | Zero or more topics. |
| DL-28 | Topic lifecycle | Admin managed + implicit server creation on first use. |
| DL-29 | Interaction style | Event-driven, asynchronous. |
| DL-30 | Command vs event | Commands are separate message classes; commands use synchronous semantics; events async. |
| DL-31 | Transport | LXMF over Reticulum is authoritative. |
| DL-32 | Delivery semantics | At-least-once (ACK-based, tentative). |
| DL-33 | Fan-out | Capability + topic filtered distribution. |
| DL-34 | Subscriptions | Hybrid: explicit subscribe/unsubscribe + implicit topic matching. |
| DL-35 | Back-pressure | Propagation-node store-and-forward with limits/expiration. |
| DL-36 | Server decomposition | Hybrid: core monolith + auxiliary services. |
| DL-37 | Core responsibilities | LXMF ingress/egress; event persistence/retention; topic/subscriptions; capability/security enforcement. |
| DL-38 | Aux services | Analytics; ATAK/CoT gateway; AI/agents runtime; Meshtastic gateway. |
| DL-39 | Service coupling | Event-based messaging over Reticulum/LXMF. |
| DL-40 | Persistence ownership | Each service owns its own storage. |
| DL-41 | Core deployment | Multiprocessing on a single node. |
| DL-42 | Tech constraint | Python primary for core; other languages allowed for aux services. |
| DL-43 | Top quality | Resilience under partial failure. |
| DL-44 | Latency | Minutes acceptable in degraded conditions. |
| DL-45 | Consistency | No defined consistency model. |
| DL-46 | Availability | Best-effort only. |
| DL-47 | Resources | Raspberry Pi–class primary; adapt to variable resources. |
| DL-48 | Observability | Operational metrics + health status. |
| DL-49 | Upgrades | Manual; downtime acceptable. |
| DL-50 | Trust boundaries | Layered: network + identity + application. |
| DL-51 | Identity authority | Administrator-approved identities. |
| DL-52 | Revocation | Reticulum denylist/blackhole. |
| DL-53 | Command authorization | Every command requires explicit capability authorization; unauthorized commands are rejected and audited. |
| DL-54 | Governance | Deployment-specific. |
| DL-55 | Auditability | Full audit trail: who/what/when/why. |
| DL-56 | Primary artifacts | Formal architecture document + AsyncAPI specs (LXMF) + OpenAPI specs (HTTP). |
| DL-57 | OpenAPI scope | Northbound/control and auxiliary HTTP APIs only. |
| DL-58 | Contract authority | AsyncAPI is authoritative for Reticulum/LXMF interactions; OpenAPI is authoritative for HTTP APIs. |
| DL-59 | Tooling | VS Code + Codex; Sparx EA; Markdown. |
| DL-60 | Automation | Code + model generation. |
