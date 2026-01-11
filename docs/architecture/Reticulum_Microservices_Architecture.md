# Reticulum-Based Microservices Architecture for Codex

## Introduction

This document specifies a **Reticulum-based microservices architecture** implemented in **Python**. Microservices discover each other using **Reticulum announces**, and communicate using **fully asynchronous, event-driven** messaging.

Messages between services use **LXMF** as the envelope (command vs body separation) and **MessagePack** for compact serialization. Each service persists its own state using **SQLAlchemy**.

Primary deployment target is **edge / cross-platform**, typically **single-node**, with a clear path to **scale-out across multiple Reticulum-connected nodes**.

## Goals and Non-Goals

### Goals

- Loose coupling: services interact only through messages (no shared code/data).
- Event-driven: all interactions are asynchronous; no blocking RPC as the primary pattern.
- Hot deploy: add/replace extensions (services) without stopping the whole system.
- Cross-platform edge readiness: Linux (including SBCs), Windows/macOS as feasible.
- Security by default: Reticulum identities + encrypted messaging.

### Non-Goals (initial)

- A centralized service registry or broker.
- Global strong consistency across services (eventual consistency is acceptable).
- Requiring IP connectivity (Reticulum may run over IP, but does not depend on it).

## [Document continues exactly as in canvas...]
