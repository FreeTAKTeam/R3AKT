# ADR-0003: Explicit Capability Authorization on Every Command

- Date: 2026-02-06
- Status: Accepted

## Context

R3AKT requires strong identity governance and auditability.
Earlier architecture notes included an ambiguous position where commands were not explicitly authorized.

## Decision

Every command is authorized explicitly against caller capabilities before execution.
Unauthorized commands are rejected and recorded in audit logs.

## Consequences

- Improves trust-boundary enforcement for both LXMF and HTTP entrypoints.
- Aligns command execution with admin-managed capability governance.
- Adds required policy checks and audit events to command handling paths.
