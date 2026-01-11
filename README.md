# R3AKT

Reticulum-based situational awareness and telemetry platform for small to mid-size tactical groups, designed for secure, low-cost, resilient operation in connected and off-grid environments.

## Document Map
- docs/PROJECT_STRUCTURE.md
- docs/architecture/r3akt_Architecture.md

## 1. Context & Vision

R3AKT (R3AKT — Reticulum Reactive & Resilient Action Kit) is a Reticulum-based system for small to mid-size tactical groups  requiring secure, low-cost, resilient situational awareness (SA) in both connected and off-grid environments.

The system will:

* Provide a shared tactical picture (tracks, messages, alerts, sensor data) over secure Reticulum networks.
* Support both low-bandwidth radio links and higher-bandwidth IP backhaul.
* Expose a modern web UI and API surface for extensibility and automation.

---

## 2. Business Intent & Use Cases

### 2.1 Business Objectives

BO-01: Enable small tactical teams (civilian SAR, community response, volunteer defense, private security, etc.) to achieve TAK-like situational awareness without dependence on closed, state-controlled ecosystems.

BO-02: Offer a cost-effective solution that can run on commodity hardware (e.g. single-board computers, low-power servers) and inexpensive radios.

BO-03: Provide a robust SA backend that can be embedded into other products (e.g. mesh nodes, command kits, commercial offerings).

BO-04: Ensure the system can be extended via plugins/microservices to cover specialized missions (SAR, convoy operations, homestead defense, critical infrastructure monitoring).

### 2.2 Primary Use Cases (to align with previous R3AKT brainstorming)

UC-00 – Distributed Emergency Messaging System (DEMS)

* Field nodes send emergency alerts via LXMF over Reticulum.
* The API receives, stores, and triggers automated responses.
* The web dashboard displays alerts in real time.

UC-01 – Team Position Tracking – Team Position Tracking

* Track human operators, vehicles, and assets as moving icons on a shared map.
* Sources: telemetry clients (Reticulum Telemetry Hub), LXMF messages, Home Assistant sensors.

UC-02 – Emergency & Priority Messaging

* Send/receive structured emergency messages (e.g. MEDIVAC, CASUALTY, CONTACT, SOS) over low-bandwidth links.
* Support acknowledgement, escalation, and basic workflow (sent → received → acknowledged → closed).

UC-03 – Mission Rooms / Operations Channels

* Define “ops rooms” based on topics grouping tracks, messages, and overlays (e.g. "SAR Team Alpha", "Perimeter Watch", "Convoy 3").
* Allow operators to join/leave topic and filter their view accordingly.

UC-04 – Geofenced Alerts & Zones

* Define areas (polygons, circles) and trigger alerts on entry/exit or certain telemetry thresholds (e.g. speed, battery, heart rate).

UC-05 – Asset & Sensor Monitoring

* Integrate stationary sensors via Home Assistant (doors, motion, driveway alarms, cameras, environmental sensors).
* Show sensor state and events on the map and in a timeline.

UC-06 – Offline / Disconnected Operations

* Allow field nodes to operate with partial data and resync when connectivity is restored using Reticulum Propagation nodes
* Support store-and-forward via LXMF propagation where real-time connectivity is not possible.

UC-07 – After-Action Review & Replay

* Record timeline of positions, events, messages.
* Provide playback/replay of selected missions for training and debriefing.

UC-08 – Multi-Network Bridging

* USe Reticulum to Bridge multiple Reticulum interfaces (IP, LORA, etc.) 
* Optionally integrate with Meshtastic / TAK infrastructure via separate gateways .

---

## 3. Stakeholders & Personas

P-01 – Field Operator

* Uses lightweight client (browser/Electron or Android LXMF app Like Columba Like Columba) to see map, send position, and exchange messages.

P-02 – Team Leader / Dispatcher

* Manages mission rooms, assigns tasks, monitors multiple teams and zones, initiates alerts.

P-03 – System Integrator / Engineer

* Deploys R3AKT server, configures Reticulum interfaces, connects Home Assistant, manages plugins.

P-04 – System Administrator

* Maintains OS, backups, user accounts,  and overall security posture.


---

## 4. System Overview & Constraints

### 4.1 Core Technology Stack

TECH-01: Networking

* Reticulum RNS as the underlying network stack (multi-hop, crypto-based, medium-agnostic).

TECH-02: Messaging & Telemetry

* Reticulum Telemetry Hub for structured telemetry channels.
* LXMF object API (Reticulum OpenAPI project) for message-based interactions and store-and-forward.

TECH-03: Application Server

* R3AKT backend based on the Reticulum API project, exposing REST APIs and WebSocket endpoints.
* Each functional area (e.g. telemetry, messaging, mapping, integration) runs as its own process/service.

TECH-04: Client Technologies

* Browser-based client (SPA or modular web app) consuming REST + WebSocket.
* Electron-packaged desktop client(s) derived from the browser app.
* Support for existing Android LXMF clients (Sideband, Columba, etc.) via LXMF gateways.

### 4.2 Constraints

CON-01: Must function reliably on low bandwidth / high latency links typical of radio or constrained backhaul.

CON-02: Must prioritize security and privacy (end-to-end crypto, minimal metadata exposure, principled logging).

CON-03: Should run on minimal hardware (e.g. 2–4 GB RAM SBC) for small teams, with options to scale out.

CON-04: Licensing of dependencies must allow open, community-friendly distribution and commercial reuse. Main License is Eclipse Public License (EPL)

---

## 5. Functional Requirements

### 5.1 Network & Communication Layer

REQ-001 – Reticulum Node Integration

* The server shall run as one or more Reticulum nodes, able to interface with multiple physical transports (serial radios, Wi-Fi, Ethernet, TCP tunnels, etc.).

REQ-002 – Telemetry Ingestion

* A client in the system shall subscribe to telemetry streams from the Reticulum Telemetry Hub (positions, headings, status values) and map them to entities (users, vehicles, sensors).

REQ-003 – LXMF Messaging Support

* The system shall send and receive LXMF messages using the Reticulum OpenAPI LXMF object API.
* It shall be possible to define message schemas (e.g. emergency, Mission) in OpenAPi formats and map them to internal event types.

REQ-004 – Store-and-Forward Behavior

* For networks using Propagation Nodes, the server shall handle delayed delivery of messages and telemetry.

REQ-005 – Multi-Process API Design

* Each major API surface (e.g. /telemetry, /messages, /map, /integration) shall be implemented in its own process (microservice).
* Inter-process communication shall be explicit and observable (e.g. message bus, internal APIs).

REQ-006 – WebSocket Gateway

* The server shall provide one or more WebSocket endpoints for pushing live updates (positions, messages, alerts) to connected UI clients.

### 5.2 Situational Awareness Core

REQ-010 – Entity & Track Model

* The system shall maintain a model of entities (person, vehicle, asset, sensor) with:

  * Persistent IDs.
  * Type, role, affiliation.
  * Last known position, heading, speed, status.

REQ-011 – Map & Overlays

* The client shall provide map-based visualization with:

  * Basemap options (online and offline tile sources where possible).
  * Overlays for tracks, zones, routes, and mission-specific markers.

REQ-012 – Mission Rooms / Channels

* The system shall group entities, messages, and overlays into mission rooms.
* Users can switch rooms to change the operational context.

REQ-013 – Alerts & Events

* The system shall generate events from:

  * Incoming telemetry (thresholds, loss-of-signal, battery, etc.).
  * Geofences (enter, exit).
  * External integrations (e.g. Home Assistant triggers).
* Events can trigger visual alerts, sounds, and optional notifications.

REQ-014 – Timeline & Replay

* The system shall store time series of positions and events.
* Users shall be able to replay a mission segment in accelerated time.

### 5.3 Client Applications

REQ-020 – Web Client

* The primary client shall run in a standard browser (desktop, tablet), offering:

  * Login/auth.
  * Map view, mission list, entity list, event log.
  * Simple message composition and response.

REQ-021 – Electron Client

* The web client codebase shall be packable into an Electron desktop app.
* Local configuration (e.g. Reticulum config, local caching) shall be supported.

REQ-022 – Android LXMF Clients

* The server shall be able to:

  * Receive LXMF messages from existing clients (Sideband, etc.).
  * Send structured messages back to those clients.
* Mapping between generic LXMF identities (chat, file, image, telemtery) and R3AKT entities records shall be configurable.

REQ-023 – Low-Bandwidth UI Mode

* The client shall support a low-bandwidth mode with reduced map updates and simplified visuals, focusing on message and event lists.

#### 5.3.2 Web Client Frontend/Backend Communication (JavaScript ↔ Python)

REQ-035 – REST API Contract

* The JavaScript frontend shall communicate with the Python backend over a versioned REST API for:

  * Initial data loading (missions, entities, configuration, user profile).
  * On-demand queries (history, replay segments, search, configuration dialogs).
* All REST endpoints shall:

  * Be documented in an OpenAPI/Swagger specification.
  * Use stable, explicit schemas for requests/responses.
  * Return consistent error formats (including error code, message, optional details).

REQ-036 – WebSocket Channel for Live Updates

* The frontend shall establish a WebSocket connection to the Python backend for:

  * Live telemetry updates (entity positions, statuses).
  * Incoming messages and alerts.
  * Mission room state changes (joins, leaves, topic updates).
* The WebSocket protocol shall:

  * Use a simple, versioned application-level message envelope (e.g. type, version, payload, timestamp, correlation ID).
  * Support subscription semantics so the client can select which mission(s) and data streams to receive.

REQ-037 – Connection Management & Resilience

* The frontend shall:

  * Detect WebSocket disconnects and attempt controlled reconnection with backoff.
  * Fall back to periodic REST polling when WebSocket is unavailable.
* The backend shall:

  * Enforce timeouts and heartbeat/ping messages to detect stale connections.
  * Gracefully handle client reconnections, resubscribing them to their previous mission context when possible.

REQ-038 – Authentication & Session Handling

* Authentication shall be performed via a secure REST endpoint (e.g. token-based or session cookie).
* The WebSocket connection shall:

  * Reuse the authenticated session (e.g. cookie) or include an access token during handshake.
  * Be rejected if authentication fails or the token is expired/invalid.
* Token refresh or session renewal flows shall be supported without forcing full page reload where possible.

REQ-039 – Data Shaping & Delta Updates

* REST endpoints shall support pagination, filtering, and time-range parameters to limit payload size.
* WebSocket messages shall:

  * Prefer delta updates (changes only) rather than full snapshot refreshes.
  * Allow the frontend to request a full resync when needed (e.g. on large time gaps or version mismatch).

REQ-040 – Versioning & Compatibility

* Both REST and WebSocket messages shall be versioned.
* The frontend shall:

  * Include its supported API/UI version when connecting.
  * Handle backward-compatible changes without breaking.
* The backend shall:

  * Maintain compatibility across at least one previous minor version.
  * Reject incompatible client versions with a clear error and guidance.

REQ-041 – Error Handling & Telemetry

* The frontend shall:

  * Surface critical communication errors to the user in a concise, field-appropriate way (e.g. "connection lost", "reconnecting").
  * Log diagnostic details to a local in-app console when enabled.
* The backend shall:

  * Log communication errors and protocol violations for later analysis.
  * Optionally expose metrics (e.g. connection count, message rate, error rate) for observability.

REQ-042 – Security & Hardening

* All REST and WebSocket communication between frontend and backend shall be protected via TLS when crossing untrusted networks.
* Cross-Origin Resource Sharing (CORS) policies shall be explicitly configured to only allow trusted origins.
* Input validation and rate limiting shall be applied on the backend to protect against malformed or abusive clients.

REQ-043 – Offline/Degraded Mode Behavior

* When both REST and WebSocket connectivity to the backend are lost, the frontend shall:

  * Clearly indicate that it is operating in offline view-only mode.
  * Continue to allow local map interaction and viewing of last cached data.
* Upon reconnection, the frontend shall request a minimal diff or resync to bring its state up to date.

#### 5.3.1 R3AKT Mobile Android Application

REQ-024 – Primary Map-Centric Interface

* The Android app shall use a map view as the primary interface.
* The map shall display:

  * Own position and heading.
  * Positions of team members, vehicles, and relevant assets.
  * Mission overlays (zones, routes, markers) when available.

REQ-025 – Position Reporting & Tracking

* The app shall periodically publish the device GPS position via:

  * LXMF/Reticulum when operating only over radio/mesh links.
  * Direct REST/WebSocket to the R3AKT server when IP connectivity is available.
* Update frequency and accuracy shall be configurable per mission profile (e.g. high-precision vs. battery-saving mode).

REQ-026 – Mission & Topic Selection

* The app shall allow the user to:

  * Select the active mission room/topic.
  * Filter the map and event list by mission.
* The active mission context shall be clearly indicated in the UI.

REQ-027 – Messaging & Alerts

* The app shall support:

  * Receiving emergency and priority messages (UC-02).
  * Acknowledging messages and alerts with minimal interaction (e.g. single tap).
  * Composing simple text and structured messages (predefined forms, e.g. SOS, contact, MEDIVAC).
* Alerts shall be surfaced with visual and optional audio/vibration cues, even when the app is in the background.

REQ-028 – Offline & Low-Bandwidth Operation

* The app shall:

  * Cache recent map tiles and mission data for offline use.
  * Gracefully degrade to a simplified UI when bandwidth is low (e.g. symbol-only map, or list-first view).
  * Queue outgoing messages and position updates for later transmission when links are unavailable.

REQ-029 – Sensor & Orientation Integration

* The app shall use onboard sensors (GPS, compass, accelerometer/gyroscope) to:

  * Show device heading on the map.
  * Optionally support a “heads-up” or “track up” view.
* Sensor usage shall be tunable to manage battery consumption.

REQ-030 – Security & Identity

* The app shall:

  * Store cryptographic keys (Reticulum/LXMF identities) securely.
  * Support PIN/biometric app lock where available.
  * Allow binding the device identity to an R3AKT user/entity record managed on the server.

REQ-031 – Configuration Profiles

* The app shall support configuration via:

  * Local settings UI for standalone use.
  * Optional import of a configuration profile (e.g. QR code, file) distributed by an admin, including:

    * Reticulum config.
    * Server URL(s).
    * Mission presets and roles.

REQ-032 – Power & Resource Management

* The app shall offer selectable power profiles (e.g. patrol, static observation, high-activity) that adjust:

  * GPS sampling rate.
  * Position transmit interval.
  * Map and telemetry refresh intervals.
* Background services shall be used judiciously to avoid unnecessary battery drain.

REQ-033 – Field Usability

* The Android UI shall:

  * Support dark and high-contrast themes suitable for night operations.
  * Use large touch targets and minimal text for primary actions.
  * Be operable in portrait mode as the default and optionally landscape for vehicle mounts.

REQ-034 – Compatibility & Packaging

* The app shall target a realistic baseline Android API level to cover typical rugged and consumer devices.
* A signed APK/AAB shall be provided for sideloading; Play Store distribution can be considered later.

### 5.4 Integration Requirements (Home Assistant & Beyond)

REQ-030 – Home Assistant Inbound Integration

* The server shall support connecting to a Home Assistant instance, with:

  * Retrieval or subscription to selected entities and events (e.g. binary sensors, climate, GPS trackers).
  * Mapping HA entities to R3AKT entities or sensors.

REQ-031 – Home Assistant Event Translation

* Specific HA events (e.g. driveway alarm, motion detected, gate opened) shall be translated into R3AKT events with:

  * Location (if known).
  * Severity, category, and mission association.

REQ-032 – Optional Outbound Commands

* In later phases, the system may send commands back to Home Assistant (e.g. arm/disarm, trigger scenes), with strong access control.

REQ-033 – Integration Plugin Framework

* Integrations (Home Assistant, other systems) shall be packaged as plugins or microservices.
* Each integration shall declare:

  * Configuration schema.
  * Capabilities (events in, commands out).
  * Health status.

### 5.5 Plugin / Microservice Architecture

REQ-040 – Plugin Lifecycle

* The system shall define a lifecycle for plugins/services:

  * Install, enable/disable, configure, upgrade, remove.

REQ-041 – API Boundaries

* Each plugin/service exposes a clear API (REST or message bus topics).
* Core R3AKT only interacts with these APIs, not internal implementation details.

REQ-042 – Isolation & Fault Tolerance

* Failure of one plugin/service must not crash the core server.
* Health checks and restart policies should be defined (e.g. systemd, supervisor, container orchestrator).

---

## 6. Non-Functional Requirements

NFR-01 – Security & Privacy

* All communication over Reticulum is inherently encrypted; R3AKT shall not weaken this model.
* Web APIs shall enforce authentication and authorization (RBAC or similar).
* Audit logging shall be configurable and avoid storing sensitive payloads unless strictly necessary.

NFR-02 – Performance

* Target handling: at least N concurrent clients and M tracked entities on small hardware (exact numbers to be defined after first prototype).
* System should remain usable over links with very low bandwidth and high latency.

NFR-03 – Resilience

* The system shall tolerate intermittent connectivity and power loss.
* Configuration and state should be recoverable from disk after restart.

NFR-04 – Portability

* R3AKT shall run on:

  * Linux (primary target, including ARM SBCs).
  * Optionally other POSIX-like environments.

NFR-05 – Operability

* Provide basic observability:

  * Logs (structured where possible).
  * Metrics (e.g. Prometheus endpoint in later phase).
  * Health endpoints.

NFR-06 – Usability

* UI must be usable in field conditions:

  * Dark mode and high-contrast themes.
  * Support for keyboard shortcuts and minimal mouse interaction.

---

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

## Architecture & Domain Specs
Detailed architecture and domain-object specifications live here:
- docs/architecture/r3akt_Architecture.md

## 8. Implementation Phasing

### Phase 0 – Design & Spikes

* Finalize requirements and architecture.
* Spike:

  * Reticulum + Telemetry Hub integration running in a minimal demo.
  * LXMF API via Reticulum OpenAPI project.
  * Minimal REST + WebSocket northbound service pushing dummy position updates to a web page.

### Phase 1 – MVP Server & Web Client

* Implement core:

  * R3AKT Core API with missions, entities, basic events.
  * Telemetry ingestion from Reticulum Telemetry Hub.
  * LXMF messaging for simple text messages.
  * Web UI: map view, entity list, message panel.
* Package web client as Electron app.

### Phase 2 – Home Assistant Integration & Alerts

* Implement Home Assistant integration plugin.
* Define mapping between HA entities and R3AKT entities/events.
* Implement geofencing and alert rules.

### Phase 3 – Plugin Framework & Extensibility

* Solidify plugin/microservice lifecycle and configuration.
* Document plugin API and provide at least one reference plugin (Home Assistant or a simple telemetry enricher).

### Phase 4 – Hardening & Field Testing

* Security review and hardening.
* Performance and resilience tests (low bandwidth, loss of connectivity, power cycles).
* Field trials with real users and feedback loop.

---


## R3AKT MVP

### Layer 0 — “Eliopoli core” (single off-grid property)

**Primary users**

* You (operator), family members (non-technical), occasional guests/workers.

**Jobs-to-be-done**

* Map-based situational awareness on-property.
* Emergency messaging when internet/cell is down.
* “Lost animal” workflow (last seen, search sectors, sightings).
* Base coordination (house ↔ barn ↔ fields ↔ lake edge).

**MVP-0 (must ship first)**

* **Messaging:** reliable store-and-forward (queued delivery, retries, receipts).
* **Geo:** “I’m here” beacons + last known location cache.
* **Map UI:** basic map, markers, and a “lost animal” report type.
* **Offline-first:** works with no WAN; local persistence.
* **Roles:** Owner/Admin + Family users (simple).

---

### Layer 1 — “Rural/remote property network” (neighbors, farms, small communities)

**Primary users**

* Nearby farms, volunteer responders, small community coordinators.

**Jobs-to-be-done**

* Multi-household coordination.
* Shared resource board (generators, chainsaws, shelter, vehicles).
* Incident channel per event (storm, wildfire smoke, missing person/animal).

**MVP-1 (adds)**

* **Multi-group ops:** create/join “ops rooms”.
* **Resource registry:** simple list + status (available/assigned).
* **Interop export:** produce/share a minimal incident package (JSON/CoT).

---

### Layer 2 — “Political activism / demonstrations”

**Primary users**

* Demonstration organizers, marshals, medics, legal observers.

**Jobs-to-be-done**

* Team coordination under network disruption and high adversarial conditions.
* Broadcast safety notices, rendezvous points, deconfliction.
* Minimal identity exposure, compartmentalized groups.

**MVP-2 (adds)**

* **Ephemeral groups:** rotating identifiers, rapid invite, short-lived ops.
* **Privacy controls:** minimization of location sharing; per-role visibility.
* **Safety mode:** quick “I’m detained / need medic” workflow.
* **Audit-lite:** optional local-only log export for after-action.

---

### Layer 3 — “Volunteer emergency / SAR / civil defense”

**Primary users**

* Volunteer SAR, community emergency response teams.

**Jobs-to-be-done**

* Tasking, sectors, track searchers, share points of interest, attachments.

**MVP-3 (adds)**

* **Tasking:** assignments, status, check-ins.
* **File transfer:** photos/documents with integrity checks.
* **Integration:** bridges into common tooling (ATAK/CoT).

---

## MVP focus: client vs server (practical decision)

### Why “server-first” fails in practice (your own statement is correct)

A server without a dedicated client produces no adoption loop: no map UX, no habit, no field feedback, no “minimum viable usage.” You need a usable client experience immediately.

### Why “client-first” is risky (given Android complexity)

Full custom Android is a time sink unless you already have the pipeline, UI patterns, background services, battery optimizations, and offline map stack.

### Best compromise: **use an existing client + build the R3AKT “edge server” as a headless capability layer**

* Deliver value in Layer 0 immediately (Eliopoli).
* Keep Android work bounded to **plugin/bridge** scope.
* Let the “server” be the reliability, persistence, and automation engine.

Concretely:

* **R3AKT Edge Node** (Python) provides: persistence, message queueing, group/state model, bridges, policies.
* **Existing client** provides: map UI, chat UI, user familiarity.

## 6 Implementation Plan (Codex‑Ready Tasks)

### Phase 1 – Project Setup

* Initialize Python project and repository layout
* Install core dependencies
* Implement configuration loader and CLI

### Phase 2 – Schema & Model Layer

* Define JSON schemas for commands
* Generate Python dataclasses
* Implement pure domain models
* Define state machines and validators

### Phase 3 – Persistence Layer

* Configure async SQLAlchemy
* Implement ORM models
* Implement repositories

### Phase 4 – Services & Facades

* Implement domain services
* Implement idempotent facades
* Implement controllers and routing registry

### Phase 5 – Transport Services

* Implement LXMF service
* Implement HTTP gateway
* Integrate plugin manager
* Implement internal event bus

### Phase 6 – Async & Auxiliary Services

* Configure Celery for background tasks
* Optional WebSocket gateway

### Phase 7 – Security & Observability

* Authentication and RBAC
* Structured logging and metrics
* Sentry integration

### Phase 8 – Testing & Documentation

* Unit and integration tests
* LXMF + HTTP end‑to‑end tests
* Plugin tests
* Architecture and API documentation

### Phase 9 – Deployment & Operations

* systemd service files
* Docker packaging
* Monitoring stack

### Phase X - Future Extensions

* Multi‑transport support (MQTT, CLI)
* Plugin marketplace
* Automatic schema discovery
* Event subscription framework
* Edge‑to‑cloud bridge

## 9. Open Questions / To-Refine

OQ-01: Exact data model for entities and missions (align with prior R3AKT modeling work).
OQ-02: Choice of base map technology and offline tile strategy.
OQ-03: Concrete performance targets (number of clients / tracks / events) for typical deployments.
OQ-04: Detailed Home Assistant integration patterns (poll vs. webhook vs. MQTT, etc.).
OQ-05: Governance of plugins (signing, trust model, distribution).
These can be resolved iteratively as the design doc and prototypes evolve.

## Next Steps

* map this spec to an existing R3AKT schema
* define the C2 profile formally
* produce a reference Python implementation
* define discovery and announce rules for `r3akt.space`

State which one.