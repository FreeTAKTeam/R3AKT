# ADR-0002: AsyncAPI for Reticulum LXMF, OpenAPI for HTTP

- Date: 2026-02-06
- Status: Accepted

## Context

Reticulum/LXMF interactions are asynchronous command/event flows.
Existing docs alternated between OpenAPI-only and AsyncAPI-first descriptions.

## Decision

Contract authority is split by interaction type:
- AsyncAPI is authoritative for Reticulum/LXMF commands, events, and message schemas.
- OpenAPI is authoritative for northbound HTTP control APIs and auxiliary HTTP endpoints.

## Consequences

- Matches protocol semantics for mesh/offline messaging.
- Clarifies contract ownership for implementation and validation.
- Requires explicit mapping tests between HTTP operations and AsyncAPI-defined command/event messages.
