
## 7. High-Level Architecture (Conceptual)

Components (to be refined into diagrams):

* Reticulum Node Layer

  * Handles all Reticulum interfaces and routing.
* Telemetry Hub Adapter

  * Connects to Reticulum Telemetry Hub, normalizes streams.
* LXMF Gateway

  * Uses Reticulum OpenAPI project to send/receive LXMF messages.
* R3AKT Core API

  * REST + WebSocket server implementing SA logic, mission model, entities, alerts, replay.
* Plugin / Microservice Runtime

  * Manages integration services (Home Assistant, others) and domain-specific logic.
* Storage Layer

  * Time-series DB or efficient store for telemetry.
  * Document or relational DB for configuration, missions, users, events.
* Web Client

  * SPA consuming REST + WebSocket.
* Electron Wrapper

  * Same SPA bundled for offline / desktop use.

This architecture shall remain agnostic of specific frameworks until a short spike confirms the best choices (e.g. FastAPI vs. other Python frameworks, DB selection, etc.).

---
# R3AKT Technical Architecture Specification

## 1 Overview

R3AKT is a next‑generation situational awareness and telemetry platform built on top of the Reticulum mesh network and inspired by existing FreeTAKTeam projects such as Reticulum‑Telemetry‑Hub (RTH) and Reticulum OpenAPI. It provides an extensible, asynchronous, microservice‑oriented architecture for collecting telemetry, processing commands and exposing data to clients through both the low‑bandwidth Reticulum LXMF protocol and a standard HTTP/REST interface. In keeping with the Aphrodites/DigitalPy design philosophy and the Expedibox best‑practices document, the system emphasizes clear separation of concerns, bounded contexts, idempotent operations, domain‑driven design and a plug‑in friendly component model.

### 1.1 Goals

* Mesh‑native communication using Reticulum and LXMF
* Extensible command‑driven API over LXMF and HTTP
* Telemetry collection, replication and querying
* Modular, plugin‑based architecture (frozen spots / hot spots)
* Domain‑driven design with bounded contexts and facades
* Idempotent, observable and secure operations

## 2 Key Principles & Best Practices

1. Domain‑first modelling with pure Python domain objects
2. Strict bounded contexts with explicit facades
3. Service and command layers separate from persistence
4. Explicit state machines for lifecycle‑driven entities
5. Idempotency for all external interactions
6. Async‑first design using asyncio
7. Plugin/component architecture inspired by DigitalPy
8. Structured logging, observability and error handling
9. Strong security defaults
10. Testability at unit, integration and system level


Below is a **technical specification** for implementing **domain objects in R3AKT**, aligned with Reticulum constraints, NomadNet lessons, and optional C2 evolution.
This is written as an **implementation-ready spec**, not a concept note.

---



# R3AKT Domain Objects – Technical Specification

## 1. Scope and Goals

This specification defines how **domain objects** are represented, published, related, and consumed in **R3AKT**, operating over **Reticulum**.

Goals:

* Avoid REST / CRUD anti-patterns
* Avoid identity explosion
* Support duplication, divergence, and partial knowledge
* Remain human-readable and tool-friendly (JSON, UML)
* Allow optional evolution toward C2 semantics

Non-goals:

* Global consistency
* Canonical object registries
* Synchronous access patterns

---

## 2. Fundamental Architectural Rules

### R1 — Identity Rule

Only **speaking actors** receive Reticulum identities.

A *speaking actor* is an entity that:

* can emit signed assertions
* has an independent lifecycle
* may exercise authority or intent

Examples:

* human operator
* autonomous system
* organization
* gateway / service node

Everything else is **not an identity**.

---

### R2 — Domain Objects Are Assertions

Domain objects are **named assertions published by an identity**, not globally addressable resources.

They:

* live inside a semantic namespace
* are contextual
* may be duplicated by different identities
* have no independent routing presence

---

### R3 — Hierarchy Is Semantic, Not Authoritative

Hierarchical structure:

* expresses *context*
* does not imply truth or ownership
* is interpreted locally by consumers

---

## 3. R3AKT Destination Types (Closed Set)

R3AKT defines a **small, fixed set of RNS destination roles**, inspired by NomadNet.

| Type                 | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `r3akt.actor.<hash>` | Human or autonomous decision-maker       |
| `r3akt.node.<hash>`  | Service, gateway, bridge                 |
| `r3akt.space.<hash>` | Semantic space publishing domain objects |

Each destination:

* is derived from a public key
* is announced using standard RNS announce packets
* owns exactly one semantic namespace

No other destination types are allowed.

---

## 4. Semantic Namespace Model

Each `r3akt.space.*` destination exposes a **hierarchical namespace**.

### 4.1 Namespace Characteristics

* UTF-8 path syntax
* Slash-separated (`/`)
* Case-sensitive
* No global uniqueness guarantees
* Entire namespace is owned and signed by the destination identity

### 4.2 Recommended Top-Level Paths

```
/
├── units/
├── vehicles/
├── sensors/
├── zones/
├── relations/
├── events/
├── tasks/
└── metadata/
```

These are **conventions**, not protocol requirements.

---

## 5. Domain Object Representation

### 5.1 Object Envelope (Mandatory)

Every domain object MUST be wrapped in the following envelope:

```json
{
  "path": "/units/alpha",
  "type": "unit",
  "timestamp": "2026-01-02T15:04:05Z",
  "schema": "r3akt.unit.v1",
  "payload": { }
}
```

| Field       | Meaning                   |
| ----------- | ------------------------- |
| `path`      | Local semantic identifier |
| `type`      | Domain object category    |
| `timestamp` | Assertion time            |
| `schema`    | Payload schema identifier |
| `payload`   | Object-specific data      |

---

### 5.2 Payload Schemas

Payloads are defined using **JSON Schema**.

Example: `r3akt.unit.v1`

```json
{
  "type": "object",
  "properties": {
    "designation": { "type": "string" },
    "position": { "$ref": "geo.schema.json" },
    "status": { "enum": ["active","inactive","unknown"] }
  },
  "required": ["designation","position"]
}
```

Payload schemas:

* MUST be immutable once published
* MAY be versioned
* MUST NOT contain references to external identities

---

## 6. Domain Object Categories

### 6.1 State Objects

Describe the *current known state*.

* May be superseded
* Not append-only
* Consumers choose latest by policy

Path example:

```
/units/alpha/state
```

---

### 6.2 Event Objects

Describe *historical facts*.

* Append-only
* Never modified
* Never deleted

Path example:

```
/events/unit-alpha-moved-20260102T1504
```

---

### 6.3 Relation Objects

Describe relationships **within the semantic space**.

```json
{
  "path": "/relations/command/uav07",
  "type": "command_relation",
  "payload": {
    "from": "/units/red",
    "to": "/vehicles/uav-07",
    "scope": "operational"
  }
}
```

Relations:

* are assertions, not bindings
* are valid only in the context of the publishing identity
* may conflict with other identities’ assertions

---

### 6.4 Intent / Task Objects (Optional C2 Profile)

```json
{
  "path": "/tasks/recon-north",
  "type": "task",
  "payload": {
    "target": "/vehicles/uav-07",
    "intent": "recon",
    "area": "/zones/perimeter-north",
    "issued_by": "/metadata/self"
  }
}
```

Execution is **not guaranteed**.

---

## 7. Transport Mapping

### 7.1 LXMF Payload Mapping

Each domain object is transported as a single **LXMF message**:

* Destination: the publishing `r3akt.space.*`
* Content: JSON object envelope
* Fields: MAY include compression or schema hints

No request/response semantics are assumed.

---

### 7.2 Propagation Nodes

Propagation nodes:

* cache messages verbatim
* do not interpret semantics
* do not enforce authority
* may discard based on size or policy

---

## 8. Duplication and Conflict Handling

Duplication is **expected**.

Consumers MUST:

* maintain separate views per publishing identity
* apply local trust, freshness, and authority policies
* never assume global consistency

There is **no global merge algorithm**.

---

## 9. Security Model

* All messages are signed by the publishing identity (RNS)
* End-to-end encryption is provided by Reticulum
* Authorization is **consumer-side policy**
* No central ACLs exist

---

## 10. Tooling Compatibility

This model is compatible with:

* UML (via stereotypes: Actor, Fact, Event, Relation)
* JSON Schema
* OpenAPI (schema definition only, not invocation)
* Code generation pipelines

---

## 11. Explicit Anti-Patterns (Forbidden)

❌ Domain object = RNS identity
❌ REST endpoints over Reticulum
❌ Global object IDs
❌ Mutable shared state
❌ Implicit authority via structure

---

## 12. Summary

R3AKT domain objects are:

> **Signed, hierarchical situational assertions published by autonomous identities.**

This model:

* scales
* matches Reticulum semantics
* aligns with NomadNet practice
* allows optional C2 evolution
* avoids REST-era assumptions


## 3 High‑Level Architecture

R3AKT is composed of a core runtime that hosts multiple asynchronous services sharing the same event loop but decoupled through facades and an internal event bus.

* Reticulum / LXMF Service
* HTTP / REST Northbound Gateway (for administrative purposes)
* Plugin Manager
* Bounded Contexts (Telemetry, Command, Topic, etc.)
* Shared Infrastructure (DB, schemas, event bus, logging)

## 4 Bounded Contexts

Each functional area is implemented as an isolated bounded context with its own domain models, services, repositories and facade.

* Telemetry
* Command
* Topic
* Optional plugin‑defined contexts

All cross‑context interaction occurs exclusively via facades.

## 5 Core Services
Core services are provided by the Reticulum Telemetry Hub.


### LXMF Service

* Receives LXMF messages
* Extracts command and request ID
* Validates payload against schema
* Dispatches to controller
* Returns idempotent response

### HTTP Service Northbound

* FastAPI‑based REST interface
* Mirrors LXMF commands
* Shared controllers and facades

### Plugin Manager

* Discovers and loads plugins at runtime
* Registers commands, schemas, controllers and tasks
* Supports install/uninstall without core changes


## 9. Open Questions / To-Refine

OQ-01: Exact data model for entities and missions (align with prior R3AKT modeling work).
OQ-02: Choice of base map technology and offline tile strategy.
OQ-03: Concrete performance targets (number of clients / tracks / events) for typical deployments.
OQ-04: Detailed Home Assistant integration patterns (poll vs. webhook vs. MQTT, etc.).
OQ-05: Governance of plugins (signing, trust model, distribution).
These can be resolved iteratively as the design doc and prototypes evolve.