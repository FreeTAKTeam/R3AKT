# ADR-0001: Hybrid Core Modular Monolith Plus Auxiliary Services

- Date: 2026-02-06
- Status: Accepted

## Context

R3AKT documentation described both full microservice decomposition and modular-monolith approaches.
The project targets low-power, intermittently connected deployments where operational simplicity matters.

## Decision

R3AKT uses a hybrid architecture:
- Core mission-critical bounded contexts run in a modular monolith on the authoritative node.
- Auxiliary capabilities (analytics, gateways, agent runtime, optional integrations) run as separate services when needed.

## Consequences

- Improves deployment simplicity and resilience for SBC-class hardware.
- Preserves clear extension points without forcing early distributed-systems complexity.
- Requires explicit contracts and boundaries between core and auxiliary services to avoid tight coupling.
