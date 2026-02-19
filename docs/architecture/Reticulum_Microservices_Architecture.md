# Generic Reticulum & LXMF Microservice Architecture Specification

## 1. Scope and Purpose

This document defines a **generic, formal specification** for an **event-driven microservice architecture** based on **Reticulum** for networking and **LXMF** for asynchronous message transport.

The specification is **technology-neutral** with respect to implementation language, runtime, and persistence engines. It is intended to be reusable across multiple projects and deployments.

The **authoritative source of truth** for service interaction is the **AsyncAPI specification** exposed by each microservice.

For R3AKT deployments, this specification is applied in a **hybrid profile**:
- a core modular monolith hosting multiple bounded contexts on one node
- auxiliary services that interact with the core over the same AsyncAPI-defined LXMF contracts

---

## 2. Architectural Principles

* **Asynchronous by design**: all interactions are non-blocking.
* **Event-first**: events are the primary integration mechanism; commands are explicit and intentional.
* **Decentralized**: no mandatory central broker or coordinator.
* **Mesh-native**: routing, reachability, and resilience are delegated to Reticulum.
* **Contract-driven**: AsyncAPI contracts define domains, commands, and events.

---

## 3. Architectural Overview

### 3.1 Core Concepts

* **Microservice**: an autonomous actor responsible for a bounded domain.
* **Service Registry**: a logical registry derived from Reticulum announces.
* **Control Plane**: commands and events exchanged between services.
* **Data Plane**: domain assertions published for distribution and consumption.

---

## 4. Microservice Model (Normative)

A microservice SHALL:

1. Describe a **bounded domain**.
2. Define **commands** it accepts.
3. Define **events** it emits.
4. Own or be associated with a **cryptographic identity** if externally addressable.
5. Announce its **identity and service type**.
6. Provide its **AsyncAPI contract** upon request.

A microservice SHALL NOT:

* Assume synchronous request/response semantics.
* Rely on shared memory or shared databases with other services.

---

## 5. Service Identity and Addressing

* Each externally addressable microservice is represented by a **Reticulum Destination** derived from a cryptographic identity.
* Identity establishes authenticity, integrity, and routing reachability.
* Internal helper components MAY exist without identities and MUST NOT be externally addressable.

---

## 6. Service Registry

### 6.1 Conceptual Model

The **Service Registry** is a decentralized, emergent registry built from **Reticulum announces**.

There is no mandatory centralized registry component.

### 6.2 Registry Responsibilities

The registry SHALL allow services to:

* Discover available services
* Filter services by type and capability
* Track service liveness via announce freshness

---

## 7. Announces and Service Advertisement (Normative)

### 7.1 Announce Semantics

Announces SHALL be used exclusively to advertise **stable service identity and capabilities**.

Announces MUST NOT convey:

* Runtime state
* Metrics
* Mutable operational data

Announces MAY include static capability hints such as supported command and event names.

### 7.2 Mandatory Announce Attributes

Each announce SHALL include:

* `service_id`: stable logical identifier
* `service_type`: classification of the service
* `version`: service version
* `domains`: list of domains owned
* `commands`: list of supported command names (capability hints)
* `events`: list of emitted event names (capability hints)
* `contract_endpoint`: destination/aspect used to request the AsyncAPI contract
* `timestamp`: announce creation time

Announce payload encoding is application-defined and opaque to Reticulum.

---

## 8. Messaging Model

### 8.1 Message Transport

* All messages are transported using **LXMF**.
* Messages are encrypted and authenticated via Reticulum identities.

### 8.1.1 LXMF Field Binding (Normative)

| Semantic class | Required LXMF field | Hex | Notes |
|---|---|---|---|
| Command intent | `FIELD_COMMANDS` | `0x09` | Action/request envelopes only |
| Command outcomes (`accepted`, `rejected`, `result`) | `FIELD_RESULTS` | `0x0A` | Reply lifecycle for commands |
| Events and immutable fact snapshots | `FIELD_EVENT` | `0x0D` | Event-plane facts only |
| Group/topic scope metadata | `FIELD_GROUP` | `0x0B` | Optional; MAY accompany any class |

Normative rules:

* A command MUST include `FIELD_COMMANDS` and MUST NOT be classified as an event.
* A command reply MUST include `FIELD_RESULTS` and correlate to the originating command identifier.
* An event MUST include `FIELD_EVENT` and MUST NOT carry command intent.
* `FIELD_GROUP` MAY be used for topic/group fan-out metadata, but MUST NOT define message class.

### 8.2 Message Categories

#### Commands (Control Plane)

* Intentional requests to perform an action
* MAY result in one or more events
* MUST be encoded as `FIELD_COMMANDS` (`0x09`)

#### Events (Control Plane)

* Facts indicating something has occurred
* Emitted asynchronously
* MUST be immutable
* MUST be encoded as `FIELD_EVENT` (`0x0D`)

#### Domain Assertions (Data Plane)

* Published representations of domain state or observations
* Append-only semantics
* No request/response assumptions
* SHOULD use `FIELD_EVENT` (`0x0D`) when assertions are distributed as immutable facts

---

## 9. AsyncAPI as Source of Truth

### 9.1 Contract Authority

For each microservice:

* The **AsyncAPI specification** is the authoritative description of:

  * Domains
  * Commands
  * Events
  * Message schemas

* All runtime behavior MUST conform to the published AsyncAPI contract.

### 9.2 Contract Discovery

* Each service SHALL expose a mechanism to provide its AsyncAPI document upon request.
* The request mechanism SHALL be advertised in the service announce.
* The contract SHALL be provided in **YAML** format.

---

## 10. Event Routing Patterns

The following routing patterns are permitted:

1. **Direct Fan-Out**: producer sends messages to known consumers
2. **Event Router Service**: intermediary service manages subscriptions
3. **Store-and-Forward**: messages are stored and retrieved by consumers

The chosen pattern MUST be explicit per deployment.

---

## 11. Delivery Semantics

* Delivery is **at-least-once**.
* Consumers MUST implement idempotent handling.
* Deduplication SHOULD be based on message identifiers.

---

## 12. Lifecycle and Evolution

* Services MAY be upgraded independently.
* Multiple versions MAY coexist temporarily.
* Compatibility windows SHOULD be declared in AsyncAPI contracts.

---

## 13. Security Considerations

* All external communication SHALL be authenticated and encrypted.
* Authorization is an application-layer concern and SHALL be enforced explicitly.
* Every command SHALL be checked against caller capabilities before execution.
* Unauthorized commands SHALL be rejected and recorded in audit logs.
* Anti-replay mechanisms SHOULD be implemented.

---

## 14. Observability

* Services SHOULD emit health and lifecycle events.
* Message identifiers SHOULD be included in logs and diagnostics.

---

## 15. Compliance Statement

An implementation is compliant with this specification if it:

* Uses Reticulum for addressing and routing
* Uses LXMF for all inter-service messaging
* Enforces field-level command/result/event distinction using `FIELD_COMMANDS` (`0x09`), `FIELD_RESULTS` (`0x0A`), and `FIELD_EVENT` (`0x0D`)
* Advertises services exclusively via announces
* Publishes and adheres to AsyncAPI contracts
* Enforces explicit capability authorization on every command
* Enforces asynchronous, event-driven semantics

---

## 16. Non-Goals

This specification intentionally does NOT mandate:

* Specific programming languages
* Specific persistence technologies
* Centralized infrastructure components

---
