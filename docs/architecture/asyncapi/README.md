# R3AKT AsyncAPI Contracts

This directory is the canonical home for Reticulum/LXMF interaction contracts.

## Scope

- Commands and events exchanged over LXMF
- Message schemas for control-plane and data-plane interactions
- Version compatibility notes for mesh deployments

## Authority Model

- AsyncAPI in this directory is authoritative for Reticulum/LXMF interactions.
- OpenAPI in `docs/architecture/openapi/` is authoritative for northbound HTTP APIs.
- Any HTTP command endpoint that triggers LXMF behavior must map to an AsyncAPI-defined message.

## Artifacts

- `r3akt-core-lxmf.asyncapi.yaml`
- `r3akt-analytics-lxmf.asyncapi.yaml`
- `r3akt-gateway-lxmf.asyncapi.yaml`
- `r3akt-agent-runtime-lxmf.asyncapi.yaml`
