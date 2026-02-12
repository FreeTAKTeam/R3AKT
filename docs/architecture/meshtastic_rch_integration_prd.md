# Meshtastic Integration with Reticulum Community Hub (RCH)
## Product Requirements Document (PRD)

---

## 1. Purpose

This document defines the product requirements for integrating Meshtastic LoRa devices with the Reticulum Community Hub (RCH).

The goal is to allow RCH to ingest Meshtastic telemetry and broadcast chat data over WiFi and forward it into the Reticulum ecosystem. The integration runs as a separate process on the same machine as RCH and acts as a southbound Meshtastic adapter and northbound Reticulum relay.

Initial release scope is ingestion-only.

---

## 2. Scope

### Included (V1)
- WiFi connection to ESP32-based Meshtastic devices
- Connection to default Meshtastic channel (channel 0)
- Ingestion of:
  - GPS position telemetry (TAK tracker role assumed)
  - Broadcast chat messages (non-encrypted channel)
- Forwarding to RCH via REST API
- Proxying all traffic through a single RCH Reticulum identity
- Representing Meshtastic nodes as RCH "objects"
- Stateless relay behavior
- CLI control (start, stop, status)
- Configuration via config.ini

### Excluded (V1)
- Bluetooth connectivity
- Serial connectivity
- Direct message bridging
- Encrypted Meshtastic chat bridging
- Bidirectional communication (Reticulum → Meshtastic)
- Persistence of node metadata
- Rate limiting and LoRa bandwidth management

---

## 3. High-Level Architecture

### 3.1 Logical Components

1. Meshtastic Adapter (Southbound)
2. RCH Bridge Core
3. RCH REST Client (Northbound)
4. CLI Controller

### 3.2 Communication Flow

Southbound:
Meshtastic ESP32 device (WiFi) → Meshtastic Adapter → Bridge Core

Northbound:
Bridge Core → RCH REST API → Reticulum Network

All Reticulum traffic originates from a single RCH identity.

---

## 4. Functional Requirements

### FR-1 WiFi Connectivity
The system shall connect via WiFi to an ESP32-based Meshtastic device that exposes its interface over the local network.

The device may be remote but must be reachable over the same IP network.


### FR-2 Channel Subscription
The system shall subscribe to Meshtastic channel 0 by default.

Channel configuration shall be adjustable in config.ini.


### FR-3 Telemetry Ingestion (GPS)
The system shall ingest position telemetry from Meshtastic nodes configured as "TAK tracker" role.

Telemetry includes:
- Latitude
- Longitude
- Altitude (if available)
- Timestamp


### FR-4 Chat Ingestion (Broadcast)
The system shall ingest broadcast chat messages from non-encrypted Meshtastic channels.

Direct messages are excluded from V1.


### FR-5 Object Mapping
Each Meshtastic node shall appear in RCH as an "object".

Characteristics:
- Object identifier derived from Meshtastic node ID
- Display name derived from Meshtastic long/short name
- All objects are transmitted under a single RCH Reticulum identity


### FR-6 REST Forwarding
The system shall forward:
- Telemetry as object position updates
- Chat messages as topic messages

Forwarding shall occur via RCH REST API.


### FR-7 Stateless Operation
The system shall not persist:
- Node metadata
- Last known positions
- Chat history

All data is processed in-memory and forwarded.


### FR-8 CLI Control
The application shall run as a console-driven service.

Minimum commands:
- start
- stop
- status

Status must report:
- Connection state
- Number of active Meshtastic nodes observed
- Last telemetry received timestamp


### FR-9 Configuration
All configuration shall be defined in config.ini.

Configuration parameters:

[meshtastic]
host = 192.168.1.100
port = 4403
channel = 0

[rch]
rest_url = http://localhost:8080
api_token = <token>
identity = default

[general]
log_level = INFO

The system assumes conventions for unspecified parameters.

---

## 5. Non-Functional Requirements

### NFR-1 Deployment
The service shall run on the same machine as RCH.


### NFR-2 Reliability
If connection to Meshtastic is lost:
- The system shall attempt automatic reconnection.

If RCH REST endpoint is unavailable:
- Messages shall be dropped (no persistence).


### NFR-3 Security
Meshtastic data shall be passed through as-is.

Encryption and security controls are assumed to exist within Reticulum.


### NFR-4 Performance
The system shall process telemetry and chat in near real-time.

No rate limiting is required in V1.


---

## 6. Data Mapping Model

### 6.1 Meshtastic Node → RCH Object

Meshtastic Node ID → RCH object_id
Meshtastic Long Name → object.display_name


### 6.2 Position Mapping

Meshtastic GPS packet → RCH Object Position Update

Fields:
- object_id
- latitude
- longitude
- altitude
- timestamp


### 6.3 Chat Mapping

Meshtastic Broadcast Message → RCH Topic Message

Fields:
- source_object_id
- message_text
- timestamp


---

## 7. Failure Handling

Scenario: Meshtastic WiFi unreachable
Action: Retry with exponential backoff.

Scenario: RCH REST unreachable
Action: Drop message and log error.

Scenario: Invalid packet
Action: Ignore and log.


---

## 8. Future Extensions (Out of Scope for V1)

- Bidirectional bridging
- Encrypted Meshtastic channel support
- Direct message bridging
- Persistent node registry
- WebUI management
- Internal API exposure
- Federation-aware routing
- Rate limiting and LoRa constraints management


---

## 9. CLI Specification

Command: start
Starts Meshtastic bridge.

Command: stop
Stops Meshtastic bridge.

Command: status
Returns JSON summary:
{
  "state": "running",
  "meshtastic_connected": true,
  "observed_nodes": 4,
  "last_packet": "2026-02-12T12:30:00Z"
}


---

## 10. Deployment Model

The bridge runs as:
- Standalone process
- Same host as RCH
- Can be wrapped in systemd service
- Containerization optional (future)


---

## 11. Phased Roadmap

Phase 1:
- Ingestion of GPS + broadcast chat
- Stateless relay
- CLI control

Phase 2:
- REST control API
- WebUI integration

Phase 3:
- Bidirectional messaging
- Encrypted channel bridging
- Topic-based routing

---

## 12. Acceptance Criteria

The integration is considered complete when:
- A Meshtastic node configured as TAK tracker sends GPS
- RCH displays corresponding object position
- Broadcast chat appears in RCH topic
- CLI start/stop/status operate correctly
- Service reconnects automatically after WiFi interruption

---

End of Document

